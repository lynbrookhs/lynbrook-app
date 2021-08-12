import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { parseISO, format } from "date-fns";
import { ActivityIndicator, EventEmitter, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import ProgressCircle from "react-native-progress-circle";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import { useEvent, useUser } from "../../helpers/api";
import { OrganizationType } from "../../helpers/api/models";
import { SpecialEventsScreenProps } from "../../navigation/tabs/HomeNavigator";

type RewardItemProps = {
  name: string;
  description: string;
  points: number;
  organization: string;
};

const RewardItem = ({ name, description, points, organization }: RewardItemProps) => (
  <Card header={name && <Stack><Text style={tw`text-2xl font-bold`}>{name}</Text><Text style={tw`text-xl`}>{description}</Text></Stack>} key={name}>
    <Stack direction="row" spacing={6} align="center">
      <Stack style={tw`flex-1`}>
        <Stack direction="row" spacing={2} align="center">
          <Text style={tw`text-4xl font-bold`}>{points}</Text>
          <Text style={tw`text-2xl`}>{organization} Points</Text>
        </Stack>
      </Stack>
    </Stack>
  </Card>
);

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
            <Text style={tw`text-sm`}>{format(parseISO(event.start), "MM/dd")} - {format(parseISO(event.end), "MM/dd")}</Text>
        </Stack>
        <Text style={tw`text-base`}>{event.description}</Text>
      </Stack>
    </ScrollView>
  );
};

export default SpecialEventsScreen;
