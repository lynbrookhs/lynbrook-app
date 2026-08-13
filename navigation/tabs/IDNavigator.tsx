import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import IDScreen from "../../screens/id/IDScreen";
import { screenOptions } from "../config";

export type IDTabParamList = {
  ID: undefined;
};

const IDStack = createNativeStackNavigator<IDTabParamList>();

const IDNavigator = () => {
  return (
    <IDStack.Navigator screenOptions={screenOptions}>
      <IDStack.Screen name="ID" component={IDScreen} options={{ title: "Student ID" }} />
    </IDStack.Navigator>
  );
};

export default IDNavigator;
