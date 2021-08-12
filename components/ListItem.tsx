import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack, { StackProps } from "./Stack";

const BORDER_STYLES = {
  top: tw`border-t`,
  bottom: tw`border-b`,
  both: tw`border-t border-b`,
  none: tw``,
};

export type ListItemProps = PropsWithChildren<StackProps> & {
  primary?: string;
  secondary?: string;
  text?: string;
  border?: "top" | "bottom" | "both" | "none";
};

const ListItem = ({
  primary,
  secondary,
  text,
  style,
  children,
  border = "bottom",
  ...props
}: ListItemProps) => {
  return (
    <Stack
      style={[tw`py-3 px-4 bg-white border-gray-200 justify-center`, BORDER_STYLES[border], style]}
      {...props}
    >
      {(primary || secondary || text) && (
        <Stack style={tw`flex-1`}>
          {primary && <Text style={tw`text-sm font-bold`}>{primary}</Text>}
          {secondary && <Text style={tw`text-sm text-gray-500`}>{secondary}</Text>}
          {text && <Text style={tw`text-base`}>{text}</Text>}
        </Stack>
      )}
      {children}
    </Stack>
  );
};

export default ListItem;
