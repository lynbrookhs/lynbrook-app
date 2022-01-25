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
import PostDetailScreen from "../../screens/news/PostDetailScreen";
import { MainParamList } from "../MainNavigator";
import { screenOptions } from "../config";

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
export type PostDetailScreenProps = HomeTabScreenProps<"PostDetail">;

export type HomeTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Special: { id: number };
  PostDetail: { id: number };
};

const HomeStack = createNativeStackNavigator<HomeTabParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <HomeStack.Screen name="Rewards" component={RewardsScreen} options={{ title: "Rewards" }} />
      <HomeStack.Screen name="Special" component={SpecialEventsScreen} options={{ title: "" }} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "" }} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
