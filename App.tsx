import Constants, { AppOwnership } from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState, AppStateStatus, Linking, Platform, Text } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as semver from "semver";
import * as Sentry from "sentry-expo";
import useSWR from "swr";
import tw from "tailwind-react-native-classnames";

import AuthProvider from "./components/AuthProvider";
import FilledButton from "./components/FilledButton";
import Stack from "./components/Stack";
import { apiFetcher } from "./helpers/api";
import { AppVersion } from "./helpers/api/models";
import useCachedResources from "./helpers/useCachedResources";
import Navigation from "./navigation";

Sentry.init({ dsn: "https://24af5d48ffe84346ad39a6dd6f304ff0@o951004.ingest.sentry.io/5899693" });

const isActive = (x: AppStateStatus) => x === "active";

const NeedUpdate = () => (
  <Stack style={tw`flex-1 justify-center p-8`} spacing={4} align="center">
    <Text style={tw`text-lg font-bold`}>Update Required</Text>
    <Text style={tw`text-base text-center`}>
      Please download the latest update from the{" "}
      {Platform.OS === "android" ? "Play Store" : "App Store"} in order to continue using the app.
    </Text>
    <FilledButton
      onPress={() =>
        Linking.openURL(
          Platform.OS === "android"
            ? "https://play.google.com/store/apps/details?id=org.fuhsd.lhs.app"
            : "https://apps.apple.com/us/app/lynbrook-high-school/id1530326385"
        )
      }
    >
      Open Store
    </FilledButton>
  </Stack>
);

const Root = () => {
  // const { token } = useAuth();
  // const { request } = useRequest();

  // useEffect(() => {
  //   (async () => {
  //     if (!token) return;

  //     if (Constants.isDevice) {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       if (status !== "granted") return;

  //       const { data } = await Notifications.getExpoPushTokenAsync({
  //         experienceId: "@mcparadip/lhs-app",
  //       });
  //       await request("POST", "/users/me/tokens/", { token: data });
  //     }

  //     if (Platform.OS === "android") {
  //       await Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.MAX,
  //         vibrationPattern: [0, 250, 250, 250],
  //         lightColor: "#FF231F7C",
  //       });
  //     }
  //   })();
  // }, [token]);

  return <Navigation />;
};

const App = () => {
  const isLoadingComplete = useCachedResources();
  const appState = useRef(AppState.currentState);
  const [, setActive] = useState(appState.current === "active");

  const {
    data: appVersion,
    error,
    revalidate,
  } = useSWR<AppVersion>("https://lynbrookasb.org/api/app_version/", apiFetcher());

  const checkUpdate = useCallback(async () => {
    revalidate();

    try {
      const check = await checkForUpdateAsync();
      if (!check.isAvailable) return;
      const update = await fetchUpdateAsync();
      if (!update.isNew) return;
    } catch {
      return;
      // In development mode or cannot communicate.
    }

    Alert.alert(
      "Update Available",
      "The app has been updated and will now reload.",
      [{ text: "OK", onPress: reloadAsync }],
      { cancelable: false }
    );
  }, []);

  const handleAppStateChange = (newState: AppStateStatus) => {
    if (!isActive(appState.current) && isActive(newState)) checkUpdate();
    appState.current = newState;
    setActive(newState === "active");
  };

  useEffect(() => {
    checkUpdate();
    AppState.addEventListener("change", handleAppStateChange);
    return () => AppState.removeEventListener("change", handleAppStateChange);
  }, []);

  if (!isLoadingComplete || !appVersion) return null;

  if (!error && (Constants.appOwnership === AppOwnership.Standalone || !Constants.appOwnership)) {
    const neededVersion = semver.coerce(appVersion[Platform.OS] ?? 0);
    const currentVersion = semver.coerce(Constants.nativeBuildVersion);
    if (neededVersion && currentVersion && semver.gt(neededVersion, currentVersion)) {
      return <NeedUpdate />;
    }
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export default App;
