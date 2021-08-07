import { format } from "date-fns";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import { useOrg } from "../../helpers/api";
import markdownStyles from "../../helpers/markdownStyles";
import { ClubsDetailScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

const ClubsDetailScreen = ({ navigation, route }: ClubsDetailScreenProps) => {
  const { data: org, error } = useOrg(route.params.id);

  useEffect(() => {
    if (org) {
      navigation.setOptions({ headerTitle: org.name });
    }
  }, [org]);

  if (error) return <APIError error={error} />;
  if (!org) return <ActivityIndicator style={tw`m-4`} />;

//   console.log(org)

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{org.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>{org.day}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          {/* {format(new Date(org.date), "EEEE, MMMM d y")} */}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white p-3 flex-1`}>
        <Markdown style={markdownStyles}>{org.link}</Markdown>
      </ScrollView>
    </Stack>
  );
};

export default ClubsDetailScreen;
