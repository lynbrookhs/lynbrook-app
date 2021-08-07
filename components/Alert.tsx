import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, ViewProps } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack from "./Stack";

type Status = "success" | "info" | "warning" | "error";

const STATUSES: {
  [key in Status]: [string, keyof typeof Ionicons.glyphMap];
} = {
  success: ["green", "checkmark"],
  info: ["blue", "information-circle"],
  warning: ["yellow", "warning"],
  error: ["red", "warning"],
};

export type AlertProps = ViewProps & {
  title: string;
  description: string;
  status?: keyof typeof STATUSES;
};

const Alert = ({ title, description, status = "success", style, ...props }: AlertProps) => {
  const [color, icon] = STATUSES[status];
  return (
    <Stack
      direction="row"
      style={[tw`rounded-md bg-${color}-100 border border-${color}-500 p-4 items-center`, style]}
      {...props}
    >
      <Ionicons name={icon} style={tw`text-xl text-${color}-500 mr-3`} />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-medium text-${color}-800`}>{title}</Text>
        <Text style={tw`text-sm text-${color}-700`}>{description}</Text>
      </View>
    </Stack>
  );
};

export default Alert;
