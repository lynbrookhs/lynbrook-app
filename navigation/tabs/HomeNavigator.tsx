import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../../screens/home/HomeScreen";
import RewardsScreen from "../../screens/home/RewardsScreen";
import SpecialEventsScreen from "../../screens/home/SpecialEventsScreen";
import { screenOptions } from "../config";

export type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeTabParamList, "Home">;
  route: RouteProp<HomeTabParamList, "Home">;
};

export type RewardsScreenProps = {
  navigation: NativeStackNavigationProp<HomeTabParamList, "Rewards">;
  route: RouteProp<HomeTabParamList, "Rewards">;
};

export type SpecialEventsScreenProps = {
  navigation: NativeStackNavigationProp<HomeTabParamList, "Special">;
  route: RouteProp<HomeTabParamList, "Special">;
};

export type HomeTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Special: { id: number };
};

const HomeStack = createNativeStackNavigator<HomeTabParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerTitle: "Home" }} />
      <HomeStack.Screen name="Rewards" component={RewardsScreen} options={{ headerTitle: "Rewards" }} />
      <HomeStack.Screen name="Special" component={SpecialEventsScreen} options={{ headerTitle: "" }} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
