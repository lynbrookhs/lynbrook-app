import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useAuth } from "../components/AuthProvider";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import { linking } from "./config";

type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { state } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.token ? (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
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
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
