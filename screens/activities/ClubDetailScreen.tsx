import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import { useOrg } from "../../helpers/api";
import { ClubDetailScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

const ClubDetailScreen = ({ navigation, route }: ClubDetailScreenProps) => {
  const { data: org, error } = useOrg(route.params.id);

  useEffect(() => {
    if (org) {
      navigation.setOptions({ headerTitle: org.name });
    }
  }, [org]);

  if (error) return <APIError error={error} />;
  if (!org) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{org.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>{org.day}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          {/* {format(new Date(org.date), "EEEE, MMMM d y")} */}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white p-3 flex-1`}>{org.link}</ScrollView>
    </Stack>
  );
};

export default ClubDetailScreen;
