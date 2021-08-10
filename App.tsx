import { StatusBar } from "expo-status-bar";
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";
import AuthProvider from "./components/AuthProvider";
import useCachedResources from "./helpers/useCachedResources";
import Navigation from "./navigation";

Sentry.init({
  dsn: "https://24af5d48ffe84346ad39a6dd6f304ff0@o951004.ingest.sentry.io/5899693",
  enableInExpoDevelopment: true,
});

const isActive = (x: AppStateStatus) => x === "active";

const App = () => {
  const isLoadingComplete = useCachedResources();
  const appState = useRef(AppState.currentState);
  const [active, setActive] = useState(appState.current === "active");

  const checkUpdate = async () => {
    try {
      const check = await checkForUpdateAsync();
      if (!check.isAvailable) return;
      const update = await fetchUpdateAsync();
      if (!update.isNew) return;
    } catch {
      return;
      // In development mode or cannot communicate.
    }

    Alert.alert("Update Available", "The app has been updated and will now reload.", [
      { text: "OK", onPress: reloadAsync },
    ]);
  };

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

  if (!isLoadingComplete) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export default App;
