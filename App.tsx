import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
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
        <View style={tw`flex-1 p-4`}>
          <Navigation />
        </View>
      </AuthProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export default App;
