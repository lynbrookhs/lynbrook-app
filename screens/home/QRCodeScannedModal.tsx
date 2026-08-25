import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { FileSystemUploadType } from "expo-file-system";
import { apiPath, Event, EventSubmissionType, useRequest } from "lynbrook-app-api-hooks";
import React, { cloneElement, ReactElement, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { mutate } from "swr";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { QRCodeScannedModalProps } from "../../navigation";

type ContentProps = Pick<QRCodeScannedModalProps, "navigation"> & {
  icon: ReactElement;
  title: string;
  description: string;
};

const Content = ({ navigation, icon, title, description }: ContentProps) => (
  <Stack style={tw`flex-1 p-8 justify-center`} align="center" spacing={4}>
    {cloneElement(icon, { style: [icon.props.style, { fontSize: 64 }] })}
    <Text style={tw`text-xl font-bold text-center`}>{title}</Text>
    <Text style={tw`text-sm text-gray-500 text-center`}>{description}</Text>
    <Button
      title="Close"
      onPress={() => navigation.navigate("Main", { screen: "HomeTab", params: { screen: "Home" } })}
    />
  </Stack>
);

const QRCodeScannedModal = ({ navigation, route }: QRCodeScannedModalProps) => {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const { requestWithFunc, request, error } = useRequest();

  const submitCode = async () => {
    if (route.params.type !== EventSubmissionType.CODE && route.params.type !== undefined) return;
    const event = await request<Event>("POST", "/users/me/events/", {
      code: route.params.code,
    });
    setEvent(event);
  };

  const submitFile = async () => {
    if (route.params.type !== EventSubmissionType.FILE) return;
    const { uri } = route.params.file;
    const event_id = route.params.event.id.toString();

    const event = await requestWithFunc<Event>(async (token) => {
      const url = apiPath("/users/me/events/").toString();
      const result = await FileSystem.uploadAsync(url, uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: { event_id },
      });
      if (result.status < 200 || result.status > 299) {
        throw { status: result.status, url };
      }
      return JSON.parse(result.body);
    });

    setEvent(event);
  };

  useEffect(() => {
    Promise.all([submitCode(), submitFile()]).then(() => {
      mutate("/events/");
      mutate("/users/me/");
      mutate("/users/me/memberships/");
    });
  }, [route.params]);

  if (error?.status === 404) {
    return (
      <Content
        navigation={navigation}
        icon={<Ionicons name="close-circle" style={tw`text-red-500`} />}
        title="Event Not Found"
        description="The code you scanned did not correspond to a valid event. Please check and try again."
      />
    );
  }

  if (error?.status === 409) {
    return (
      <Content
        navigation={navigation}
        icon={<Ionicons name="close-circle" style={tw`text-red-500`} />}
        title="Already Claimed"
        description="Nice try, but you have already signed into this event and received points for doing so."
      />
    );
  }

  if (error) return <APIError error={error} />;
  if (!event) return <Loading />;

  return (
    <Content
      navigation={navigation}
      icon={<Text>🎉</Text>}
      title={`Signed Into ${event.name}`}
      description={`You claimed ${event.points} ${event.organization.name} points.`}
    />
  );
};

export default QRCodeScannedModal;
