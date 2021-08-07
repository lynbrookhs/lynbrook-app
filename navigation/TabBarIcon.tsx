import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import tw from "tailwind-react-native-classnames";

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
};

const TabBarIcon = (props: TabBarIconProps) => <Ionicons style={tw`-mb-1 text-2xl`} {...props} />;

export default TabBarIcon;
