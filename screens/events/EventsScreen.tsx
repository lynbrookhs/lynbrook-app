import { addDays, format, parseISO } from "date-fns";
import ical from "node-ical";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Agenda, AgendaThemeStyle } from "react-native-calendars";
import useSWRNative from "swr-react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import { Error, useOrgs } from "../../helpers/api";
import { COLORS } from "../../helpers/utils";

type Event = {
  id: string;
  name: string;
  allDay: boolean;
  start: Date;
  end: Date;
  color: string;
};

type Items = {
  [key: string]: Event[];
};

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw {
      status: res.status,
      url: url,
      detail: await res.text(),
    };
  }

  return await res.text();
};

const multiFetcher = (...urls: string[]) => Promise.all(urls.map((x) => fetcher(x)));

const parseEvent = (
  key: string,
  event: ical.CalendarComponent,
  color: string
): Event | undefined => {
  // TODO: Recurring events. Check `event.rrule`.
  if (event.type === "VTIMEZONE") return;
  return {
    id: key,
    name: event.summary,
    allDay: event.datetype === "date",
    start: event.start,
    end: event.end,
    color,
  };
};

const parseCalendar = (calendar: string, color: string) => {
  const events = ical.sync.parseICS(calendar);
  return Object.entries(events).map(([key, event]) => parseEvent(key, event, color));
};

type CalendarItemProps = { event: Event; first: boolean };

const CalendarItem = ({ event, first }: CalendarItemProps) => (
  <Card style={[tw`mr-4 p-3 overflow-hidden`, first ? tw`mt-4` : tw`mt-2`]}>
    <Stack direction="row">
      <View style={tw`w-1 -m-3 mr-3 bg-${event.color}-500`} />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold`}>{event.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          {event.allDay
            ? "All Day"
            : `${format(event.start, "h:mm a")} – ${format(event.end, "h:mm a")}`}
        </Text>
      </View>
    </Stack>
  </Card>
);

const EventsScreen = () => {
  const { data: orgs, error } = useOrgs();
  const ical_links = orgs?.flatMap((x) => x.ical_links) ?? [];
  const { data: cals, error: error2 } = useSWRNative<string[], Error>(ical_links, multiFetcher);

  const [items, setItems] = useState<Items>({});

  useEffect(() => {
    if (cals) {
      const parsed = cals.flatMap((x, idx) => parseCalendar(x, COLORS[idx % COLORS.length]));
      const newItems = parsed.reduce<Items>((acc, val, idx) => {
        if (!val) return acc;
        const key = format(val.start, "yyyy-MM-dd");
        if (!acc.hasOwnProperty(key)) acc[key] = [];
        acc[key].push(val);
        return acc;
      }, {});
      setItems(newItems);
    }
  }, [cals]);

  const loadItemsForMonth = ({ dateString }: { dateString: string }) => {
    const date = parseISO(dateString);
    for (let i = 0; i < 30; i++) {
      const key = format(addDays(date, i), "yyyy-MM-dd");
      if (!items.hasOwnProperty(key)) items[key] = [];
    }
    setItems(items);
  };

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!orgs) return <ActivityIndicator style={tw`m-4`} />;
  if (!cals) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItemsForMonth}
      rowHasChanged={(a, b) => a.id !== b.id}
      renderItem={(event, first) => <CalendarItem event={event} first={first} />}
      renderEmptyDate={() => {
        return <View style={tw`mt-4`} />;
      }}
      theme={theme}
    />
  );
};

export default EventsScreen;

const theme: AgendaThemeStyle = {
  textDayFontFamily: "System",
  textMonthFontFamily: "System",
  textDayHeaderFontFamily: "System",
  textDayFontWeight: "400",
  textMonthFontWeight: "400",
  textDayHeaderFontWeight: "400",
  "stylesheet.agenda.list": {
    day: tw`w-16 items-center mt-4`,
  },
  "stylesheet.agenda.main": {
    knobContainer: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: "center",
      ...tw`bg-white border-b border-gray-200`,
    },
  },
};
