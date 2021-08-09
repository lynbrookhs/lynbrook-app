import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import TabBarIcon from "./TabBarIcon";
import ActivitiesNavigator from "./tabs/ActivitiesNavigator";
import EventsNavigator from "./tabs/EventsNavigator";
import HomeNavigator from "./tabs/HomeNavigator";
import NewsNavigator from "./tabs/NewsNavigator";
import SettingsNavigator from "./tabs/SettingsNavigator";

type BottomTabParamList = {
  NewsTab: undefined;
  ActivitiesTab: undefined;
  HomeTab: undefined;
  EventsTab: undefined;
  SettingsTab: undefined;
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
      <BottomTab.Navigator initialRouteName="HomeTab" screenOptions={{ headerShown: false }}>
        <BottomTab.Screen
          name="NewsTab"
          component={NewsNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("newspaper"), tabBarLabel: "News" }}
        />
        <BottomTab.Screen
          name="ActivitiesTab"
          component={ActivitiesNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("time"), tabBarLabel: "Activities" }}
        />
        <BottomTab.Screen
          name="HomeTab"
          component={HomeNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("home"), tabBarLabel: "Home" }}
        />
        <BottomTab.Screen
          name="EventsTab"
          component={EventsNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("calendar"), tabBarLabel: "Events" }}
        />
        <BottomTab.Screen
          name="SettingsTab"
          component={SettingsNavigator}
          options={{ tabBarIcon: ioniconsTabIcon("settings"), tabBarLabel: "Settings" }}
        />
      </BottomTab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
