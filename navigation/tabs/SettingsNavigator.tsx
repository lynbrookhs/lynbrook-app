import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import SettingScreen from "../../screens/settings/SettingsScreen";
import { screenOptions } from "../config";

export type SettingsTabParamList = {
  Settings: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsTabParamList>();

const HomeNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerTitle: "Settings" }}
      />
    </SettingsStack.Navigator>
  );
};

export default HomeNavigator;
