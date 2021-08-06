import React, { Fragment, PropsWithChildren, ReactNode } from "react";
import { View, ViewProps } from "react-native";
import tw from "tailwind-react-native-classnames";
import { getValidChildren } from "../helpers/utils";

export type StackProps = PropsWithChildren<
  ViewProps & {
    direction?: string;
    spacing?: number;
    divider?: ReactNode;
  }
>;

const Stack = ({ direction = "col", spacing, divider, style, children, ...props }: StackProps) => {
  const validChildren = getValidChildren(children);

  return (
    <View style={[tw`flex flex-${direction} items-stretch`, style]} {...props}>
      {validChildren.map((elem, idx) => (
        <Fragment key={idx}>
          {idx > 0 && spacing && <View style={tw`h-${spacing}`}></View>}
          {idx > 0 && divider}
          {idx > 0 && divider && spacing && <View style={tw`h-${spacing}`}></View>}
          {elem}
        </Fragment>
      ))}
    </View>
  );
};

export default Stack;
