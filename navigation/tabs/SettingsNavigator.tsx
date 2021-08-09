import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SettingScreen from "../../screens/settings/SettingsScreen";
import { screenOptions } from "../config";

type SettingsParamList = {
  SettingsScreen: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsParamList>();

const HomeNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingScreen}
        options={{ headerTitle: "Settings" }}
      />
    </SettingsStack.Navigator>
  );
};

export default HomeNavigator;
