import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorMode } from "native-base";
import * as React from "react";
import BottomTabNavigator from "./BottomTabNavigator";
import { linking } from "./config";

type RootStackParamList = {
  Root: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const { colorMode } = useColorMode();

  return (
    <NavigationContainer linking={linking} theme={colorMode === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
