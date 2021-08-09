import React from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack from "../../components/Stack";

const QRCodeScreen = () => {
  return (
    <Stack spacing={4} style={tw`flex-1 justify-center p-6`}>
      <Text style={tw`text-3xl font-bold text-center`}>QR Code</Text>
    </Stack>
  );
};

export default QRCodeScreen;
