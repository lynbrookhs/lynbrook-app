import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WelcomeScreen from "../screens/WelcomeScreen";

export type AuthParamList = {
  Welcome: undefined;
};

const AuthStack = createNativeStackNavigator<AuthParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
