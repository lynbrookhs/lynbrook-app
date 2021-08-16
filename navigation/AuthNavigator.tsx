import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";

import { RootStackParamList } from ".";
import GuestLoginModal from "../screens/welcome/GuestLoginModal";
import GuestRegisterModal from "../screens/welcome/GuestRegisterModal";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

type AuthScreenProps<T extends keyof AuthParamList> = {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AuthParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<AuthParamList, T>;
};

export type WelcomeScreenProps = AuthScreenProps<"Welcome">;
export type GuestLoginModalProps = AuthScreenProps<"GuestLogin">;
export type GuestRegisterModalProps = AuthScreenProps<"GuestRegister">;

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
