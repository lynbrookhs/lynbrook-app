import { LinkingOptions } from "@react-navigation/native";

export const linking: LinkingOptions = {
  prefixes: ["lhs://"],
  config: {
    screens: {
      Root: {
        screens: {
          HomeTab: {
            screens: {
              HomeScreen: "home",
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
  cardStyle: { backgroundColor: "transparent" },
};
