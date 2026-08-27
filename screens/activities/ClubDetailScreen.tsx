import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Prize, useMemberships, useOrg, usePrizes, useRequest } from "lynbrook-app-api-hooks";
import React, { useCallback, useEffect } from "react";
import { Alert, Linking, ScrollView, Switch, Text } from "react-native";
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

type PrizeRowProps = {
  prize: Prize;
  affordable: boolean;
};

const PrizeRow = ({ prize, affordable }: PrizeRowProps) => (
  <ListItem direction="row" align="center">
    <Stack style={tw`flex-1 mr-3`}>
      <Text style={tw`text-sm font-bold`}>{prize.name}</Text>
      {prize.description !== "" && (
        <Text style={tw`text-sm text-gray-500`}>{prize.description}</Text>
      )}
    </Stack>
    <Text style={[tw`text-sm`, affordable ? tw`text-green-600 font-bold` : tw`text-gray-400`]}>
      {prize.points} pts
    </Text>
  </ListItem>
);

const ClubDetailScreen = ({ navigation, route }: ClubDetailScreenProps) => {
  const { data: org, error } = useOrg(route.params.id);
  const { data: memberships, mutate } = useMemberships();
  const { data: prizes } = usePrizes();
  const { request, error: error2 } = useRequest();

  const membership = memberships?.find((x) => x.organization.id === route.params.id);

  // /prizes/ only returns prizes for orgs the student belongs to, so a non-member
  // sees an empty list here rather than prizes they cannot earn.
  const clubPrizes = (prizes ?? []).filter((x) => x.organization.id === route.params.id);
  const available = membership ? membership.points - membership.points_spent : 0;

  useEffect(() => {
    if (org) {
      navigation.setOptions({ title: org.name });
    }
  }, [org]);

  // Opting in to pings is only useful if the phone can actually show notifications:
  // ask for permission if we never have, re-register the push token, and point at
  // Settings if notifications were previously denied.
  const ensureNotificationsReady = useCallback(async () => {
    if (!Device.isDevice) return;

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      ({ status } = await Notifications.requestPermissionsAsync());
    }

    if (status !== "granted") {
      Alert.alert(
        "Notifications are off",
        "To get club pings, allow notifications for the Lynbrook app in your phone's Settings.",
        [
          { text: "Not Now", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    try {
      const { data } = await Notifications.getExpoPushTokenAsync({
        experienceId: "@lynbrookhs/lhs-app",
      });
      await request("POST", "/users/me/tokens/", { token: data });
    } catch {
      // Token registration also happens on every app launch; failing here is not fatal.
    }
  }, [request]);

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
      if (field === "receive_pings" && value) await ensureNotificationsReady();
    },
    [memberships, route.params.id, request, mutate, ensureNotificationsReady]
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
              value={membership.calendar_events ?? false}
              onChange={(v) => setFlag("calendar_events", v)}
            />
          )}
          <ToggleRow
            title="Club notifications"
            subtitle="Get pings from club officers, like meeting reminders."
            value={membership.receive_pings ?? false}
            onChange={(v) => setFlag("receive_pings", v)}
          />
          {error2 && <APIError error={error2} style={tw`m-3`} />}
        </Stack>
      )}

      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-3`}>
        <Stack spacing={4}>
          <Text>{org.description ?? "No description found."}</Text>

          {clubPrizes.length > 0 && (
            <Stack spacing={2}>
              <Stack direction="row" align="center">
                <Text style={tw`flex-1 text-base font-bold`}>Prizes</Text>
                {membership && <Text style={tw`text-sm text-gray-500`}>{available} points</Text>}
              </Stack>

              {clubPrizes.map((prize) => (
                <PrizeRow key={prize.id} prize={prize} affordable={available >= prize.points} />
              ))}

              <Text style={tw`text-sm text-gray-500`}>
                Claim these from Rewards on the Home tab.
              </Text>
            </Stack>
          )}
        </Stack>
      </ScrollView>
    </Stack>
  );
};

export default ClubDetailScreen;
