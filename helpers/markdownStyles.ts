import { StyleSheet } from "react-native";
import tw from "twrnc";

const markdownStyles = StyleSheet.create({
  heading1: tw`text-3xl font-bold mb-2`,
  heading2: tw`text-2xl font-bold mb-2`,
  heading3: tw`text-xl font-bold mb-2`,
  heading4: tw`text-lg font-bold mb-2`,
  heading5: tw`text-base font-bold mb-2`,
  heading6: tw`text-sm font-bold mb-2`,
  paragraph: tw`mt-0 mb-2`,
  hr: tw`h-0 border-t border-gray-200 my-2`,
});

export default markdownStyles;
