import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Stack from "../../components/Stack";
import { QRCodeEntryModalProps } from "../../navigation";

type NumberButtonProps = {
  digit: number;
  onPress: (digit: number) => void;
  disabled: boolean;
};

const NumberButton = ({ digit, onPress, disabled }: NumberButtonProps) => (
  <TouchableOpacity style={tw`flex-1`} onPress={() => onPress(digit)}>
    <View style={[tw`bg-gray-200 items-center justify-center rounded-full`, { aspectRatio: 1 }]}>
      <Text style={[tw`text-3xl`, disabled && tw`opacity-30`]}>{digit}</Text>
    </View>
  </TouchableOpacity>
);

type NumberInputCharacterProps = {
  char: string;
  first: boolean;
  disabled: boolean;
};

const NumberInputCharacter = ({ char, first, disabled }: NumberInputCharacterProps) => (
  <View style={[!first && tw`border-l`, tw`flex-1 border-gray-300 py-3 items-center`]}>
    <Text style={[tw`text-3xl`, disabled && tw`opacity-30`]}>{char}</Text>
  </View>
);

type NumberInputProps = {
  code: string;
};

const NumberInput = ({ code }: NumberInputProps) => (
  <Stack direction="row" style={tw`border-gray-300 border rounded-xl`}>
    {code
      .padEnd(6, " ")
      .split("")
      .map((x, idx) => (
        <NumberInputCharacter key={idx} char={x} first={idx === 0} disabled={code.length === 6} />
      ))}
  </Stack>
);

const ButtonRow = ({ children }: PropsWithChildren<{}>) => (
  <Stack direction="row" spacing={4}>
    {children}
  </Stack>
);

type NumberInputButtonsProps = {
  code: string;
  setCode: (code: string) => void;
};

const NumberInputButtons = ({ code, setCode }: NumberInputButtonsProps) => {
  const handlePress = useCallback(
    (digit: number) => {
      if (code.length < 6) setCode(`${code}${digit}`);
    },
    [code]
  );

  const props = {
    onPress: handlePress,
    disabled: code.length === 6,
  };

  return (
    <Stack spacing={4} style={tw`flex-1`}>
      <ButtonRow>
        <NumberButton digit={1} {...props} />
        <NumberButton digit={2} {...props} />
        <NumberButton digit={3} {...props} />
      </ButtonRow>
      <ButtonRow>
        <NumberButton digit={4} {...props} />
        <NumberButton digit={5} {...props} />
        <NumberButton digit={6} {...props} />
      </ButtonRow>
      <ButtonRow>
        <NumberButton digit={7} {...props} />
        <NumberButton digit={8} {...props} />
        <NumberButton digit={9} {...props} />
      </ButtonRow>
      <ButtonRow>
        <View style={tw`flex-1`} />
        <NumberButton digit={0} {...props} />
        <View style={tw`flex-1`} />
      </ButtonRow>
    </Stack>
  );
};

const QRCodeEntryModal = ({ navigation }: QRCodeEntryModalProps) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === 6) {
      setTimeout(() => navigation.replace("QRCodeScanned", { code: Number(code) }), 500);
    }
  }, [code]);

  return (
    <Stack style={tw`flex-1 p-14 justify-center`} spacing={8}>
      <Text style={tw`text-2xl font-bold text-center`}>Enter Code</Text>
      <NumberInput code={code} />
      <NumberInputButtons code={code} setCode={setCode} />
    </Stack>
  );
};

export default QRCodeEntryModal;
