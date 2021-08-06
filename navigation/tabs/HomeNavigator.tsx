import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../../screens/home/HomeScreen";
import { screenOptions } from "../config";

type HomeParamList = {
  HomeScreen: undefined;
};

const HomeStack = createStackNavigator<HomeParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: "Home" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
