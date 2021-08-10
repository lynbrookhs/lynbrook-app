import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import ProgressCircle from "react-native-progress-circle";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import { usePrizes, useUser } from "../../helpers/api";
import { OrganizationType } from "../../helpers/api/models";
import { HomeScreenProps } from "../../navigation/tabs/HomeNavigator";

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

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data: user, error } = useUser();
  const { data: prizes, error: error2 } = usePrizes();

  useLayoutEffect(() => {
    navigation.setOptions({
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
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!prizes) return <ActivityIndicator style={tw`m-4`} />;

  const asb = user.memberships.find((x) => x.organization.id === 2);
  const cls = user.memberships.find((x) => x.organization.type === OrganizationType.CLASS);

  const nextAsbPrize = prizes.find(
    (x) => x.organization.id === asb?.organization.id && x.points > asb.points
  );
  const nextClsPrize = prizes.find(
    (x) => x.organization.id === cls?.organization.id && x.points > cls.points
  );

  return (
    <ScrollView style={tw`flex-1`}>
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
      </Stack>
    </ScrollView>
  );
};

export default HomeScreen;
