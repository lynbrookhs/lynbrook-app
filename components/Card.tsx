import React from "react";
import tw from "tailwind-react-native-classnames";
import Stack, { StackProps } from "./Stack";

export type CardProps = StackProps;

const Card = ({ style, ...props }: CardProps) => {
  return (
    <Stack
      style={[tw`rounded-md border border-gray-300 px-6 py-4 bg-white items-center`, style]}
      {...props}
    />
  );
};

export default Card;
