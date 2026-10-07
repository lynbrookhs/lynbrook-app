import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import {
  apiFetcher,
  apiPath,
  Memory,
  MemoryRecipient,
  useAuth,
  useMyMemories,
  useReceivedMemories,
  useRequest,
  useUser,
} from "lynbrook-app-api-hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Card from "../../components/Card";
import FilledButton from "../../components/FilledButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { MemoriesScreenProps } from "../../navigation/tabs/HomeNavigator";

export const seniorYear = () => {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
};

const MAX_NOTE = 300;

type ComposerProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const Composer = ({ visible, onClose, onSaved }: ComposerProps) => {
  const { request, requestWithFunc, error } = useRequest();
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | undefined>();
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemoryRecipient[]>([]);
  const [tagged, setTagged] = useState<MemoryRecipient[]>([]);
  const [saving, setSaving] = useState(false);
  const searchSeq = useRef(0);

  useEffect(() => {
    if (visible) {
      setPhoto(undefined);
      setNote("");
      setQuery("");
      setResults([]);
      setTagged([]);
      setSaving(false);
    }
  }, [visible]);

  // Debounced people search.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const seq = ++searchSeq.current;
    const timer = setTimeout(async () => {
      const data = await request<MemoryRecipient[]>(
        "GET",
        `/memories/recipients/?q=${encodeURIComponent(q)}`
      );
      if (data && seq === searchSeq.current) setResults(data);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, request]);

  const pick = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Needed", "Allow photo access in Settings to add a photo.", [
        { text: "Not Now", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    const options = { mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const choosePhoto = () => {
    Alert.alert("Add Photo", "How do you want to add your photo?", [
      { text: "Take Photo", onPress: () => pick("camera") },
      { text: "Choose from Library", onPress: () => pick("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const toggleTag = (person: MemoryRecipient) => {
    setTagged((cur) =>
      cur.some((x) => x.id === person.id) ? cur.filter((x) => x.id !== person.id) : [...cur, person]
    );
  };

  const submit = async () => {
    if (!photo || tagged.length === 0) return;
    setSaving(true);
    const res = await requestWithFunc(async (token) => {
      const form = new FormData();
      form.append("photo", {
        uri: photo.uri,
        name: "memory.jpg",
        type: "image/jpeg",
      } as any);
      form.append("note", note.trim());
      form.append("recipients", JSON.stringify(tagged.map((x) => x.id)));
      return await apiFetcher(token)("/memories/", { method: "POST", body: form });
    });
    setSaving(false);
    if (res !== undefined) {
      onSaved();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Stack style={tw`flex-1 bg-gray-100`}>
        <Stack
          direction="row"
          align="center"
          style={tw`bg-white px-4 py-3 border-b border-gray-200`}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={tw`text-base text-indigo-600`}>Cancel</Text>
          </TouchableOpacity>
          <Text style={tw`flex-1 text-center text-base font-bold`}>New Memory</Text>
          <View style={tw`w-14`} />
        </Stack>

        <KeyboardAvoidingView
          style={tw`flex-1`}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={tw`p-4`}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Stack spacing={4}>
              <TouchableOpacity onPress={choosePhoto}>
                {photo ? (
                  <Image
                    source={{ uri: photo.uri }}
                    style={tw`w-full h-64 rounded-md`}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={tw`w-full h-40 rounded-md border-2 border-dashed border-gray-300 items-center justify-center bg-white`}
                  >
                    <Ionicons name="image-outline" style={tw`text-4xl text-gray-400`} />
                    <Text style={tw`text-gray-500 mt-1`}>Tap to add a photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Stack spacing={1}>
                <TextInput
                  style={tw`bg-white rounded-md border border-gray-300 px-3 py-3 text-base min-h-24`}
                  placeholder="Write a note to go with it…"
                  value={note}
                  onChangeText={(t) => t.length <= MAX_NOTE && setNote(t)}
                  multiline
                />
                <Text style={tw`text-xs text-gray-400 text-right`}>
                  {note.length}/{MAX_NOTE}
                </Text>
              </Stack>

              <Stack spacing={2}>
                <Text style={tw`text-sm font-medium text-gray-500`}>
                  Tag the seniors in it. They get the photo in June.
                </Text>
                {tagged.length > 0 && (
                  <Stack direction="row" style={tw`flex-wrap`}>
                    {tagged.map((p) => (
                      <TouchableOpacity key={p.id} onPress={() => toggleTag(p)}>
                        <View
                          style={tw`flex-row items-center bg-indigo-600 rounded-full px-3 py-1 mr-2 mb-2`}
                        >
                          <Text style={tw`text-white text-sm`}>
                            {p.first_name} {p.last_name}
                          </Text>
                          <Ionicons name="close" style={tw`text-white text-sm ml-1`} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </Stack>
                )}
                <TextInput
                  style={tw`bg-white rounded-md border border-gray-300 px-3 py-2 text-base`}
                  placeholder="Search seniors by name…"
                  value={query}
                  onChangeText={setQuery}
                  autoCapitalize="none"
                />
                {results
                  .filter((p) => !tagged.some((x) => x.id === p.id))
                  .map((p) => (
                    <TouchableOpacity key={p.id} onPress={() => toggleTag(p)}>
                      <View
                        style={tw`bg-white rounded-md border border-gray-200 px-3 py-2 flex-row items-center`}
                      >
                        <Ionicons
                          name="person-add-outline"
                          style={tw`text-base text-indigo-600 mr-2`}
                        />
                        <Text style={tw`text-base flex-1`}>
                          {p.first_name} {p.last_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </Stack>

              {error && <APIError error={error} style={tw`m-0`} />}

              <FilledButton
                loading={saving}
                disabled={!photo || tagged.length === 0 || saving}
                onPress={submit}
              >
                Seal it until June
              </FilledButton>
            </Stack>
          </ScrollView>
        </KeyboardAvoidingView>
      </Stack>
    </Modal>
  );
};

const MemoriesScreen = (_props: MemoriesScreenProps) => {
  const { data: user, error } = useUser();
  const { data: mine, mutate: mutateMine } = useMyMemories();
  const { data: received, error: error2 } = useReceivedMemories();
  const { request } = useRequest();
  const { token } = useAuth();
  const [composing, setComposing] = useState(false);
  const [savingId, setSavingId] = useState<number | undefined>();

  const isSenior = user?.grad_year === seniorYear();

  const deleteMemory = useCallback(
    (m: Memory) => {
      Alert.alert("Delete this memory?", "The tagged people will never receive it.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await request("DELETE", `/memories/${m.id}/`);
            mutateMine();
          },
        },
      ]);
    },
    [request, mutateMine]
  );

  // Downloads the rendered polaroid and opens the share sheet; on iOS that
  // includes "Save Image", which is how it lands in the photo library.
  const sharePolaroid = useCallback(
    async (id: number) => {
      setSavingId(id);
      try {
        const dest = `${FileSystem.cacheDirectory}memory-${id}.jpg`;
        const dl = await FileSystem.downloadAsync(
          apiPath(`/memories/${id}/polaroid/`).toString(),
          dest,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (dl.status !== 200) throw new Error(`download failed (${dl.status})`);
        await Share.share(Platform.OS === "ios" ? { url: dl.uri } : { message: dl.uri });
      } catch {
        Alert.alert("Couldn't share", "Something went wrong preparing the polaroid. Try again?");
      } finally {
        setSavingId(undefined);
      }
    },
    [token]
  );

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user || !received || (isSenior && !mine)) return <Loading />;

  return (
    <>
      <ScrollView>
        <Stack spacing={4} style={tw`p-4`}>
          {received.released && received.memories.length > 0 && (
            <Stack spacing={3}>
              <Text style={tw`text-lg font-bold`}>Your memories</Text>
              {received.memories.map((m) => (
                <Card key={m.id} style={tw`p-3`}>
                  <Stack spacing={3}>
                    <Image
                      source={{ uri: m.photo }}
                      style={tw`w-full h-72 rounded-md`}
                      resizeMode="cover"
                    />
                    {!!m.note && <Text style={tw`text-base`}>{m.note}</Text>}
                    <Text style={tw`text-sm text-gray-500`}>
                      From {m.sender.first_name} {m.sender.last_name} ·{" "}
                      {format(parseISO(m.created_at), "MMMM yyyy")}
                    </Text>
                    {Platform.OS === "ios" && (
                      <FilledButton loading={savingId === m.id} onPress={() => sharePolaroid(m.id)}>
                        Save polaroid
                      </FilledButton>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}

          {received.released && received.memories.length === 0 && !isSenior && (
            <Card>
              <Text style={tw`text-base text-gray-500 text-center`}>
                No memories were addressed to you this year.
              </Text>
            </Card>
          )}

          {isSenior && !received.released && (
            <Stack spacing={3}>
              <Card>
                <Stack spacing={2}>
                  <Text style={tw`text-lg font-bold`}>Senior Memories</Text>
                  <Text style={tw`text-base text-gray-600`}>
                    Upload photos with a note all year and tag the people in them. Everything stays
                    sealed until it's delivered to everyone at the end of the year.
                  </Text>
                  <FilledButton onPress={() => setComposing(true)}>Add a memory</FilledButton>
                </Stack>
              </Card>

              {(mine ?? []).length > 0 && (
                <Stack spacing={2}>
                  <Text style={tw`text-lg font-bold`}>Sealed so far ({mine!.length})</Text>
                  {mine!.map((m) => (
                    <Card key={m.id} style={tw`p-3`}>
                      <Stack direction="row" spacing={3} align="center">
                        <Image
                          source={{ uri: m.photo }}
                          style={tw`w-16 h-16 rounded-md`}
                          resizeMode="cover"
                        />
                        <Stack style={tw`flex-1`}>
                          <Text style={tw`text-sm`} numberOfLines={2}>
                            {m.note || "(no note)"}
                          </Text>
                          <Text style={tw`text-xs text-gray-500`}>
                            → {m.recipients.map((r) => r.first_name).join(", ")}
                          </Text>
                        </Stack>
                        <TouchableOpacity
                          onPress={() => deleteMemory(m)}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                          <Ionicons name="trash-outline" style={tw`text-lg text-gray-400`} />
                        </TouchableOpacity>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          {isSenior && received.released && (
            <Card>
              <Text style={tw`text-base text-gray-500 text-center`}>
                This year's memories have been delivered.
              </Text>
            </Card>
          )}
        </Stack>
      </ScrollView>
      <Composer
        visible={composing}
        onClose={() => setComposing(false)}
        onSaved={() => mutateMine()}
      />
    </>
  );
};

export default MemoriesScreen;
