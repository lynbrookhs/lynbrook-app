import { Ionicons } from "@expo/vector-icons";
import React, { cloneElement, ReactElement, useEffect, useState } from "react";
import { ActivityIndicator, Button, Text } from "react-native";
import { mutate } from "swr";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import { useRequest } from "../../helpers/api";
import { Event, EventSubmissionType } from "../../helpers/api/models";
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
    <Button title="Close" onPress={() => navigation.goBack()} />
  </Stack>
);

const QRCodeScannedModal = ({ navigation, route }: QRCodeScannedModalProps) => {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const { request, error } = useRequest();

  useEffect(() => {
    (async () => {
      if (route.params.type === EventSubmissionType.CODE) {
        setEvent(await request<Event>("POST", "/users/me/events/", { code: route.params.code }));
      } else if (route.params.type === EventSubmissionType.FILE) {
        const file = await fetch(route.params.fileUri);
        const blob = await file.blob();
        console.log(blob.type);
        setEvent(await request<Event>("POST", "/users/me/events/", { id: route.params.event.id }));
      }
      mutate("/events/");
      mutate("/users/me/");
      mutate("/users/me/memberships/");
    })();
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
  if (!event) return <ActivityIndicator style={tw`m-4`} />;

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
