import { StatusBar } from "expo-status-bar";
import { extendTheme, NativeBaseProvider } from "native-base";
import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

const theme = extendTheme({ config });

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
