import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "..";
import HomeScreen from "../../screens/home/HomeScreen";
import RewardsScreen from "../../screens/home/RewardsScreen";
import SpecialEventsScreen from "../../screens/home/SpecialEventsScreen";
import { screenOptions } from "../config";
import { MainParamList } from "../MainNavigator";

type HomeTabScreenProps<T extends keyof HomeTabParamList> = {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<HomeTabParamList, T>,
    CompositeNavigationProp<
      BottomTabNavigationProp<MainParamList>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >;
  route: RouteProp<HomeTabParamList, T>;
};

export type HomeScreenProps = HomeTabScreenProps<"Home">;
export type RewardsScreenProps = HomeTabScreenProps<"Rewards">;
export type SpecialEventsScreenProps = HomeTabScreenProps<"Special">;

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
      <HomeStack.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{ headerTitle: "Rewards" }}
      />
      <HomeStack.Screen
        name="Special"
        component={SpecialEventsScreen}
        options={{ headerTitle: "" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
