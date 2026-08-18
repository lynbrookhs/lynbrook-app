import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

import CalendarScreen from "../../screens/events/CalendarScreen";
import { screenOptions } from "../config";

export type EventsTabParamList = {
  Calendar: undefined;
};

export type CalendarScreenProps = NativeStackScreenProps<EventsTabParamList, "Calendar">;

const EventsStack = createNativeStackNavigator<EventsTabParamList>();

const EventsNavigator = () => {
  return (
    <EventsStack.Navigator screenOptions={screenOptions}>
      <EventsStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Calendar" }}
      />
    </EventsStack.Navigator>
  );
};

export default EventsNavigator;
