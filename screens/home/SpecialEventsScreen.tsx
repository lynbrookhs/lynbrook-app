import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { useEvent } from "lynbrook-app-api-hooks";
import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import markdownStyles from "../../helpers/markdownStyles";
import { SpecialEventsScreenProps } from "../../navigation/tabs/HomeNavigator";

const CLASSES = ["2025", "2026", "2027", "2028"];

const SpecialEventsScreen = ({ navigation, route }: SpecialEventsScreenProps) => {
  const { data: event, error } = useEvent(route.params.id);
  const { data: event2, error: error2 } = useEvent(10);
  const { data: event3, error: error3 } = useEvent(12);
  const { data: event4, error: error4 } = useEvent(13);
  const { data: event5, error: error5 } = useEvent(14);
  const { data: event6, error: error6 } = useEvent(15);

  useEffect(() => {
    if (event) {
      navigation.setOptions({ title: event.name });
    }
  }, [event]);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (error3) return <APIError error={error3} />;
  if (error4) return <APIError error={error4} />;
  if (error5) return <APIError error={error5} />;
  if (error6) return <APIError error={error6} />;
  if (!event) return <Loading />;
  if (!event2) return <Loading />;
  if (!event3) return <Loading />;
  if (!event4) return <Loading />;
  if (!event5) return <Loading />;
  if (!event6) return <Loading />;
  console.log(event.description);

  return (
    <Stack style={tw`flex-1`}>
      <Stack spacing={1} style={tw`bg-white border-b border-gray-200 p-4`}>
        <Text style={tw`text-2xl font-bold`}>{event.name}</Text>
        <Text style={tw`text-sm`}>
          {format(parseISO(event.start), "M/dd")} – {format(parseISO(event.end), "M/dd")}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white flex-1`}>
        <View style={tw`p-3`}>
          <Stack spacing={2}>
            {/* <Text style={tw`text-lg font-bold`}>Leaderboard</Text>
            {CLASSES.map((c, idx) => (
              <Text key={idx} style={tw`text-lg`}>
                {c}:{" "}
                {(event2.leaderboard[c] ? event2.leaderboard[c] * event2.points : 0) +
                  (event3.leaderboard[c] ? event3.leaderboard[c] * event3.points : 0) +
                  (event4.leaderboard[c] ? event4.leaderboard[c] * event4.points : 0) +
                  (event5.leaderboard[c] ? event5.leaderboard[c] * event5.points : 0) +
                  (event6.leaderboard[c] ? event6.leaderboard[c] * event6.points : 0)}
              </Text>
            ))} */}
            <Text style={tw`text-lg font-bold`}>Event Description</Text>
            <Markdown style={markdownStyles}>{event.description}</Markdown>
            {route.params.id === 278 && (
              <Pressable onPress={() => navigation.navigate("PostDetail", { id: 365 })}>
                {({ pressed }) => (
                  <Stack
                    style={[
                      tw`px-3 py-2 border border-transparent rounded shadow-md`,
                      pressed ? tw`bg-indigo-700` : tw`bg-indigo-600`,
                    ]}
                    direction="row"
                    align="center"
                    spacing={2}
                  >
                    <Text style={[tw`text-base text-white`]}>
                      Voting starts at the end of lunch!
                    </Text>
                    <Ionicons name="arrow-forward" color="white" style={tw`text-base`} />
                  </Stack>
                )}
              </Pressable>
            )}
          </Stack>
        </View>
      </ScrollView>
    </Stack>
  );
};

export default SpecialEventsScreen;
