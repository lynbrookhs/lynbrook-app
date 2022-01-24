import { Ionicons } from "@expo/vector-icons";
import { Poll as Poll_, PollSubmission, PollType, useRequest } from "lynbrook-app-api-hooks";
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { mutate } from "swr";
import tw from "tailwind-react-native-classnames";

import APIError from "./APIError";
import Card from "./Card";
import FilledButton from "./FilledButton";
import Stack from "./Stack";

type PollChoiceProps = {
  text: string;
  disabled: boolean;
  selected: boolean;
  onChange: (selected: boolean) => void;
};

const PollChoice = ({ text, disabled, selected, onChange }: PollChoiceProps) => {
  return (
    <Pressable onPress={() => onChange(!selected)} disabled={disabled}>
      {({ pressed }) => (
        <Stack
          style={[
            tw`px-3 py-2 border border-transparent rounded shadow-md`,
            selected ? tw`bg-indigo-600` : tw`bg-white`,
            pressed && (selected ? tw`bg-indigo-700` : tw`bg-gray-50`),
            disabled && tw`opacity-50`,
          ]}
          direction="row"
          align="center"
          spacing={2}
        >
          <Ionicons
            name={selected ? "checkmark-circle" : "radio-button-off"}
            color={selected ? "white" : "black"}
            style={tw`text-base`}
          />
          <Text style={[tw`text-base`, selected ? tw`text-white` : tw`text-black`]}>{text}</Text>
        </Stack>
      )}
    </Pressable>
  );
};

export type PollProps = {
  poll: Poll_;
  submission?: PollSubmission;
};

const Poll = ({ poll, submission }: PollProps) => {
  const [selected, setSelected] = useState<string[]>(submission?.responses ?? []);
  const { request, error } = useRequest();

  if (poll.type !== PollType.SELECT) {
    throw new Error("Only select polls are implemented.");
  }

  const handleSubmit = async () => {
    await request("POST", `/posts/${poll.post}/polls/${poll.id}/submissions/`, {
      poll: poll.id,
      responses: selected,
    });
    mutate(`/posts/${poll.post}/polls/`);
    mutate(`/posts/${poll.post}/polls/${poll.id}/`);
    mutate(`/posts/${poll.post}/polls/${poll.id}/submissions/`);
  };

  return (
    <Card header={<Text style={tw`text-lg font-bold`}>{poll.description}</Text>}>
      <Stack spacing={4}>
        {error && <APIError error={error} style={tw`m-0`} />}

        <Stack spacing={2}>
          {poll.choices.map((choice) => {
            return (
              <PollChoice
                key={choice}
                text={choice}
                disabled={
                  submission !== undefined ||
                  (selected.length >= poll.max_values && !selected.includes(choice))
                }
                selected={selected.includes(choice)}
                onChange={(state) => {
                  if (state) {
                    setSelected([...selected, choice]);
                  } else {
                    const newSelected = [...selected];
                    newSelected.splice(newSelected.indexOf(choice), 1);
                    setSelected(newSelected);
                  }
                }}
              />
            );
          })}
        </Stack>

        {submission === undefined && (
          <FilledButton
            textStyle={tw`text-center`}
            disabled={selected.length < poll.min_values || selected.length > poll.max_values}
            onPress={handleSubmit}
          >
            {selected.length >= poll.min_values
              ? "Submit"
              : `Select ${poll.min_values - selected.length} more`}
          </FilledButton>
        )}
      </Stack>
    </Card>
  );
};

export default Poll;
