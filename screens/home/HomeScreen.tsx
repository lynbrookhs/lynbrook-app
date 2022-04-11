import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Event,
  EventSubmissionType,
  OrganizationType,
  useEvents,
  usePrizes,
  useRequest,
  UserType,
  useUser,
} from "lynbrook-app-api-hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import ProgressCircle from "react-native-progress-circle";
import { mutate } from "swr";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import FilledButton from "../../components/FilledButton";
import HeaderButton from "../../components/HeaderButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { HomeScreenProps } from "../../navigation/tabs/HomeNavigator";

const ClassSelect = () => {
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const { request } = useRequest();

  const handleSelectYear = async (year: number) => {
    if (selected !== undefined) return;
    setSelected(year);
    const res = await request("PUT", "/users/me/", { grad_year: year });
    console.log(res);
    mutate("/users/me/");
  };

  return (
    <Alert
      status="info"
      title="Missing Graduation Year"
      description="Please select your graduation year to gain access to all the features of this app."
    >
      <Stack direction="row" spacing={2}>
        {[2025, 2024, 2023, 2022].map((x) => (
          <FilledButton
            key={x}
            style={tw`flex-1`}
            textStyle={tw`text-center`}
            disabled={selected === x}
            loading={selected === x}
            onPress={() => handleSelectYear(x)}
          >
            {x}
          </FilledButton>
        ))}
      </Stack>
    </Alert>
  );
};

type ProfileProps = { name: string; email: string; uri: string };

const Profile = ({ name, email, uri }: ProfileProps) => (
  <Card>
    <Stack direction="row" spacing={4} align="center">
      <View style={tw`w-14 h-14 rounded-full overflow-hidden`}>
        <AutoHeightImage width={56} source={{ uri }} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold`}>{name}</Text>
        <Text style={tw`text-sm`}>{email}</Text>
      </View>
    </Stack>
  </Card>
);

type SpiritPointsProps = {
  navigation: HomeScreenProps["navigation"];
  points: number;
  checkpoint: number;
  checkpointPrize: string;
  headerText?: string;
};

const SpiritPoints = ({
  navigation,
  points,
  checkpoint,
  checkpointPrize,
  headerText,
}: SpiritPointsProps) => (
  <Card header={headerText && <Text style={tw`text-lg font-bold`}>{headerText}</Text>}>
    <Stack direction="row" spacing={6} align="center">
      <ProgressCircle
        percent={(points / checkpoint) * 100}
        radius={40}
        borderWidth={8}
        color="#3399FF"
        shadowColor="#DDDDDD"
        bgColor="#fff"
      />

      <Stack style={tw`flex-1`}>
        <Stack direction="row" spacing={2} align="center">
          <Text style={tw`text-4xl font-bold`}>{points}</Text>
          <Text style={tw`text-xl`}>/ {checkpoint}</Text>
        </Stack>

        <Stack spacing={2}>
          {checkpoint > points ? (
            <Text>
              {checkpoint - points} points to a{" "}
              <Text style={tw`text-blue-500`}>{checkpointPrize}</Text>
            </Text>
          ) : (
            <>
              <Text>
                You can claim a <Text style={tw`text-blue-500`}>{checkpointPrize}</Text>!
              </Text>
              <FilledButton onPress={() => navigation.navigate("Rewards")}>
                Claim Reward
              </FilledButton>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  </Card>
);

type SpecialEventItemProps = {
  event: Event;
  onPress: () => void;
};

const SpecialEventItem = ({ event, onPress }: SpecialEventItemProps) => (
  <Card>
    <Stack direction="row" style={tw`justify-between`} align="center">
      <Stack>
        <Text style={tw`text-lg font-bold`}>{event.name}</Text>
        <Text style={tw`text-sm`}>{event.organization.name}</Text>
      </Stack>
      <TouchableOpacity onPress={onPress} style={tw`pl-4 py-2`}>
        <Ionicons name="arrow-forward" style={tw`text-xl`} />
      </TouchableOpacity>
    </Stack>
  </Card>
);

type EventItemProps = {
  event: Event;
  buttonText: string;
  onPress: () => void;
};

const EventItem = ({ event, buttonText, onPress }: EventItemProps) => (
  <Card
    header={
      <Stack direction="row" align="center">
        <Stack style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold`}>{event.name}</Text>
          <Text style={tw`text-sm`}>{event.organization.name}</Text>
        </Stack>
        <Text style={tw`text-base`}>{event.points} points</Text>
      </Stack>
    }
  >
    <Stack spacing={4}>
      {event.description !== "" && <Text style={tw`text-sm`}>{event.description}</Text>}
      <FilledButton textStyle={tw`text-center`} onPress={onPress} disabled={event.claimed}>
        {buttonText}
      </FilledButton>
    </Stack>
  </Card>
);

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>(undefined);

  const { data: user, error } = useUser();
  const { data: prizes, error: error2 } = usePrizes();
  const { data: events, error: error3 } = useEvents();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderButton
          side="left"
          icon="gift"
          onPress={() => navigation.navigate("Rewards")}
          {...props}
        />
      ),
      headerRight: (props) => (
        <HeaderButton
          side="right"
          icon="scan"
          onPress={() => navigation.navigate("QRCode")}
          {...props}
        />
      ),
    });
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (e) {
        try {
          console.log("LHS ERROR", e);
          const { status } = await ImagePicker.getCameraPermissionsAsync();
          setHasPermission(status === "granted");
        } catch (e2) {
          console.log("LHS ERROR 2", e2);
          setHasPermission(false);
        }
      }
    })();
  }, []);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (error3) return <APIError error={error3} />;
  if (!user) return <Loading />;
  if (!prizes) return <Loading />;
  if (!events) return <Loading />;
  if (hasPermission === undefined) return <Loading />;

  // Points

  const asb = user.memberships.find((x) => x.organization.id === 2);
  const cls = user.memberships.find((x) => x.organization.type === OrganizationType.CLASS);

  const nextAsbPrize =
    prizes.find(
      (x) => x.organization.id === asb?.organization.id && x.points > asb.points - asb.points_spent
    ) ?? prizes.find((x) => x.organization.id === asb?.organization.id);

  const nextClsPrize =
    prizes.find(
      (x) => x.organization.id === cls?.organization.id && x.points > cls.points - cls.points_spent
    ) ?? prizes.find((x) => x.organization.id === cls?.organization.id);

  // Events

  const specialEvents = events.filter((e) => [260, 278, 389, 391].includes(e.id));
  const regularEvents = events.filter((e) => ![260, 278, 386, 389, 391].includes(e.id));

  const wordleEvents = events.filter((e) => e.id === 386);

  const getFile = async (event: Event) => {
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
    });

    if (result.cancelled) return;

    navigation.navigate("QRCodeScanned", {
      event,
      type: EventSubmissionType.FILE,
      file: result,
    });
  };

  return (
    <ScrollView>
      <Stack spacing={4} style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-center`}>Lynbrook High School</Text>

        <Profile
          name={user.first_name ? `${user.first_name} ${user.last_name}` : "Guest User"}
          email={user.email}
          uri={user.picture_url}
        />

        {user.type === UserType.STUDENT && !user.grad_year && <ClassSelect />}

        {asb && nextAsbPrize && (
          <SpiritPoints
            navigation={navigation}
            points={asb.points - asb.points_spent}
            checkpoint={nextAsbPrize.points}
            checkpointPrize={nextAsbPrize.name}
            headerText="ASB Spirit Points"
          />
        )}

        {cls && nextClsPrize && (
          <SpiritPoints
            points={cls.points - cls.points_spent}
            checkpoint={nextClsPrize.points}
            checkpointPrize={nextClsPrize.name}
            headerText={`${cls.organization.name} Spirit Points`}
          />
        )}

        <Text style={tw`text-xl font-bold text-center`}>Ongoing Events</Text>

        {specialEvents.map((x) => (
          <SpecialEventItem
            key={x.id}
            event={x}
            onPress={() => navigation.navigate("Special", { id: x.id })}
          />
        ))}

        {wordleEvents.map((x) => (
          <SpecialEventItem key={x.id} event={x} onPress={() => navigation.navigate("Wordle")} />
        ))}

        {regularEvents.map((x) => (
          <EventItem
            key={x.id}
            event={x}
            onPress={
              x.submission_type === EventSubmissionType.CODE
                ? () => navigation.navigate("QRCode")
                : hasPermission
                ? () => getFile(x)
                : () => Linking.openSettings()
            }
            buttonText={
              x.claimed
                ? "Already Signed In"
                : x.submission_type === EventSubmissionType.CODE
                ? "Scan for Points"
                : hasPermission
                ? "Upload Photo for Points"
                : "Enable Camera Access"
            }
          />
        ))}
      </Stack>
    </ScrollView>
  );
};

export default HomeScreen;
