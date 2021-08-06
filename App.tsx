import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "./components/AuthProvider";
import useCachedResources from "./helpers/useCachedResources";
import Navigation from "./navigation";

const App = () => {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

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
