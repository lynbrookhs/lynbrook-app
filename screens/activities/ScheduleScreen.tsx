import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { useCurrentSchedule } from "../../helpers/api";
import { NestedSchedulePeriod } from "../../helpers/api/models";

const WEEKDAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri"];

type ScheduleItemProps = {
  item: NestedSchedulePeriod;
  index: number;
};

const ScheduleItem = ({ item }: ScheduleItemProps) => (
  <ListItem title={item.period.name} direction="row" style={tw`items-center`}>
    <Text style={tw`text-gray-500`}>
      {item.start} – {item.end}
    </Text>
  </ListItem>
);

type ScheduleTabsProps = {
  selected: number;
  onSelect: (weekday: number) => void;
};

const ScheduleTabs = ({ selected, onSelect }: ScheduleTabsProps) => (
  <Stack direction="row">
    {WEEKDAYS.map((x, idx) => (
      <View
        key={idx}
        style={[
          tw`flex-1 bg-white border-b border-gray-200`,
          selected === idx && tw`border-b-2 border-indigo-500`,
        ]}
      >
        <TouchableOpacity onPress={() => onSelect(idx)}>
          <Text
            style={[
              tw`text-center text-gray-500 py-3`,
              selected === idx && tw`text-indigo-500 font-bold`,
            ]}
          >
            {x}
          </Text>
        </TouchableOpacity>
      </View>
    ))}
  </Stack>
);

const ScheduleScreen = () => {
  const { data: schedule, error } = useCurrentSchedule();
  const [selected, setSelected] = useState(0);

  if (error) return <APIError error={error} />;
  if (!schedule) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Stack style={tw`flex-1`}>
      <ScheduleTabs selected={selected} onSelect={setSelected} />
      <FlatList<NestedSchedulePeriod>
        data={schedule.weekdays[selected].periods}
        renderItem={ScheduleItem}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <ListItem style={tw`h-40 items-center justify-center`}>
            <Text style={tw`text-lg text-gray-500`}>No School 😴</Text>
          </ListItem>
        }
      />
    </Stack>
  );
};

export default ScheduleScreen;
