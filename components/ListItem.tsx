import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack, { StackProps } from "./Stack";

export type ListItemProps = PropsWithChildren<
  StackProps & {
    title?: string;
    description?: string;
  }
>;

const ListItem = ({ title, description, style, children, ...props }: ListItemProps) => {
  return (
    <Stack style={[tw`p-3 bg-white border-b border-gray-200`, style]} {...props}>
      <Stack style={tw`flex-1`}>
        {title && <Text style={tw`text-sm font-bold`}>{title}</Text>}
        {description && <Text style={tw`text-sm text-gray-500`}>{description}</Text>}
      </Stack>
      {children}
    </Stack>
  );
};

export default ListItem;
