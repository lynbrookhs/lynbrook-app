import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as React from "react";

import TabBarIcon from "./TabBarIcon";
import ActivitiesNavigator, { ActivitiesTabParamList } from "./tabs/ActivitiesNavigator";
import EventsNavigator, { EventsTabParamList } from "./tabs/EventsNavigator";
import HomeNavigator, { HomeTabParamList } from "./tabs/HomeNavigator";
import NewsNavigator, { NewsTabParamList } from "./tabs/NewsNavigator";
import SettingsNavigator, { SettingsTabParamList } from "./tabs/SettingsNavigator";

export type MainParamList = {
  NewsTab: NavigatorScreenParams<NewsTabParamList>;
  ActivitiesTab: NavigatorScreenParams<ActivitiesTabParamList>;
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  EventsTab: NavigatorScreenParams<EventsTabParamList>;
  SettingsTab: NavigatorScreenParams<SettingsTabParamList>;
};

const ioniconsTabIcon =
  (icon: keyof typeof Ionicons.glyphMap) =>
  ({ color }: { color: string }) =>
    <TabBarIcon name={icon} color={color} />;

const BottomTab = createBottomTabNavigator<MainParamList>();

const MainNavigator = () => {
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

export default MainNavigator;
