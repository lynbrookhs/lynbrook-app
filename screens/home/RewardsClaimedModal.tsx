import { Ionicons } from "@expo/vector-icons";
import { useRequest } from "lynbrook-app-api-hooks";
import React from "react";
import { Button, Text } from "react-native";
import { mutate } from "swr";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { RewardsClaimedModalProps } from "../../navigation/tabs/HomeNavigator";

type ContentProps = Pick<RewardsClaimedModalProps, "navigation"> & {
  icon: React.ReactElement;
  title: string;
  description: string;
};

const Content = ({ navigation, icon, title, description }: ContentProps) => (
  <Stack style={tw`flex-1 p-8 justify-center`} align="center" spacing={4}>
    {React.cloneElement(icon, { style: [icon.props.style, { fontSize: 64 }] })}
    <Text style={tw`text-xl font-bold text-center`}>{title}</Text>
    <Text style={tw`text-sm text-gray-500 text-center`}>{description}</Text>
    <Button title="Close" onPress={() => navigation.navigate("Rewards")} />
  </Stack>
);

type RedeemResult = {
  prize: number;
  quantity: number;
  cost: number;
  points: number;
  points_spent: number;
};

const RewardsClaimedModal = ({ navigation, route }: RewardsClaimedModalProps) => {
  const prize = route.params.prize;
  const { request, error } = useRequest();
  const [result, setResult] = React.useState<RedeemResult | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!prize) return;

      const redeemResult = await request<RedeemResult>("POST", `/prizes/${prize.id}/redeem/`, {
        quantity: 1,
      });

      if (cancelled) return;

      setResult(redeemResult);
      await Promise.all([mutate("/users/me/"), mutate("/users/me/orgs/")]);
    })();

    return () => {
      cancelled = true;
    };
  }, [prize?.id, request]);

  if (!prize) return <Loading />;
  if (error?.status === 409) {
    return (
      <Content
        navigation={navigation}
        icon={<Ionicons name="close-circle" style={tw`text-red-500`} />}
        title="Not enough points"
        description={`You need ${prize.points} ${prize.organization.name} points to redeem ${prize.name}.`}
      />
    );
  }

  if (error) return <APIError error={error} />;
  if (!result) return <Loading />;

  return (
    <Content
      navigation={navigation}
      icon={<Text>🎉</Text>}
      title={`Redeemed ${prize.name}`}
      description={`We deducted ${result.cost} ${prize.organization.name} points. Pick up your prize from the ASB Den.`}
    />
  );
};

export default RewardsClaimedModal;
