import { Ionicons } from "@expo/vector-icons";
import { addDays, format, isSameDay, parseISO, setHours, setMinutes, startOfDay } from "date-fns";
import {
  CalendarEvent,
  useMemberships,
  useRequest,
  useUserCalendarEvents,
} from "lynbrook-app-api-hooks";
import ical from "node-ical";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Alert as RNAlert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda, AgendaEntry, DateData } from "react-native-calendars";
import useSWRNative from "swr-react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Card from "../../components/Card";
import FilledButton from "../../components/FilledButton";
import HeaderButton from "../../components/HeaderButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { CalendarScreenProps } from "../../navigation/tabs/EventsNavigator";

// Colors (full tailwind classes). ASB events use the school's light blue.
const ASB_COLOR = "sky-400";
const PERSONAL_COLOR = "indigo-500";
const CLUB_COLOR = "emerald-500";
const OTHER_FEED_COLORS = [
  "purple-500",
  "pink-500",
  "teal-500",
  "amber-500",
  "red-500",
  "gray-500",
];

type AgendaEvent = AgendaEntry & {
  id: string;
  allDay: boolean;
  start?: Date;
  end?: Date;
  timeText?: string;
  color: string;
  personalId?: number;
};

const agendaBase = { height: 0, day: "" };

type Items = { [key: string]: AgendaEvent[] };

const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

// A feed that fails to download or parse should never take down the calendar.
const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
};

const multiFetcher = (...urls: string[]) => Promise.all(urls.map((x) => fetcher(x)));

const summaryText = (s: any): string => {
  if (s === undefined || s === null) return "";
  if (typeof s === "object") return String(s.val ?? "");
  return String(s);
};

const isValidDate = (d: any): d is Date => d instanceof Date && !isNaN(d.getTime());

const toAgendaEvent = (key: string, e: any, color: string): AgendaEvent | undefined => {
  if (!e || e.type !== "VEVENT") return undefined;
  if (!isValidDate(e.start)) return undefined;

  const allDay = e.datetype === "date";
  let end = isValidDate(e.end) ? e.end : e.start;
  if (allDay) end = addDays(end, -1); // DTEND is exclusive for all-day events
  if (end < e.start) end = e.start;

  const name = summaryText(e.summary).trim();
  if (!name) return undefined;

  return { ...agendaBase, id: key, name, allDay, start: e.start, end, color };
};

const parseCalendar = (calendar: string, color: string): AgendaEvent[] => {
  try {
    const events = ical.sync.parseICS(calendar);
    return Object.entries(events)
      .map(([key, event]) => toAgendaEvent(key, event, color))
      .filter((x): x is AgendaEvent => x !== undefined);
  } catch {
    return [];
  }
};

const timeLabel = (event: AgendaEvent) => {
  if (event.timeText) return event.timeText;
  if (!event.start || !event.end) return "";
  if (event.allDay) {
    if (!isSameDay(event.start, event.end))
      return `${format(event.start, "MMM d")} – ${format(event.end, "MMM d")}`;
    return "All Day";
  }
  if (!isSameDay(event.start, event.end))
    return `${format(event.start, "MMM d, h:mm a")} – ${format(event.end, "MMM d, h:mm a")}`;
  return `${format(event.start, "h:mm a")} – ${format(event.end, "h:mm a")}`;
};

type CalendarItemProps = {
  event: AgendaEvent;
  first: boolean;
  onDelete?: () => void;
};

const CalendarItem = React.memo(({ event, first, onDelete }: CalendarItemProps) => (
  <Card style={[tw`mr-4 p-3 overflow-hidden`, first ? tw`mt-4` : tw`mt-2`]}>
    <Stack direction="row">
      <View style={tw`w-1 -m-3 mr-3 bg-${event.color}`} />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold`}>{event.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>{timeLabel(event)}</Text>
      </View>
      {event.personalId !== undefined && onDelete && (
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="trash-outline" style={tw`text-lg text-gray-400`} />
        </TouchableOpacity>
      )}
    </Stack>
  </Card>
));

// 30-minute time slots between 6:00 AM and 10:00 PM for the add-event picker.
const TIME_SLOTS = Array.from({ length: 33 }, (_, i) => 6 * 60 + i * 30);
const slotLabel = (mins: number) =>
  format(setMinutes(setHours(new Date(), Math.floor(mins / 60)), mins % 60), "h:mm a");

type TimeRowProps = {
  label: string;
  value: number;
  onChange: (mins: number) => void;
};

const TimeRow = ({ label, value, onChange }: TimeRowProps) => (
  <Stack spacing={1}>
    <Text style={tw`text-sm font-medium text-gray-500`}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Stack direction="row" spacing={2}>
        {TIME_SLOTS.map((mins) => (
          <TouchableOpacity key={mins} onPress={() => onChange(mins)}>
            <View
              style={[
                tw`px-3 py-2 rounded-full border`,
                mins === value ? tw`bg-indigo-600 border-indigo-600` : tw`bg-white border-gray-300`,
              ]}
            >
              <Text style={mins === value ? tw`text-white` : tw`text-gray-700`}>
                {slotLabel(mins)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Stack>
    </ScrollView>
  </Stack>
);

type AddEventModalProps = {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSaved: () => void;
};

const AddEventModal = ({ visible, initialDate, onClose, onSaved }: AddEventModalProps) => {
  const { request, error } = useRequest();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [allDay, setAllDay] = useState(false);
  const [startMins, setStartMins] = useState(15 * 60);
  const [endMins, setEndMins] = useState(16 * 60);
  const [saving, setSaving] = useState(false);

  // Reset the form each time the modal opens.
  useLayoutEffect(() => {
    if (visible) {
      setTitle("");
      setDate(initialDate);
      setAllDay(false);
      setStartMins(15 * 60);
      setEndMins(16 * 60);
      setSaving(false);
    }
  }, [visible, initialDate]);

  const handleStart = (mins: number) => {
    setStartMins(mins);
    if (endMins <= mins) setEndMins(Math.min(mins + 60, TIME_SLOTS[TIME_SLOTS.length - 1]));
  };

  const handleSave = async () => {
    setSaving(true);
    const at = (mins: number) =>
      setMinutes(setHours(startOfDay(date), Math.floor(mins / 60)), mins % 60);
    const start = allDay ? startOfDay(date) : at(startMins);
    const end = allDay
      ? setMinutes(setHours(startOfDay(date), 23), 59)
      : at(Math.max(endMins, startMins + 30));
    const res = await request("POST", "/users/me/calendar_events/", {
      title: title.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      all_day: allDay,
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
          <Text style={tw`flex-1 text-center text-base font-bold`}>New Event</Text>
          <View style={tw`w-14`} />
        </Stack>

        <ScrollView contentContainerStyle={tw`p-4`}>
          <Stack spacing={4}>
            <TextInput
              style={tw`bg-white rounded-md border border-gray-300 px-3 py-3 text-base`}
              placeholder="Event title"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <Stack
              direction="row"
              align="center"
              style={tw`bg-white rounded-md border border-gray-300 px-3 py-2`}
            >
              <TouchableOpacity
                onPress={() => setDate(addDays(date, -1))}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="chevron-back" style={tw`text-xl text-indigo-600`} />
              </TouchableOpacity>
              <Text style={tw`flex-1 text-center text-base`}>
                {format(date, "EEEE, MMMM d, yyyy")}
              </Text>
              <TouchableOpacity
                onPress={() => setDate(addDays(date, 1))}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="chevron-forward" style={tw`text-xl text-indigo-600`} />
              </TouchableOpacity>
            </Stack>

            <Stack
              direction="row"
              align="center"
              style={tw`bg-white rounded-md border border-gray-300 px-3 py-2`}
            >
              <Text style={tw`flex-1 text-base`}>All day</Text>
              <Switch value={allDay} onValueChange={setAllDay} />
            </Stack>

            {!allDay && (
              <>
                <TimeRow label="Starts" value={startMins} onChange={handleStart} />
                <TimeRow label="Ends" value={endMins} onChange={setEndMins} />
              </>
            )}

            {error && <APIError error={error} style={tw`m-0`} />}

            <FilledButton loading={saving} disabled={!title.trim() || saving} onPress={handleSave}>
              Add to Calendar
            </FilledButton>
          </Stack>
        </ScrollView>
      </Stack>
    </Modal>
  );
};

const CalendarScreen = ({ navigation }: CalendarScreenProps) => {
  const { data: memberships, error } = useMemberships();
  const { data: personal, mutate: mutatePersonal } = useUserCalendarEvents();
  const { request } = useRequest();

  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const selectedDate = useMemo(() => parseISO(selected), [selected]);
  const [adding, setAdding] = useState(false);
  const [range, setRange] = useState(() => ({
    min: startOfDay(addDays(new Date(), -45)),
    max: startOfDay(addDays(new Date(), 100)),
  }));

  const urls = useMemo(
    () => [...new Set((memberships ?? []).flatMap((x) => x.organization.ical_links))],
    [memberships]
  );

  const { data: cals } = useSWRNative<string[]>(urls.length > 0 ? urls : null, multiFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <HeaderButton side="right" icon="add" onPress={() => setAdding(true)} {...props} />
      ),
    });
  });

  const loadItemsForMonth = useCallback((month: DateData) => {
    const first = new Date(month.year, month.month - 1, 1);
    const last = new Date(month.year, month.month, 0);
    setRange((r) => {
      const min = addDays(first, -7) < r.min ? addDays(first, -7) : r.min;
      const max = addDays(last, 7) > r.max ? addDays(last, 7) : r.max;
      if (min.getTime() === r.min.getTime() && max.getTime() === r.max.getTime()) return r;
      return { min, max };
    });
  }, []);

  const items = useMemo(() => {
    const acc: Items = {};
    for (let d = range.min; d <= range.max; d = addDays(d, 1)) acc[dateKey(d)] = [];

    const pushSpan = (ev: AgendaEvent) => {
      if (!ev.start || !ev.end) return;
      let d = startOfDay(ev.start) < range.min ? range.min : startOfDay(ev.start);
      const stop = ev.end > range.max ? range.max : ev.end;
      for (; d <= stop; d = addDays(d, 1)) acc[dateKey(d)]?.push(ev);
    };

    // 1. Organization iCal feeds. The ASB feed is light blue; other feeds get their own colors.
    let feedIdx = 0;
    (cals ?? []).forEach((text, idx) => {
      const url = urls[idx] ?? "";
      const color = url.includes("lynbrookasb.org")
        ? ASB_COLOR
        : OTHER_FEED_COLORS[feedIdx++ % OTHER_FEED_COLORS.length];
      parseCalendar(text, color).forEach(pushSpan);
    });

    // 2. The student's own events.
    (personal ?? []).forEach((ev: CalendarEvent) => {
      const start = parseISO(ev.start);
      if (isNaN(start.getTime())) return;
      let end = parseISO(ev.end);
      if (isNaN(end.getTime()) || end < start) end = start;
      pushSpan({
        ...agendaBase,
        id: `mine-${ev.id}`,
        name: ev.title,
        allDay: ev.all_day,
        start,
        end,
        color: PERSONAL_COLOR,
        personalId: ev.id,
      });
    });

    // 3. Weekly club meetings (for clubs where the student left the calendar toggle on).
    (memberships ?? []).forEach((mem) => {
      const org = mem.organization;
      if (org.day === undefined || org.day === null) return;
      if (mem.calendar_events === false) return;
      const weekday = (org.day + 1) % 7; // API uses 0=Monday; JS Date uses 0=Sunday
      for (let d = range.min; d <= range.max; d = addDays(d, 1)) {
        if (d.getDay() !== weekday) continue;
        acc[dateKey(d)]?.push({
          ...agendaBase,
          id: `club-${org.id}-${dateKey(d)}`,
          name: org.name,
          allDay: false,
          timeText: org.time || "Meeting",
          color: CLUB_COLOR,
        });
      }
    });

    const sortKey = (e: AgendaEvent) => {
      if (e.allDay) return "0";
      if (e.timeText !== undefined) return "1" + e.name;
      return "2" + format(e.start!, "HH:mm") + e.name;
    };
    Object.values(acc).forEach((day) => day.sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1)));

    return acc;
  }, [cals, urls, personal, memberships, range]);

  const handleDelete = useCallback(
    (ev: AgendaEvent) => {
      RNAlert.alert("Delete event?", `Remove “${ev.name}” from your calendar?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await request("DELETE", `/users/me/calendar_events/${ev.personalId}/`);
            mutatePersonal();
          },
        },
      ]);
    },
    [request, mutatePersonal]
  );

  if (error) return <APIError error={error} />;
  if (!memberships) return <Loading />;
  if (urls.length > 0 && !cals) return <Loading />;

  return (
    <>
      <Agenda
        items={items}
        selected={selected}
        onDayPress={(d: DateData) => setSelected(d.dateString)}
        loadItemsForMonth={loadItemsForMonth}
        rowHasChanged={(a, b) =>
          (a as AgendaEvent).id !== (b as AgendaEvent).id || a.name !== b.name
        }
        renderItem={(reservation, first) => {
          const event = reservation as AgendaEvent;
          return (
            <CalendarItem
              event={event}
              first={first}
              onDelete={event.personalId !== undefined ? () => handleDelete(event) : undefined}
            />
          );
        }}
        renderEmptyDate={() => <View style={tw`mt-4`} />}
        theme={theme}
      />
      <AddEventModal
        visible={adding}
        initialDate={selectedDate}
        onClose={() => setAdding(false)}
        onSaved={() => mutatePersonal()}
      />
    </>
  );
};

export default CalendarScreen;

// Includes "stylesheet.*" override keys that the library supports but does not type.
const theme: any = {
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
