import { RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import ScheduleScreen from "../../screens/activities/ScheduleScreen";
import { screenOptions } from "../config";

export type ScheduleScreenProps = {
  navigation: StackNavigationProp<ActivitiesParamList, "Schedule">;
  route: RouteProp<ActivitiesParamList, "Schedule">;
};

type ActivitiesParamList = {
  Schedule: undefined;
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
    </ActivitiesStack.Navigator>
  );
};

export default ActivitiesNavigator;
