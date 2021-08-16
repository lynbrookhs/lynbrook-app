import { format, parseISO } from "date-fns";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import { useEvent, useUser } from "../../helpers/api";
import { SpecialEventsScreenProps } from "../../navigation/tabs/HomeNavigator";

const SpecialEventsScreen = ({ navigation, route }: SpecialEventsScreenProps) => {
  const { data: user, error } = useUser();
  const { data: event, error: error2 } = useEvent(route.params.id);

  useEffect(() => {
    if (event) {
      navigation.setOptions({ headerTitle: event.name });
    }
  }, [event]);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!event) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <ScrollView style={tw`flex-1`}>
      <Stack spacing={4} style={tw`p-4`}>
        <Stack spacing={1}>
          <Text style={tw`text-3xl font-bold`}>{event.name}</Text>
          <Text style={tw`text-sm`}>
            {format(parseISO(event.start), "M/dd")} - {format(parseISO(event.end), "M/dd")}
          </Text>
        </Stack>
        <Text style={tw`text-base`}>{event.description}</Text>
      </Stack>
    </ScrollView>
  );
};

export default SpecialEventsScreen;
