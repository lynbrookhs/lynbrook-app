import React from "react";
import { ActivityIndicator, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import { useAuth } from "../../components/AuthProvider";
import Stack from "../../components/Stack";
import { useSchedules } from "../../helpers/api";

const HomeScreen = () => {
  const { data: schedules, error } = useSchedules();
  const { signOut } = useAuth();

  if (error) {
    return (
      <Alert
        style={tw`m-6`}
        status="error"
        title="Error"
        description="An unknown error has occurred. Please try again."
      />
    );
  }

  if (!schedules) {
    return <ActivityIndicator style={tw`m-4`} />;
  }

  return (
    <Stack spacing={4} style={tw`flex-1 p-4`}>
      <Text>Schedule</Text>
    </Stack>
  );
};

export default HomeScreen;
