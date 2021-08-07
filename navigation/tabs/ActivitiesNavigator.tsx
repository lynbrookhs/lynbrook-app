import { RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import ClubsDetailScreen from "../../screens/activities/ClubsDetailScreen";
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

export type ClubsDetailScreenProps = {
  navigation: StackNavigationProp<ActivitiesParamList, "ClubsDetail">;
  route: RouteProp<ActivitiesParamList, "ClubsDetail">;
};

type ActivitiesParamList = {
  Schedule: undefined;
  Clubs: undefined;
  ClubsDetail: { id: number };
};

const ActivitiesStack = createStackNavigator<ActivitiesParamList>();

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
        name="ClubsDetail"
        component={ClubsDetailScreen}
        options={{ headerTitle: "" }}
      />
    </ActivitiesStack.Navigator>
  );
};

export default ActivitiesNavigator;
