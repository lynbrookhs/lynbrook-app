import { format, parseISO } from "date-fns";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import markdownStyles from "../../helpers/markdownStyles";
import { useEvent, useUser } from "../../helpers/api";
import { SpecialEventsScreenProps } from "../../navigation/tabs/HomeNavigator";

const CLASSES = ["2022", "2023", "2024", "2025"];

const SpecialEventsScreen = ({ navigation, route }: SpecialEventsScreenProps) => {
  const { data: user, error } = useUser();

  const { data: event, error: error2 } = useEvent(route.params.id);
  const { data: event2, error: error3 } = useEvent(10);

  useEffect(() => {
    if (event) {
      navigation.setOptions({ headerTitle: event.name });
    }
  }, [event]);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (error3) return <APIError error={error3} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!event) return <ActivityIndicator style={tw`m-4`} />;
  if (!event2) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Stack style={tw`flex-1`}>
      <Stack spacing={1} style={tw`bg-white border-b border-gray-200 p-4`}>
        <Text style={tw`text-2xl font-bold`}>{event.name}</Text>
        <Text style={tw`text-sm`}>
          {format(parseISO(event.start), "M/dd")} - {format(parseISO(event.end), "M/dd")}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white flex-1`}>
        <View style={tw`p-3`}>
          <Stack spacing={2}>
            <Text style={tw`text-lg font-bold`}>Leaderboard</Text>
            {CLASSES.map((c, idx) => (
              <Text key={idx} style={tw`text-lg`}>{c}: {event2.leaderboard[c] ? event2.leaderboard[c] * event2.points : 0}</Text>
            ))}
            <Text style={tw`text-lg font-bold`}>Event Description</Text>
            <Markdown style={markdownStyles}>{event.description}</Markdown>
          </Stack>
        </View>
      </ScrollView>
    </Stack>
  );
};

export default SpecialEventsScreen;
