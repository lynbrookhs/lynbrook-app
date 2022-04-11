import { Ionicons } from "@expo/vector-icons";
import { useCurrentWordleEntry, useRequest } from "lynbrook-app-api-hooks";
import React, { PropsWithChildren, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { WordleScreenProps } from "../../navigation/tabs/HomeNavigator";

const YELLOW = "#c9b458";
const GREEN = "#6aaa64";

type GuessLetterProps = {
  state?: null | false | true;
  letter?: string;
};

const GuessLetter = ({ state, letter }: GuessLetterProps) => (
  <View
    style={[
      tw`flex-1 border border-2 justify-center items-center pt-1`,
      state === undefined && tw`bg-white border-gray-300`,
      state === null && tw`bg-gray-400 border-gray-400`,
      state === false && { backgroundColor: YELLOW, borderColor: YELLOW },
      state === true && { backgroundColor: GREEN, borderColor: GREEN },
      { aspectRatio: 1 },
    ]}
  >
    <Text style={[tw`text-4xl font-bold`, state === undefined ? tw`text-black` : tw`text-white`]}>
      {letter?.toUpperCase()}
    </Text>
  </View>
);

type GuessProps = {
  state?: (null | false | true)[];
  word?: string;
};

const Guess = ({ state, word }: GuessProps) => (
  <Stack direction="row" spacing={2}>
    {[...Array(5).keys()].map((x) => (
      <GuessLetter letter={word?.charAt(x)} state={state?.[x]} key={x} />
    ))}
  </Stack>
);

type KeyboardLetterProps = PropsWithChildren<{
  state?: null | false | true;
  width?: number;
  onPress: () => void;
}>;

const KeyboardLetter = ({ state, width = 2, children, onPress }: KeyboardLetterProps) => (
  <Pressable onPress={onPress} style={[tw`flex-1 h-16`, { flexGrow: width, padding: 2 }]}>
    <View
      style={[
        tw`flex-1 justify-center items-center rounded`,
        state === undefined && tw`bg-gray-200`,
        state === null && tw`bg-gray-400`,
        state === false && { backgroundColor: YELLOW },
        state === true && { backgroundColor: GREEN },
      ]}
    >
      <Text style={[tw`text-2xl font-bold`, state === undefined ? tw`text-black` : tw`text-white`]}>
        {children}
      </Text>
    </View>
  </Pressable>
);

type KeyboardSpacerProps = {
  width?: number;
};

const KeyboardSpacer = ({ width = 1 }: KeyboardSpacerProps) => (
  <View style={[tw`flex-1`, { flexGrow: width }]} />
);

type KeyboardProps = {
  state: { [key: string]: null | false | true };
  onPress: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
};

const Keyboard = ({ state, onPress, onEnter, onBackspace }: KeyboardProps) => {
  return (
    <Stack align="center">
      <Stack direction="row">
        {[..."qwertyuiop"].map((x) => (
          <KeyboardLetter key={x} onPress={() => onPress(x)} state={state[x]}>
            {x.toUpperCase()}
          </KeyboardLetter>
        ))}
      </Stack>

      <Stack direction="row">
        <KeyboardSpacer />

        {[..."asdfghjkl"].map((x) => (
          <KeyboardLetter key={x} onPress={() => onPress(x)} state={state[x]}>
            {x.toUpperCase()}
          </KeyboardLetter>
        ))}

        <KeyboardSpacer />
      </Stack>

      <Stack direction="row">
        <KeyboardLetter onPress={onEnter} width={3}>
          <Ionicons name="enter" style={tw`text-2xl`} />
        </KeyboardLetter>

        {[..."zxcvbnm"].map((x) => (
          <KeyboardLetter key={x} onPress={() => onPress(x)} state={state[x]}>
            {x.toUpperCase()}
          </KeyboardLetter>
        ))}

        <KeyboardLetter onPress={onBackspace} width={3}>
          <Ionicons name="backspace" style={tw`text-2xl`} />
        </KeyboardLetter>
      </Stack>
    </Stack>
  );
};

const WordleScreen = ({ navigation }: WordleScreenProps) => {
  const [guess, setGuess] = useState("");

  const { data: wordleEntry, error, mutate } = useCurrentWordleEntry();
  const { request, error: error2 } = useRequest();

  if (error) return <APIError error={error} />;
  if (!wordleEntry) return <Loading />;

  const handleEnter = async () => {
    await request("PUT", "/users/me/wordle_entries/today/", { guesses: [guess.toLowerCase()] });
    await mutate();
    setGuess("");
  };

  const handlePress = (letter: string) => setGuess(guess + letter);
  const handleBackspace = () => setGuess(guess.substring(0, Math.max(guess.length - 1, 0)));

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      <Stack style={tw`p-4`} align="center" spacing={6}>
        {error2 && <APIError error={error2} style={tw`m-0 self-stretch`} />}

        <Stack style={tw`max-w-xs mx-auto`} align="center" spacing={2}>
          {wordleEntry.guesses.map((x, idx) => (
            <Guess key={x} word={x} state={wordleEntry.results[idx]} />
          ))}
          {wordleEntry.guesses.length < 6 && <Guess word={guess} />}
          {wordleEntry.guesses.length <= 5 &&
            [...Array(5 - wordleEntry.guesses.length).keys()].map((x) => <Guess key={x} />)}
        </Stack>

        {wordleEntry.guesses.length < 6 ? (
          <Keyboard
            state={wordleEntry.state}
            onPress={handlePress}
            onEnter={handleEnter}
            onBackspace={handleBackspace}
          />
        ) : (
          <Stack align="center">
            <Text style={tw`text-lg text-gray-500`}>
              The word was <Text style={tw`font-bold`}>{wordleEntry.word.toUpperCase()}</Text>.
            </Text>
            <Text style={tw`text-lg text-gray-500`}>Better luck next time!</Text>
          </Stack>
        )}
      </Stack>
    </ScrollView>
  );
};

export default WordleScreen;
