import { Ionicons } from "@expo/vector-icons";
import * as React from "react";

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
};

const TabBarIcon = (props: TabBarIconProps) => (
  <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
);

export default TabBarIcon;
