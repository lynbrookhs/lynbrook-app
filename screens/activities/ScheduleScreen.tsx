import React from "react";
import { ActivityIndicator, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Stack from "../../components/Stack";
import { useCurrentSchedule } from "../../helpers/api";

const ScheduleScreen = () => {
  const { data: schedule, error } = useCurrentSchedule();

  if (error) return <APIError error={error} />;
  if (!schedule) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Stack spacing={4} style={tw`flex-1 p-4`}>
      <Text>Schedule</Text>
    </Stack>
  );
};

export default ScheduleScreen;
