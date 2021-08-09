import React from "react";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack from "../../components/Stack";
import { QRCodeScannedModalProps } from "../../navigation";

const QRCodeScannedModal = ({ route }: QRCodeScannedModalProps) => {
  return (
    <Stack style={tw`flex-1 p-6 justify-center`} align="center" spacing={4}>
      <Text style={tw`text-xl font-bold text-center`}>Test</Text>
      <Text style={tw`text-gray-500 text-center`}>{route.params.code}</Text>
    </Stack>
  );
};

export default QRCodeScannedModal;
