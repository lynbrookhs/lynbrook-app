import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import EventsScreen from "../../screens/events/EventsScreen";
import { screenOptions } from "../config";

export type EventsTabParamList = {
  Events: undefined;
};

const EventsStack = createNativeStackNavigator<EventsTabParamList>();

const EventsNavigator = () => {
  return (
    <EventsStack.Navigator screenOptions={screenOptions}>
      <EventsStack.Screen
        name="Events"
        component={EventsScreen}
        options={{ headerTitle: "Events" }}
      />
    </EventsStack.Navigator>
  );
};

export default EventsNavigator;
