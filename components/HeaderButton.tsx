import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

type HeaderButtonProps = {
  side: "left" | "right";
  tintColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const HeaderButton = ({ side, tintColor, icon, onPress }: HeaderButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={side === "left" ? tw`pr-5` : tw`pl-5`}
    hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
  >
    <Ionicons name={icon} color={tintColor} style={tw`text-xl`} />
  </TouchableOpacity>
);

export default HeaderButton;
