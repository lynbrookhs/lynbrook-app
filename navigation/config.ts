import { DefaultTheme, LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from ".";
import { MONTAVISTA_PURPLE } from "../helpers/constants";

const prefix = Linking.createURL("/");

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix],
  config: {
    initialRouteName: "Main",
    screens: {
      QRCodeScanned: {
        path: ":code",
        parse: { code: (code) => Number(code.replace("mvhs://", "")) || 0 },
      },
    },
  },
};

export const screenOptions = {
  headerStyle: { backgroundColor: MONTAVISTA_PURPLE },
  headerTintColor: "#FFFFFF",
};

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};
