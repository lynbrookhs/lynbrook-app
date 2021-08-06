import React from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack from "../../components/Stack";

const ScheduleScreen = () => {
  return (
    <Stack spacing={4} style={tw`flex-1 p-4`}>
      <Text>Schedule</Text>
    </Stack>
  );
};

export default ScheduleScreen;
