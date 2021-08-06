import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import WelcomeScreen from "../screens/WelcomeScreen";

type AuthParamList = {
  Welcome: undefined;
};

const AuthStack = createStackNavigator<AuthParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" } }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
