import { DefaultTheme, LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from ".";

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
  headerStyle: { backgroundColor: "#043265" },
  headerTintColor: "#FFFFFF",
};

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};
