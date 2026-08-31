import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Modal, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";

import FilledButton from "../../components/FilledButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { encodeCode39, isEncodable } from "../../helpers/code39";

const ID_PREFIX = "student-id-";
const ID_NUMBER_FILE = "student-id-number.txt";
const MAX_WIDTH = 1600;
const BARCODE_HEIGHT = 140;

const listSavedPhotos = async () => {
  const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? "");
  return files.filter((name) => name.startsWith(ID_PREFIX));
};

const deleteSavedPhotos = async (names: string[]) => {
  await Promise.all(
    names.map((name) =>
      FileSystem.deleteAsync(FileSystem.documentDirectory + name, { idempotent: true })
    )
  );
};

const readIdNumber = async () => {
  try {
    const value = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + ID_NUMBER_FILE);
    return value.trim() || null;
  } catch {
    return null;
  }
};

const writeIdNumber = (value: string) =>
  FileSystem.writeAsStringAsync(FileSystem.documentDirectory + ID_NUMBER_FILE, value);

const deleteIdNumber = () =>
  FileSystem.deleteAsync(FileSystem.documentDirectory + ID_NUMBER_FILE, { idempotent: true });

type BarcodeProps = {
  value: string;
};

// Bars are laid out with flexGrow so the barcode fills whatever width it is
// given, keeping the 1:3 narrow-to-wide ratio scanners expect. The white
// padding around it is the quiet zone.
const Barcode = ({ value }: BarcodeProps) => {
  const bars = useMemo(() => encodeCode39(value), [value]);
  if (bars.length === 0) return null;

  return (
    <View style={tw`bg-white rounded px-6 py-5`}>
      <View style={[tw`flex-row w-full`, { height: BARCODE_HEIGHT }]}>
        {bars.map((bar, idx) => (
          <View
            key={idx}
            style={{
              flexGrow: bar.wide ? 3 : 1,
              backgroundColor: bar.bar ? "#000000" : "#ffffff",
            }}
          />
        ))}
      </View>
      <Text style={tw`text-center text-xl tracking-widest mt-3`}>{value}</Text>
    </View>
  );
};

type IdNumberModalProps = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

const IdNumberModal = ({ visible, initialValue, onClose, onSave }: IdNumberModalProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const trimmed = value.trim().toUpperCase();
  const valid = trimmed.length > 0 && isEncodable(trimmed);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView style={tw`flex-1 bg-gray-100`} contentContainerStyle={tw`p-4`}>
        <Stack spacing={4}>
          <Text style={tw`text-lg font-bold`}>Student ID Number</Text>
          <Text style={tw`text-sm text-gray-500`}>
            Enter the number printed on your student ID. The app turns it into a scannable barcode.
          </Text>

          <TextInput
            style={tw`bg-white rounded-md border border-gray-300 px-3 py-3 text-lg tracking-widest`}
            placeholder="5242013"
            value={value}
            onChangeText={setValue}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
          />

          {trimmed.length > 0 && !valid && (
            <Text style={tw`text-sm text-red-600`}>
              A barcode can only hold numbers, letters, and - . $ / + % characters.
            </Text>
          )}

          {valid && <Barcode value={trimmed} />}

          <FilledButton
            disabled={!valid}
            textStyle={tw`text-center`}
            onPress={() => onSave(trimmed)}
          >
            Save
          </FilledButton>
          <FilledButton color="gray" textStyle={tw`text-center`} onPress={onClose}>
            Cancel
          </FilledButton>
        </Stack>
      </ScrollView>
    </Modal>
  );
};

const IDScreen = () => {
  const [uri, setUri] = useState<string | null | undefined>(undefined);
  const [idNumber, setIdNumber] = useState<string | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await listSavedPhotos();
        setUri(saved.length > 0 ? FileSystem.documentDirectory + saved.sort().reverse()[0] : null);
      } catch {
        setUri(null);
      }
      setIdNumber(await readIdNumber());
    })();
  }, []);

  const savePhoto = async (picked: { uri: string; width: number }) => {
    setSaving(true);
    try {
      let source = picked.uri;
      if (picked.width > MAX_WIDTH) {
        try {
          const resized = await ImageManipulator.manipulateAsync(
            picked.uri,
            [{ resize: { width: MAX_WIDTH } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          source = resized.uri;
        } catch {
          // App builds older than 2.3.1 lack the expo-image-manipulator native
          // module (OTA updates can't add it), so save the original photo instead.
        }
      }

      const previous = await listSavedPhotos();
      const dest = `${FileSystem.documentDirectory}${ID_PREFIX}${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: source, to: dest });
      await deleteSavedPhotos(previous);
      // A photo and a barcode are two answers to the same question, so keeping
      // only the most recent one avoids showing a stale ID next to a current one.
      await deleteIdNumber();
      setIdNumber(null);
      setUri(dest);
    } catch (e) {
      Alert.alert("Something went wrong", "Could not save the photo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveIdNumber = async (value: string) => {
    setSaving(true);
    try {
      await writeIdNumber(value);
      await deleteSavedPhotos(await listSavedPhotos());
      setUri(null);
      setIdNumber(value);
      setEditing(false);
    } catch {
      Alert.alert("Something went wrong", "Could not save your ID number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const pick = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Needed",
        source === "camera"
          ? "Allow camera access in Settings to take a photo of your ID."
          : "Allow photo library access in Settings to upload a photo of your ID."
      );
      return;
    }

    const options = { mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (result.cancelled) return;
    await savePhoto(result);
  };

  const replace = () => {
    Alert.alert("Replace ID", "How do you want to show your ID?", [
      { text: "Enter ID Number", onPress: () => setEditing(true) },
      { text: "Take Photo", onPress: () => pick("camera") },
      { text: "Choose from Library", onPress: () => pick("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const remove = () => {
    Alert.alert("Remove ID", "Your saved ID will be deleted from this device.", [
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await deleteSavedPhotos(await listSavedPhotos());
          await deleteIdNumber();
          setUri(null);
          setIdNumber(null);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (uri === undefined || idNumber === undefined) return <Loading />;

  const modal = (
    <IdNumberModal
      visible={editing}
      initialValue={idNumber ?? ""}
      onClose={() => setEditing(false)}
      onSave={saveIdNumber}
    />
  );

  if (!uri && !idNumber) {
    return (
      <Stack style={tw`flex-1 justify-center p-8`} spacing={4} align="center">
        {modal}
        <Ionicons name="card-outline" size={64} color={tw.color("gray-400")} />
        <Text style={tw`text-base text-gray-500 text-center`}>
          Save your student ID for quick access when checking in at events. Enter your ID number for
          a scannable barcode, or save a photo of the card.
        </Text>
        <Stack spacing={2} style={tw`w-full`}>
          <FilledButton loading={saving} onPress={() => setEditing(true)}>
            Enter ID Number
          </FilledButton>
          <FilledButton loading={saving} onPress={() => pick("camera")}>
            Take Photo
          </FilledButton>
          <FilledButton loading={saving} onPress={() => pick("library")}>
            Upload Photo
          </FilledButton>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack style={tw`flex-1 p-4`} spacing={4}>
      {modal}
      {idNumber ? (
        <Stack style={tw`flex-1 justify-center`}>
          <Barcode value={idNumber} />
        </Stack>
      ) : (
        <Image source={{ uri: uri as string }} style={tw`flex-1 w-full`} resizeMode="contain" />
      )}
      <Stack direction="row" spacing={2}>
        <View style={tw`flex-1`}>
          <FilledButton loading={saving} onPress={replace}>
            Replace
          </FilledButton>
        </View>
        <View style={tw`flex-1`}>
          <FilledButton color="red" onPress={remove}>
            Remove
          </FilledButton>
        </View>
      </Stack>
    </Stack>
  );
};

export default IDScreen;
