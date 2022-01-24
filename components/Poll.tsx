import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";

import Card from "./Card";
import FilledButton from "./FilledButton";
import Stack from "./Stack";

export type PollProps = {
  name: string;
  description: string;
  choices: string[];
  min: number;
  max: number;
};

const SelectPoll = ({ name, description, choices, min, max }: PollProps) => {
  const [selected, setSelected] = useState(new Array(choices.length).fill(false));
  const [disabled, setDisabled] = useState(false);
  const [submit, setSubmit] = useState(false);
  return (
    <Card
      header={
        <Stack direction="row" align="center">
          <Stack style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold`}>{name}</Text>
            <Text style={tw`text-sm`}>{description}</Text>
          </Stack>
          <FilledButton style={tw`text-base`} disabled={!submit}>
            Submit
          </FilledButton>
        </Stack>
      }
    >
      <Stack direction="col" align="center" spacing={2}>
        {choices.map((c, i) => {
          return (
            <Pressable
              key={i}
              onPress={() => {
                selected[i] = !selected[i];
                setSelected(selected);
                if (selected.filter(Boolean).length >= max) {
                  setDisabled(true);
                } else {
                  setDisabled(false);
                }
                if (selected.filter(Boolean).length < min) {
                  setSubmit(false);
                } else {
                  setSubmit(true);
                }
              }}
              disabled={disabled && !selected[i]}
              style={tw`w-11/12`}
            >
              {({ pressed }) => (
                <Stack
                  style={[
                    tw`justify-center px-3 py-2 border border-transparent rounded shadow-md`,
                    selected[i] ? tw`bg-indigo-600` : tw`bg-white`,
                    pressed && (selected[i] ? tw`bg-indigo-700` : tw`bg-white`),
                    disabled && !selected[i] && tw`opacity-50`,
                  ]}
                >
                  <View style={tw`flex-row items-center justify-start`}>
                    <Ionicons
                      name={selected[i] ? "checkmark-circle" : "radio-button-off"}
                      color={selected[i] ? "white" : "black"}
                      style={tw`text-sm`}
                    />
                    <Text
                      style={[tw`text-base pl-2`, selected[i] ? tw`text-white` : tw`text-black`]}
                    >
                      {c}
                    </Text>
                  </View>
                </Stack>
              )}
            </Pressable>
          );
        })}
      </Stack>
    </Card>
  );
};

export default SelectPoll;
