import { NestedMembership, Prize, usePrizes, useUser } from "lynbrook-app-api-hooks";
import React from "react";
import { ScrollView, Text } from "react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Card from "../../components/Card";
import FilledButton from "../../components/FilledButton";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { RewardsScreenProps } from "../../navigation/tabs/HomeNavigator";

type RewardItemProps = {
  prize: Prize;
  canClaim: boolean;
  onPress: () => void;
};

const RewardItem = ({ prize, canClaim, onPress }: RewardItemProps) => (
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
      <FilledButton textStyle={tw`text-center`} disabled={!canClaim} onPress={onPress}>
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
  if (!user) return <Loading />;
  if (!prizes) return <Loading />;

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
            canClaim={
              membershipsByOrg[item.organization.id].points -
                membershipsByOrg[item.organization.id].points_spent >=
              item.points
            }
            onPress={() => navigation.navigate("RewardsClaimed", { prize: item })}
          />
        ))}
      </Stack>
    </ScrollView>
  );
};

export default RewardsScreen;
