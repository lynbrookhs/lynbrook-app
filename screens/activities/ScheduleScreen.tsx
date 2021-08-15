import { Ionicons } from "@expo/vector-icons";
import { addDays, format, getDay, getMonth, getYear, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { useCurrentSchedule, useNextSchedule } from "../../helpers/api";
import { NestedSchedulePeriod, parseTime } from "../../helpers/api/models";
import { ScheduleScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

const WEEKDAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri"];

type ScheduleItemProps = {
  item: NestedSchedulePeriod;
  index: number;
};

const ScheduleItem = ({ item, index }: ScheduleItemProps) => (
  <ListItem
    primary={item.period.name}
    direction="row"
    align="center"
    border={index === 0 ? "both" : "bottom"}
  >
    <Text style={tw`text-gray-500`}>
      {format(parseTime(item.start), "h:mm a")} – {format(parseTime(item.end), "h:mm a")}
    </Text>
  </ListItem>
);

type ScheduleDayTabsProps = {
  selected: number;
  onSelect: (weekday: number) => void;
};

const ScheduleDayTabs = ({ selected, onSelect }: ScheduleDayTabsProps) => (
  <Stack direction="row" style={tw`z-10`}>
    {WEEKDAYS.map((x, idx) => (
      <View
        key={idx}
        style={[
          tw`flex-1 bg-white border-b border-gray-200`,
          selected === idx && tw`border-b-2 border-indigo-500`,
        ]}
      >
        <TouchableOpacity onPress={() => onSelect(idx)}>
          <View style={tw`py-3 items-center`}>
            <Text style={selected === idx ? tw`text-indigo-500 font-bold` : tw`text-gray-500`}>
              {x}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ))}
  </Stack>
);

const EmptyDay = () => (
  <ListItem align="center" style={tw`h-40`} border="both">
    <Text style={tw`text-lg text-gray-500`}>No School 😴</Text>
  </ListItem>
);

const ScheduleScreen = ({ navigation }: ScheduleScreenProps) => {
  const { data: current, error } = useCurrentSchedule();
  const { data: next, error: error2 } = useNextSchedule();
  const [preview, setPreview] = useState(false);
  const [day, setDay] = useState((getDay(new Date()) + 6) % 7); // 0 = Sunday here, 0 = Monday in API

  const schedule = preview ? next : current;

  useEffect(() => {
    if (schedule) {
      const start = parseISO(schedule.start);
      const end = addDays(parseISO(schedule.end), -2);

      const headerTitle =
        getMonth(start) === getMonth(end)
          ? `${format(start, "MMMM d")}–${format(end, "d, yyyy")}`
          : getYear(start) === getYear(end)
          ? `${format(start, "MMMM d")} – ${format(end, "MMMM d, yyyy")}`
          : `${format(start, "MMMM d, yyyy")} – ${format(end, "MMMM d, yyyy")}`;

      navigation.setOptions({
        headerTitle,
        headerRight: (props) =>
          !preview && (
            <HeaderButton
              side="right"
              icon="chevron-forward"
              onPress={() => setPreview(true)}
              {...props}
            />
          ),
        headerLeft: (props) =>
          preview && (
            <HeaderButton
              side="left"
              icon="chevron-back"
              onPress={() => setPreview(false)}
              {...props}
            />
          ),
      });
    }
  }, [schedule, preview]);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!schedule) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Stack style={tw`flex-1`}>
      <ScheduleDayTabs selected={day} onSelect={setDay} />

      <FlatList<NestedSchedulePeriod>
        style={tw`-mt-px`}
        data={schedule.weekdays[day].periods}
        renderItem={ScheduleItem}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={EmptyDay}
        ListFooterComponent={
          <ListItem style={tw`bg-transparent`} border="none">
            <Text style={tw`text-center text-gray-500`}>{schedule.weekdays[day].name}</Text>
          </ListItem>
        }
      />

      <TouchableHighlight onPress={() => navigation.navigate("Clubs")}>
        <ListItem text="Clubs" direction="row" align="center" border="top">
          <Ionicons name="chevron-forward" style={tw`text-lg text-gray-500`} />
        </ListItem>
      </TouchableHighlight>
    </Stack>
  );
};

export default ScheduleScreen;
