import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import TabBarIcon from "./TabBarIcon";
import ActivitiesNavigator from "./tabs/ActivitiesNavigator";
import HomeNavigator from "./tabs/HomeNavigator";
import NewsNavigator from "./tabs/NewsNavigator";
import SettingsNavigator from "./tabs/SettingsNavigator";

type BottomTabParamList = {
  News: undefined;
  Activities: undefined;
  Home: undefined;
  Settings: undefined;
};

const ioniconsTabIcon =
  (icon: keyof typeof Ionicons.glyphMap) =>
  ({ color }: { color: string }) =>
    <TabBarIcon name={icon} color={color} />;

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <>
      <StatusBar style="light" />
      <BottomTab.Navigator initialRouteName="Home">
        <BottomTab.Screen
          name="News"
          component={NewsNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("newspaper") }}
        />

        <BottomTab.Screen
          name="Activities"
          component={ActivitiesNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("time") }}
        />

        <BottomTab.Screen
          name="Home"
          component={HomeNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("home") }}
        />

        <BottomTab.Screen
          name="Settings"
          component={SettingsNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("settings") }}
        />
      </BottomTab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
