import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { EventSubmissionType } from "lynbrook-app-api-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { MIN_ZOOM } from "../../helpers/constants";
import { QRCodeModalProps } from "../../navigation";

const NoPermission = () => (
  <Stack style={tw`flex-1 p-6 justify-center`} align="center" spacing={4}>
    <Text style={tw`text-xl font-bold text-center`}>Scan QR Code</Text>
    <Text style={tw`text-gray-500 text-center`}>
      Enable access to receive points for events by scanning QR codes.
    </Text>
    <Button onPress={() => Linking.openURL("app-settings:")} title="Enable Camera Access" />
  </Stack>
);

const BorderOverlay = () => {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 1,
        shadowColor: "black",
        shadowRadius: 12,
        shadowOpacity: 0.6,
      }}
    >
      {[
        ["top", "left"],
        ["top", "right"],
        ["bottom", "left"],
        ["bottom", "right"],
      ].map(([a, b]) => (
        <View
          key={`${a}-${b}`}
          style={tw`border-${a[0]}-4 border-${b[0]}-4 rounded-${a[0]}${b[0]}-md border-white absolute ${a}-0 ${b}-0 w-1/5 h-1/5`}
        />
      ))}
    </View>
  );
};

const QRCodeModal = ({ navigation }: QRCodeModalProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>(undefined);
  const [scanned, setScanned] = useState(false);
  const [pinchStartZoom, setPinchStartZoom] = useState(MIN_ZOOM);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: BarCodeScanningResult) => {
      if (scanned) return;
      const code = Number(data.replace("lhs://", "")) || 0;
      navigation.replace("QRCodeScanned", { type: EventSubmissionType.CODE, code });
      setScanned(true);
    },
    [scanned]
  );

  const scaleZoom = useCallback(
    (scaleFactor: number, initialZoom: number) => {
      const newZoom = scaleFactor * Math.max(initialZoom, MIN_ZOOM);
      if (MIN_ZOOM <= newZoom && newZoom <= 1) {
        setZoom(newZoom);
      }
    },
    [zoom]
  );

  const handlePinch = useCallback(
    (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
      scaleZoom(event.nativeEvent.scale, pinchStartZoom);
    },
    [pinchStartZoom]
  );

  const handlePinchStart = useCallback(
    (event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
      // only execute on pinch start
      if (event.nativeEvent.oldState !== 2) return;
      setPinchStartZoom(zoom);
      scaleZoom(event.nativeEvent.scale, zoom);
    },
    [pinchStartZoom, zoom]
  );

  if (hasPermission === undefined) return <Loading />;
  if (!hasPermission) return <NoPermission />;

  const Wrapper = Platform.OS === "android" ? SafeAreaView : View;
  const Wrapper2 = Platform.OS === "android" ? View : SafeAreaView;

  return (
    <Camera
      zoom={zoom}
      style={tw`flex-1`}
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
    >
      <PinchGestureHandler onGestureEvent={handlePinch} onHandlerStateChange={handlePinchStart}>
        <Wrapper style={tw`flex-1 relative`}>
          <View style={tw`flex-1 justify-center items-center relative`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Main", { screen: "HomeTab", params: { screen: "Home" } })
              }
              style={tw`absolute top-0 left-0`}
            >
              <Ionicons name="close" style={tw`m-4 text-2xl text-white`} />
            </TouchableOpacity>
            <View style={tw`w-1/2`}>
              <BorderOverlay />
            </View>
          </View>
          <Wrapper2 style={tw`absolute bottom-0 left-0 right-0 items-center pb-4`}>
            <TouchableOpacity onPress={() => navigation.replace("QRCodeEntry")}>
              <View style={tw`bg-black bg-opacity-20 py-2 px-4 rounded-full`}>
                <Text style={tw`text-lg text-white`}>Enter Manually</Text>
              </View>
            </TouchableOpacity>
          </Wrapper2>
        </Wrapper>
      </PinchGestureHandler>
    </Camera>
  );
};

export default QRCodeModal;
