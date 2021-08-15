import React from "react";
import { Pressable, PressableProps, StyleProp, Text, TextStyle, View } from "react-native";
import tw from "tailwind-react-native-classnames";

export type FilledButton = PressableProps & {
  color?: string;
  textStyle?: StyleProp<TextStyle>;
};

const FilledButton = ({
  color = "indigo",
  textStyle,
  disabled,
  children,
  ...props
}: FilledButton) => {
  return (
    <Pressable disabled={disabled} {...props}>
      {({ pressed }) => (
        <View
          style={[
            tw`bg-${color}-600 px-3 py-2 border border-transparent rounded shadow-md`,
            pressed && tw`bg-${color}-700`,
            disabled && tw`opacity-50`,
          ]}
        >
          <Text style={[tw`text-white text-base font-medium`, textStyle]}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default FilledButton;
