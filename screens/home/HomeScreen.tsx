import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";
import { parseISO } from "date-fns";
import { Alert, ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import ProgressCircle from "react-native-progress-circle";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import FilledButton from "../../components/FilledButton";
import { usePrizes, useUser, useEvents, useMemberships } from "../../helpers/api";
import { OrganizationType, EventSubmissionType } from "../../helpers/api/models";
import { HomeScreenProps } from "../../navigation/tabs/HomeNavigator";
import Navigation from "../../navigation";
import { useRequest } from "../../helpers/api";
import * as ImagePicker from "expo-image-picker";

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
  points: number;
  checkpoint: number;
  checkpointPrize: string;
  headerText?: string;
};

const SpiritPoints = ({ points, checkpoint, checkpointPrize, headerText }: SpiritPointsProps) => (
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
        <Text>
          {checkpoint - points} points to a <Text style={tw`text-blue-500`}>{checkpointPrize}</Text>
        </Text>
      </Stack>
    </Stack>
  </Card>
);

type EventItemProps = {
  name: string;
  description: string;
  organization: string;
  points: number;
  type?: EventSubmissionType;
  onPress: () => void;
};

const EventItem = ({ name, description, organization, points, type, onPress }: EventItemProps) => (
  <Card
    header={
      type && (
        <Stack direction="row" style={tw`justify-between`} align="center">
          <Stack>
            <Text style={tw`text-lg font-bold`}>{name}</Text>
            <Text style={tw`text-xs`}>{organization}</Text>
          </Stack>
          <Text style={tw`text-base`}>{points} points</Text>
        </Stack>
      )
    }
  >
    <Stack direction="row" spacing={4} align="center">
      <Stack style={tw`flex-1`}>
        {type ? (
          <Stack spacing={2}>
            <Text style={tw`text-xs`}>{description}</Text>
            <FilledButton textStyle={tw`text-center`} onPress={onPress}>
              {type === EventSubmissionType.CODE ? "Scan" : "Upload"} for Points
            </FilledButton>
          </Stack>
        ) : (
          <Stack direction="row" style={tw`justify-between`} align="center">
            <Stack>
              <Text style={tw`text-lg font-bold`}>{name}</Text>
              <Text style={tw`text-xs`}>{organization}</Text>
            </Stack>
            <TouchableOpacity onPress={onPress}>
              <Ionicons name="arrow-forward" style={tw`text-xl`} />
            </TouchableOpacity>
          </Stack>
        )}
      </Stack>
    </Stack>
  </Card>
);

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data: user, error } = useUser();
  const { data: prizes, error: error2 } = usePrizes();
  const { data: events, error: error3 } = useEvents();
  const { request, error: error4 } = useRequest();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.navigate("Rewards")}>
          <Ionicons name="gift" color={tintColor} style={tw`text-xl`} />
        </TouchableOpacity>
      ),
      headerRight: ({ tintColor }) => (
        // @ts-ignore TODO Fix typing for navigating to parent
        <TouchableOpacity onPress={() => navigation.navigate("QRCode")}>
          <Ionicons name="scan" color={tintColor} style={tw`text-xl`} />
        </TouchableOpacity>
      ),
    });
  });

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (error3) return <APIError error={error3} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!prizes) return <ActivityIndicator style={tw`m-4`} />;
  if (!events) return <ActivityIndicator style={tw`m-4`} />;

  // Points

  const asb = user.memberships.find((x) => x.organization.id === 2);
  const cls = user.memberships.find((x) => x.organization.type === OrganizationType.CLASS);

  const nextAsbPrize = prizes.find(
    (x) => x.organization.id === asb?.organization.id && x.points > asb.points
  );
  const nextClsPrize = prizes.find(
    (x) => x.organization.id === cls?.organization.id && x.points > cls.points
  );

  // Events

  console.log(events);
  const specialEvents = events.filter((e) => e.id === 6);
  const regularEvents = events.filter((e) => e.id !== 6);

  const getFile = async (event: any) => {
    const fileRequest = async (requestType: number) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0,
        mediaTypes:
          requestType == 0
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
      });

      if (result.cancelled) return; // User canceled

      const resp = await fetch(result.uri);
      const blob = await resp.blob();

      console.log(blob.type);
      try {
        await request<Event>("POST", "/users/me/events/", { id: event.id })
        Alert.alert(
          "File Uploaded",
          `You have successfully uploaded your file and received ${event.points} ASB spirit points and overall class points for the competition. (Check the Viking Games event page for current class standings). Your image will be reviewed by ASB to confirm that it follows submission guidelines. Thank you for participating!`,
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
        // Done!
      } catch (error) {
        // Error!
      }
    };
    await Alert.alert(
      "File Upload Selection",
      `Are you uploading an image or a video?`,
      [
        {
          text: "Image",
          onPress: () => {
            fileRequest(0);
          },
        },
        {
          text: "Video",
          onPress: () => {
            fileRequest(1);
          },
        },
      ],
      { cancelable: false }
    );
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
        {asb && nextAsbPrize && (
          <SpiritPoints
            points={asb.points}
            checkpoint={nextAsbPrize.points}
            checkpointPrize={nextAsbPrize.name}
            headerText="ASB Spirit Points"
          />
        )}
        {cls && nextClsPrize && (
          <SpiritPoints
            points={cls.points}
            checkpoint={nextClsPrize.points}
            checkpointPrize={nextClsPrize.name}
            headerText={`${cls.organization.name} Spirit Points`}
          />
        )}
        {specialEvents.map((x) => (
          <EventItem
            name={x.name}
            description={x.description}
            organization={x.organization.name}
            points={x.points}
            onPress={() => navigation.navigate("Special", { id: x.id })}
          />
        ))}
        {regularEvents.map((x) => (
          <EventItem
            name={x.name}
            description={x.description}
            organization={x.organization.name}
            points={x.points}
            type={x.submission_type}
            onPress={
              x.submission_type === EventSubmissionType.CODE
                ? // @ts-ignore TODO Fix typing for navigating to parent
                  () => navigation.navigate("QRCode")
                : () => getFile(x)
            }
          />
        ))}
      </Stack>
    </ScrollView>
  );
};

export default HomeScreen;
