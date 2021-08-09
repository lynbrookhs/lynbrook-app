import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import ClubDetailScreen from "../../screens/activities/ClubDetailScreen";
import ClubsScreen from "../../screens/activities/ClubsScreen";
import ScheduleScreen from "../../screens/activities/ScheduleScreen";
import { screenOptions } from "../config";

export type ScheduleScreenProps = {
  navigation: NativeStackNavigationProp<ActivitiesTabParamList, "Schedule">;
  route: RouteProp<ActivitiesTabParamList, "Schedule">;
};

export type ClubsScreenProps = {
  navigation: NativeStackNavigationProp<ActivitiesTabParamList, "Clubs">;
  route: RouteProp<ActivitiesTabParamList, "Clubs">;
};

export type ClubDetailScreenProps = {
  navigation: NativeStackNavigationProp<ActivitiesTabParamList, "ClubDetail">;
  route: RouteProp<ActivitiesTabParamList, "ClubDetail">;
};

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
