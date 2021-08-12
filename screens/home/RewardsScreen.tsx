import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import ProgressCircle from "react-native-progress-circle";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import FilledButton from "../../components/FilledButton";
import { usePrizes, useUser } from "../../helpers/api";
import { OrganizationType } from "../../helpers/api/models";
import { RewardsScreenProps } from "../../navigation/tabs/HomeNavigator";

type RewardItemProps = {
  name: string;
  description: string;
  points: number;
  organization: string;
};

const RewardItem = ({ name, description, points, organization }: RewardItemProps) => (
  <Card key={name}>
    <Stack direction="row" style={tw`justify-between`} align="center">
      <Stack spacing={2}>
        <Stack>
          <Text style={tw`text-lg font-bold`}>{name}</Text>
          <Text style={tw`text-sm`}>{description}</Text>
        </Stack>
        <Stack direction="row" spacing={2} align="center">
          <Text style={tw`text-4xl font-bold`}>{points}</Text>
          <Text style={tw`text-2xl`}>{organization} Points</Text>
        </Stack>
      </Stack>
      <FilledButton>Claim</FilledButton>
    </Stack>
  </Card>
);

const RewardsScreen = ({ navigation }: RewardsScreenProps) => {
  const { data: user, error } = useUser();
  const { data: prizes, error: error2 } = usePrizes();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!prizes) return <ActivityIndicator style={tw`m-4`} />;

  //   const asb = user.memberships.find((x) => x.organization.id === 2);
  //   const cls = user.memberships.find((x) => x.organization.type === OrganizationType.CLASS);

  //   const nextAsbPrize = prizes.find(
  //     (x) => x.organization.id === asb?.organization.id && x.points > asb.points
  //   );
  //   const nextClsPrize = prizes.find(
  //     (x) => x.organization.id === cls?.organization.id && x.points > cls.points
  //   );

  return (
    <ScrollView style={tw`flex-1`}>
      <Stack spacing={4} style={tw`p-4`}>
        {prizes.map((item) => (
          <RewardItem
            name={item.name}
            description={item.description}
            points={item.points}
            organization={"ASB"}
          />
        ))}
      </Stack>
    </ScrollView>
  );
};

export default RewardsScreen;
