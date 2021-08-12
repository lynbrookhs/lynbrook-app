import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "..";
import ClubDetailScreen from "../../screens/activities/ClubDetailScreen";
import ClubsScreen from "../../screens/activities/ClubsScreen";
import ScheduleScreen from "../../screens/activities/ScheduleScreen";
import { screenOptions } from "../config";
import { MainParamList } from "../MainNavigator";

type ActivitiesTabScreenProps<T extends keyof ActivitiesTabParamList> = {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<ActivitiesTabParamList, T>,
    CompositeNavigationProp<
      BottomTabNavigationProp<MainParamList>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >;
  route: RouteProp<ActivitiesTabParamList, T>;
};

export type ScheduleScreenProps = ActivitiesTabScreenProps<"Schedule">;
export type ClubsScreenProps = ActivitiesTabScreenProps<"Clubs">;
export type ClubDetailScreenProps = ActivitiesTabScreenProps<"ClubDetail">;

export type ActivitiesTabParamList = {
  Schedule: undefined;
  Clubs: undefined;
  ClubDetail: { id: number };
};

const ActivitiesStack = createNativeStackNavigator<ActivitiesTabParamList>();

const ActivitiesNavigator = () => {
  return (
    <ActivitiesStack.Navigator screenOptions={screenOptions}>
      <ActivitiesStack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ headerTitle: "Schedule" }}
      />
      <ActivitiesStack.Screen
        name="Clubs"
        component={ClubsScreen}
        options={{ headerTitle: "Clubs" }}
      />
      <ActivitiesStack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{ headerTitle: "" }}
      />
    </ActivitiesStack.Navigator>
  );
};

export default ActivitiesNavigator;
