import React, { PropsWithChildren, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import tw from "tailwind-react-native-classnames";

import Divider from "./Divider";
import Stack from "./Stack";

export type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  header?: ReactNode;
}>;

const Card = ({ style, header, children }: CardProps) => {
  return (
    <Stack style={[tw`rounded-md border border-gray-200 p-4 bg-white`, style]}>
      {header && <View style={tw`-mt-2`}>{header}</View>}
      {header && <Divider style={tw`-mx-4 mt-2 mb-4`} />}
      {children}
    </Stack>
  );
};

export default Card;
