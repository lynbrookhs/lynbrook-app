import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../../screens/home/HomeScreen";
import { screenOptions } from "../config";

export type HomeTabParamList = {
  Home: undefined;
};

const HomeStack = createNativeStackNavigator<HomeTabParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerTitle: "Home" }} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
