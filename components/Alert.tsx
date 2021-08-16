import { Ionicons } from "@expo/vector-icons";
import React, { PropsWithChildren } from "react";
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

export type AlertProps = PropsWithChildren<ViewProps> & {
  title: string;
  description: string;
  status?: keyof typeof STATUSES;
};

const Alert = ({
  title,
  description,
  status = "success",
  style,
  children,
  ...props
}: AlertProps) => {
  const [color, icon] = STATUSES[status];
  return (
    <Stack
      style={[tw`rounded-md bg-${color}-100 border border-${color}-500 p-4`, style]}
      spacing={4}
      {...props}
    >
      <View>
        <Stack direction="row" align="center">
          <Ionicons name={icon} style={tw`text-xl text-${color}-500 mr-3`} />
          <Text style={tw`text-base font-medium text-${color}-800`}>{title}</Text>
        </Stack>
        <Text style={tw`text-sm text-${color}-700 ml-8`}>{description}</Text>
      </View>
      <View>{children}</View>
    </Stack>
  );
};

export default Alert;
