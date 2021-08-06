import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import WelcomeScreen from "../screens/WelcomeScreen";

type AuthParamList = {
  WelcomeScreen: undefined;
};

const AuthStack = createStackNavigator<AuthParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" } }}>
      <AuthStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
