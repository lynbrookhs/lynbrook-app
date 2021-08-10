import { NavigationContainer, NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import * as React from "react";
import { useAuth } from "../components/AuthProvider";
import QRCodeModal from "../screens/home/QRCodeModal";
import QRCodeScannedModal from "../screens/home/QRCodeScannedModal";
import AuthNavigator, { AuthParamList } from "./AuthNavigator";
import { linking, Theme } from "./config";
import MainNavigator, { MainParamList } from "./MainNavigator";

export type QRCodeModalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "QRCode">;
  route: RouteProp<RootStackParamList, "QRCode">;
};

export type QRCodeScannedModalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "QRCodeScanned">;
  route: RouteProp<RootStackParamList, "QRCodeScanned">;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainParamList>;
  Auth: NavigatorScreenParams<AuthParamList>;
  QRCode: undefined;
  QRCodeScanned: { code: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { state } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.token ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="QRCode" component={QRCodeModal} />
            <Stack.Screen name="QRCodeScanned" component={QRCodeScannedModal} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationTypeForReplace: state.isSignout ? "pop" : "push",
          }}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer linking={linking} theme={Theme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
