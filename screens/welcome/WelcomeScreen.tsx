import { Ionicons } from "@expo/vector-icons";
import React, { PropsWithChildren } from "react";
import { Button, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Divider from "../../components/Divider";
import Stack from "../../components/Stack";
import { useSignInWithProvider } from "../../helpers/api/auth";
import { WelcomeScreenProps } from "../../navigation/AuthNavigator";

type WelcomeItemProps = PropsWithChildren<{
  icon: keyof typeof Ionicons.glyphMap;
}>;

const WelcomeItem = ({ icon, children }: WelcomeItemProps) => (
  <Stack direction="row" align="center">
    <View style={tw`w-14 h-14 bg-gray-100 rounded-full items-center justify-center mr-5`}>
      <Ionicons name={icon} style={tw`text-2xl`} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-base`}>{children}</Text>
    </View>
  </Stack>
);

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { signInWithProvider, error } = useSignInWithProvider("google");

  return (
    <ScrollView contentContainerStyle={tw`flex-1`}>
      <Stack spacing={8} style={tw`flex-1 justify-center p-6`}>
        <Text style={tw`text-3xl font-bold text-center`}>Welcome</Text>

        {error && <APIError error={error} style={tw`m-0`} />}

        <Stack spacing={4} divider={<Divider />}>
          <WelcomeItem icon="newspaper">
            Stay up-to-date with announcements from LHS, ASB, and your clubs.
          </WelcomeItem>
          <WelcomeItem icon="calendar">
            Check out upcoming school events and other important dates.
          </WelcomeItem>
          <WelcomeItem icon="time">
            View daily class and club schedules, including special schedule weeks.
          </WelcomeItem>
          <WelcomeItem icon="gift">
            Earn points for participating in events and use them to redeem rewards and win class
            competitions!
          </WelcomeItem>

          <View>
            <Text style={tw`text-sm text-center text-gray-500`}>Sign in using</Text>
            <Button title="FUHSD Google Account" onPress={signInWithProvider} />
            <Text style={tw`text-sm text-center text-gray-500`}>or</Text>
            <Button title="Continue as Guest" onPress={() => navigation.navigate("GuestLogin")} />
          </View>
        </Stack>
      </Stack>
    </ScrollView>
  );
};

export default WelcomeScreen;
