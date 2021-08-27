import { DefaultTheme, LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from ".";
import { LYNBROOK_BLUE } from "../helpers/constants";

const prefix = Linking.createURL("/");

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix],
  config: {
    screens: {
      QRCodeScanned: {
        path: ":code",
        parse: { code: Number },
      },
    },
  },
};

export const screenOptions = {
  headerStyle: { backgroundColor: LYNBROOK_BLUE },
  headerTintColor: "#FFFFFF",
};

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};
