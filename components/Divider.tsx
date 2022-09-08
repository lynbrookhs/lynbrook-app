import React from "react";
import { View, ViewProps } from "react-native";
import tw from "twrnc";

export type DividerProps = ViewProps;

const Divider = ({ style, ...props }: DividerProps) => (
  <View style={[tw`relative`, style]} {...props}>
    <View style={tw`absolute inset-0 items-center`}>
      <View style={tw`w-full border-t border-gray-200`} />
    </View>
  </View>
);

export default Divider;
