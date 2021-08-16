import React from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import Card from "../../components/Card";
import FilledButton from "../../components/FilledButton";
import Stack from "../../components/Stack";
import { usePrizes, useUser } from "../../helpers/api";
import { NestedMembership, Prize } from "../../helpers/api/models";
import { RewardsScreenProps } from "../../navigation/tabs/HomeNavigator";

type RewardItemProps = {
  prize: Prize;
  canClaim: boolean;
};

const RewardItem = ({ prize, canClaim }: RewardItemProps) => (
  <Card
    header={
      <Stack direction="row" align="center">
        <Stack style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold`}>{prize.name}</Text>
          <Text style={tw`text-sm`}>{prize.organization.name}</Text>
        </Stack>
        <Text style={tw`text-base`}>{prize.points} points</Text>
      </Stack>
    }
  >
    <Stack spacing={4}>
      <Text style={tw`text-sm`}>{prize.description}</Text>
      <FilledButton textStyle={tw`text-center`} disabled={!canClaim}>
        {canClaim ? "Claim" : "Not Enough Points"}
      </FilledButton>
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

  const membershipsByOrg = user.memberships.reduce<{ [key: number]: NestedMembership }>(
    (acc, val) => ({ ...acc, [val.organization.id]: val }),
    {}
  );

  return (
    <ScrollView style={tw`flex-1`}>
      <Stack spacing={4} style={tw`p-4`}>
        {prizes.map((item) => (
          <RewardItem
            key={item.id}
            prize={item}
            canClaim={membershipsByOrg[item.organization.id].points >= item.points}
          />
        ))}
      </Stack>
    </ScrollView>
  );
};

export default RewardsScreen;
