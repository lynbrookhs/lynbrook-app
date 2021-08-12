import { NavigationContainer, NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import * as React from "react";
import { useAuth } from "../components/AuthProvider";
import { Event, EventSubmissionType } from "../helpers/api/models";
import QRCodeEntryModal from "../screens/home/QRCodeEntryModal";
import QRCodeModal from "../screens/home/QRCodeModal";
import QRCodeScannedModal from "../screens/home/QRCodeScannedModal";
import AuthNavigator, { AuthParamList } from "./AuthNavigator";
import { linking, Theme } from "./config";
import MainNavigator, { MainParamList } from "./MainNavigator";

export type QRCodeModalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "QRCode">;
  route: RouteProp<RootStackParamList, "QRCode">;
};

export type QRCodeEntryModalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "QRCodeEntry">;
  route: RouteProp<RootStackParamList, "QRCodeEntry">;
};

export type QRCodeScannedModalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "QRCodeScanned">;
  route: RouteProp<RootStackParamList, "QRCodeScanned">;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainParamList>;
  Auth: NavigatorScreenParams<AuthParamList>;
  QRCode: undefined;
  QRCodeEntry: undefined;
  QRCodeScanned:
    | { type: EventSubmissionType.CODE; code: number }
    | { type: EventSubmissionType.FILE; event: Event; fileUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { token } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="QRCode" component={QRCodeModal} />
            <Stack.Screen name="QRCodeEntry" component={QRCodeEntryModal} />
            <Stack.Screen name="QRCodeScanned" component={QRCodeScannedModal} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
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
