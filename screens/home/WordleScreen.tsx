import { Ionicons } from "@expo/vector-icons";
import { useCurrentWordleEntry, useRequest, useUser, WordleEntry } from "lynbrook-app-api-hooks";
import React, { PropsWithChildren, useState } from "react";
import { Pressable, Text, View } from "react-native";
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

const GuessLetter = ({ state, letter }: GuessLetterProps) => {
  const [size, setSize] = useState(0);

  return (
    <Stack
      onLayout={({ nativeEvent }) => setSize(nativeEvent.layout.height)}
      direction="row"
      align="center"
      style={[
        tw`border border-2`,
        state === undefined && tw`bg-white border-gray-300`,
        state === null && tw`bg-gray-400 border-gray-400`,
        state === false && { backgroundColor: YELLOW, borderColor: YELLOW },
        state === true && { backgroundColor: GREEN, borderColor: GREEN },
        { aspectRatio: 1 },
      ]}
    >
      <Text
        style={[
          tw`w-full font-bold text-center`,
          state === undefined ? tw`text-black` : tw`text-white`,
          { fontSize: size / 2 },
        ]}
      >
        {letter?.toUpperCase()}
      </Text>
    </Stack>
  );
};

type GuessProps = {
  state?: (null | false | true)[];
  word?: string;
};

const Guess = ({ state, word }: GuessProps) => (
  <Stack direction="row" style={tw`flex-1 justify-center`} spacing={2}>
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
          <Ionicons name="return-down-back-sharp" style={tw`text-2xl`} />
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

type WordleBoardProps = {
  entry: WordleEntry;
  guess: string;
};

const WordleBoard = ({ entry, guess }: WordleBoardProps) => (
  <Stack style={{ flexBasis: 380, flexShrink: 1 }} spacing={2}>
    {entry.guesses.map((x, idx) => (
      <Guess key={x} word={x} state={entry.results[idx]} />
    ))}
    {entry.guesses.length < 6 && <Guess word={guess} />}
    {entry.guesses.length <= 5 &&
      [...Array(5 - entry.guesses.length).keys()].map((x) => <Guess key={x} />)}
  </Stack>
);

const WordleScreen = ({ navigation }: WordleScreenProps) => {
  const [guess, setGuess] = useState("");

  const { data: user, error, mutate } = useUser();
  const { data: wordleEntry, error: error2, mutate: mutate2 } = useCurrentWordleEntry();
  const { request } = useRequest();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user) return <Loading />;
  if (!wordleEntry) return <Loading />;

  const handleEnter = async () => {
    if (wordleEntry.solved) return;
    const result = await request("PUT", "/users/me/wordle_entries/today/", {
      guesses: [guess.toLowerCase()],
    });
    mutate();
    mutate2(result);
    setGuess("");
  };

  const handlePress = (letter: string) => setGuess(guess + letter);
  const handleBackspace = () => setGuess(guess.substring(0, Math.max(guess.length - 1, 0)));

  return (
    <Stack style={tw`bg-white flex-1 p-4 justify-between`} spacing={4}>
      <WordleBoard entry={wordleEntry} guess={wordleEntry.solved ? "" : guess} />

      {wordleEntry.solved ? (
        <Stack align="center" style={tw`justify-center h-24`}>
          <Text style={tw`text-lg text-gray-500`}>Congratulations!</Text>
          <Text style={tw`text-lg text-gray-500`}>
            Your streak: <Text style={tw`font-bold`}>{user.wordle_streak}</Text>
          </Text>
        </Stack>
      ) : wordleEntry.guesses.length < 6 ? (
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
  );
};

export default WordleScreen;
