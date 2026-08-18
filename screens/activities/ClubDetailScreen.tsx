import { useMemberships, useOrg, useRequest } from "lynbrook-app-api-hooks";
import React, { useCallback, useEffect } from "react";
import { ScrollView, Switch, Text } from "react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { ClubDetailScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ToggleRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const ToggleRow = ({ title, subtitle, value, onChange }: ToggleRowProps) => (
  <ListItem direction="row" align="center">
    <Stack style={tw`flex-1 mr-3`}>
      <Text style={tw`text-sm font-bold`}>{title}</Text>
      <Text style={tw`text-sm text-gray-500`}>{subtitle}</Text>
    </Stack>
    <Switch value={value} onValueChange={onChange} />
  </ListItem>
);

const ClubDetailScreen = ({ navigation, route }: ClubDetailScreenProps) => {
  const { data: org, error } = useOrg(route.params.id);
  const { data: memberships, mutate } = useMemberships();
  const { request, error: error2 } = useRequest();

  const membership = memberships?.find((x) => x.organization.id === route.params.id);

  useEffect(() => {
    if (org) {
      navigation.setOptions({ title: org.name });
    }
  }, [org]);

  const setFlag = useCallback(
    async (field: "calendar_events" | "receive_pings", value: boolean) => {
      if (!memberships) return;
      mutate(
        memberships.map((x) =>
          x.organization.id === route.params.id ? { ...x, [field]: value } : x
        ),
        false
      );
      await request("PATCH", `/users/me/orgs/${route.params.id}/`, { [field]: value });
      mutate();
    },
    [memberships, route.params.id, request, mutate]
  );

  if (error) return <APIError error={error} />;
  if (!org) return <Loading />;

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{org.name}</Text>
        {org.day !== undefined && org.day !== null && (
          <Text style={tw`text-sm text-gray-500`}>
            {WEEKDAYS[org.day]}
            {org.time && ` ${org.time}`}
            {org.location && ` @ ${org.location}`}
          </Text>
        )}
      </Stack>

      {membership && (
        <Stack style={tw`border-b border-gray-200`}>
          {org.day !== undefined && org.day !== null && (
            <ToggleRow
              title="Meetings in my calendar"
              subtitle="Show this club's meeting times in the Calendar tab."
              value={membership.calendar_events ?? true}
              onChange={(v) => setFlag("calendar_events", v)}
            />
          )}
          <ToggleRow
            title="Club notifications"
            subtitle="Get pings from club officers, like meeting reminders."
            value={membership.receive_pings ?? true}
            onChange={(v) => setFlag("receive_pings", v)}
          />
          {error2 && <APIError error={error2} style={tw`m-3`} />}
        </Stack>
      )}

      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-3`}>
        <Text>{org.description ?? "No description found."}</Text>
      </ScrollView>
    </Stack>
  );
};

export default ClubDetailScreen;
