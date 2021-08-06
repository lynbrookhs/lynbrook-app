import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import tw from "tailwind-react-native-classnames";

type DividerProps = PropsWithChildren<ViewProps>;

const Divider = ({ style, ...props }: DividerProps) => (
  <View style={[tw`relative`, style]} {...props}>
    <View style={tw`absolute inset-0 flex items-center`}>
      <View style={tw`w-full border-t border-gray-200`}></View>
    </View>
  </View>
);

export default Divider;
