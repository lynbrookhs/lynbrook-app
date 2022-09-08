import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
} from "react-native";
import tw from "twrnc";

import Stack from "./Stack";

export type FilledButtonProps = PressableProps & {
  color?: string;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
};

const FilledButton = ({
  color = "indigo",
  loading = false,
  disabled,
  textStyle,
  children,
  ...props
}: FilledButtonProps) => {
  return (
    <Pressable disabled={disabled} {...props}>
      {({ pressed }) => (
        <Stack
          style={[
            tw`justify-center bg-${color}-600 px-3 py-2 border border-transparent rounded shadow-md`,
            pressed && tw`bg-${color}-700`,
            disabled && tw`opacity-50`,
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={[tw`text-white text-base font-medium`, textStyle]}>{children}</Text>
          )}
        </Stack>
      )}
    </Pressable>
  );
};

export default FilledButton;
