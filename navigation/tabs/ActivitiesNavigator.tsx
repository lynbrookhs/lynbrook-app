import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import ClubDetailScreen from "../../screens/activities/ClubDetailScreen";
import ClubsScreen from "../../screens/activities/ClubsScreen";
import ScheduleScreen from "../../screens/activities/ScheduleScreen";
import { screenOptions } from "../config";

export type ScheduleScreenProps = {
  navigation: StackNavigationProp<ActivitiesParamList, "Schedule">;
  route: RouteProp<ActivitiesParamList, "Schedule">;
};

export type ClubsScreenProps = {
  navigation: StackNavigationProp<ActivitiesParamList, "Clubs">;
  route: RouteProp<ActivitiesParamList, "Clubs">;
};

export type ClubDetailScreenProps = {
  navigation: StackNavigationProp<ActivitiesParamList, "ClubDetail">;
  route: RouteProp<ActivitiesParamList, "ClubDetail">;
};

type ActivitiesParamList = {
  Schedule: undefined;
  Clubs: undefined;
  ClubDetail: { id: number };
};

const ActivitiesStack = createNativeStackNavigator<ActivitiesParamList>();

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
