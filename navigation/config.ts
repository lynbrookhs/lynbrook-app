import { DefaultTheme, LinkingOptions } from "@react-navigation/native";

import { RootStackParamList } from ".";
import { LYNBROOK_BLUE } from "../helpers/constants";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["lhs://"],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: "home",
            },
          },
        },
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
