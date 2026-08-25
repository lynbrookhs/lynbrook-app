import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import tw from "twrnc";

import FilledButton from "../../components/FilledButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";

const ID_PREFIX = "student-id-";
const MAX_WIDTH = 1600;

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

const IDScreen = () => {
  const [uri, setUri] = useState<string | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await listSavedPhotos();
        setUri(saved.length > 0 ? FileSystem.documentDirectory + saved.sort().reverse()[0] : null);
      } catch {
        setUri(null);
      }
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
      setUri(dest);
    } catch (e) {
      Alert.alert("Something went wrong", "Could not save the photo. Please try again.");
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
    if (result.canceled) return;
    await savePhoto(result.assets[0]);
  };

  const replace = () => {
    Alert.alert("Replace Photo", "How do you want to add your new ID photo?", [
      { text: "Take Photo", onPress: () => pick("camera") },
      { text: "Choose from Library", onPress: () => pick("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const remove = () => {
    Alert.alert("Remove Photo", "Your saved ID photo will be deleted from this device.", [
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await deleteSavedPhotos(await listSavedPhotos());
          setUri(null);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (uri === undefined) return <Loading />;

  if (!uri) {
    return (
      <Stack style={tw`flex-1 justify-center p-8`} spacing={4} align="center">
        <Ionicons name="card-outline" size={64} color={tw.color("gray-400")} />
        <Text style={tw`text-base text-gray-500 text-center`}>
          Save a photo of your student ID for quick access when checking in at events.
        </Text>
        <Stack spacing={2} style={tw`w-full`}>
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
      <Image source={{ uri }} style={tw`flex-1 w-full`} resizeMode="contain" />
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
