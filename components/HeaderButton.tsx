import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

type HeaderButtonProps = {
  tintColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const HeaderButton = ({ tintColor, icon, onPress }: HeaderButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons name={icon} color={tintColor} style={tw`text-xl`} />
  </TouchableOpacity>
);

export default HeaderButton;
