import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import GuestLoginModal from "../screens/welcome/GuestLoginModal";
import GuestRegisterModal from "../screens/welcome/GuestRegisterModal";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

export type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthParamList, "Welcome">;
  route: RouteProp<AuthParamList, "Welcome">;
};

export type GuestLoginModalProps = {
  navigation: NativeStackNavigationProp<AuthParamList, "GuestLogin">;
  route: RouteProp<AuthParamList, "GuestLogin">;
};

export type GuestRegisterModalProps = {
  navigation: NativeStackNavigationProp<AuthParamList, "GuestRegister">;
  route: RouteProp<AuthParamList, "GuestRegister">;
};

export type AuthParamList = {
  Welcome: undefined;
  GuestLogin: undefined;
  GuestRegister: undefined;
};

const AuthStack = createNativeStackNavigator<AuthParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Group screenOptions={{ presentation: "modal" }}>
        <AuthStack.Screen
          name="GuestLogin"
          component={GuestLoginModal}
          options={{ headerTitle: "Guest Login" }}
        />
        <AuthStack.Screen
          name="GuestRegister"
          component={GuestRegisterModal}
          options={{ headerTitle: "Guest Registration" }}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
