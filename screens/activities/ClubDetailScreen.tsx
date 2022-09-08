import { useOrg } from "lynbrook-app-api-hooks";
import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { ClubDetailScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ClubDetailScreen = ({ navigation, route }: ClubDetailScreenProps) => {
  const { data: org, error } = useOrg(route.params.id);

  useEffect(() => {
    if (org) {
      navigation.setOptions({ title: org.name });
    }
  }, [org]);

  if (error) return <APIError error={error} />;
  if (!org) return <Loading />;

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{org.name}</Text>
        {org.day !== undefined && org.day !== null && (
          <Text style={tw`text-sm text-gray-500`}>
            {WEEKDAYS[org.day]}
            {org.time && ` ${org.time}`}
            {org.location && ` @ ${org.location}`}
          </Text>
        )}
      </Stack>
      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-3`}>
        <Text>{org.description ?? "No description found."}</Text>
      </ScrollView>
    </Stack>
  );
};

export default ClubDetailScreen;
