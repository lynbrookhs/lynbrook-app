import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useSignInWithProvider } from "lynbrook-app-api-hooks";
import React, { PropsWithChildren } from "react";
import { Button, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Divider from "../../components/Divider";
import Stack from "../../components/Stack";
import { WelcomeScreenProps } from "../../navigation/AuthNavigator";

// Backend-hosted bounce page whitelisted on the Google OAuth client; it forwards
// the OAuth callback params to the app via the lhs:// scheme.
const AUTH_REDIRECT_PAGE = "https://lynbrookasb.org/auth/redirect/";
const APP_RETURN_URL = Linking.createURL("auth");

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
  const { makeAuthorizationUri, handleProviderCallback, error } = useSignInWithProvider("google");

  const signInWithProvider = async () => {
    // Google's OAuth client only accepts https redirect URIs, so we redirect to a
    // static bounce page that immediately forwards the code/state to the lhs:// scheme.
    const authUrl = await makeAuthorizationUri(AUTH_REDIRECT_PAGE);
    const res = await WebBrowser.openAuthSessionAsync(authUrl, APP_RETURN_URL);
    if (res.type !== "success") return console.error(res);
    const { queryParams } = Linking.parse(res.url);
    if (!queryParams) return console.error(res);
    await handleProviderCallback(queryParams as Record<string, string>);
  };

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
