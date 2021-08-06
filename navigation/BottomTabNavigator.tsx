import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import TabBarIcon from "./TabBarIcon";
import HomeNavigator from "./tabs/HomeNavigator";

type BottomTabParamList = {
  HomeTab: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator initialRouteName="HomeTab">
      <BottomTab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{ tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} /> }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
