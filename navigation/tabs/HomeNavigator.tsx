import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Prize } from "lynbrook-app-api-hooks";
import React from "react";

import { RootStackParamList } from "..";
import HomeScreen from "../../screens/home/HomeScreen";
import RewardsClaimedModal from "../../screens/home/RewardsClaimedModal";
import RewardsScreen from "../../screens/home/RewardsScreen";
import SpecialEventsScreen from "../../screens/home/SpecialEventsScreen";
import WordleScreen from "../../screens/home/WordleScreen";
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
export type WordleScreenProps = HomeTabScreenProps<"Wordle">;
export type PostDetailScreenProps = HomeTabScreenProps<"PostDetail">;
export type RewardsClaimedModalProps = {
  navigation: NativeStackNavigationProp<HomeTabParamList, "RewardsClaimed">;
  route: RouteProp<HomeTabParamList, "RewardsClaimed">;
};

export type HomeTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Special: { id: number };
  Wordle: undefined;
  PostDetail: { id: number };
  RewardsClaimed: { prize: Prize };
};

const HomeStack = createNativeStackNavigator<HomeTabParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <HomeStack.Screen name="Rewards" component={RewardsScreen} options={{ title: "Rewards" }} />
      <HomeStack.Screen name="Special" component={SpecialEventsScreen} options={{ title: "" }} />
      <HomeStack.Screen name="Wordle" component={WordleScreen} options={{ title: "Wordle" }} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "" }} />

      <HomeStack.Group screenOptions={{ presentation: "modal", headerShown: false }}>
        <HomeStack.Screen name="RewardsClaimed" component={RewardsClaimedModal} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
