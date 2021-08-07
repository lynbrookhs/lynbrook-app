import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack, { StackProps } from "./Stack";

const BORDER_STYLES = {
  top: tw`border-t`,
  bottom: tw`border-b`,
  both: tw`border-t border-b`,
};

export type ListItemProps = PropsWithChildren<StackProps> & {
  title?: string;
  description?: string;
  border?: "top" | "bottom" | "both";
};

const ListItem = ({
  title,
  description,
  style,
  children,
  border = "bottom",
  ...props
}: ListItemProps) => {
  return (
    <Stack style={[tw`p-3 bg-white border-gray-200`, BORDER_STYLES[border], style]} {...props}>
      {(title || description) && (
        <Stack style={tw`flex-1`}>
          {title && <Text style={tw`text-sm font-bold`}>{title}</Text>}
          {description && <Text style={tw`text-sm text-gray-500`}>{description}</Text>}
        </Stack>
      )}
      {children}
    </Stack>
  );
};

export default ListItem;
