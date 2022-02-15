import React, { cloneElement, ReactElement } from "react";
import { Button, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { RewardsClaimedModalProps } from "../../navigation/tabs/HomeNavigator";

type ContentProps = Pick<RewardsClaimedModalProps, "navigation"> & {
  icon: ReactElement;
  title: string;
  description: string;
};

const Content = ({ navigation, icon, title, description }: ContentProps) => (
  <Stack style={tw`flex-1 p-8 justify-center`} align="center" spacing={4}>
    {cloneElement(icon, { style: [icon.props.style, { fontSize: 64 }] })}
    <Text style={tw`text-xl font-bold text-center`}>{title}</Text>
    <Text style={tw`text-sm text-gray-500 text-center`}>{description}</Text>
    <Button title="Close" onPress={() => navigation.navigate("Rewards")} />
  </Stack>
);

const RewardsClaimedModal = ({ navigation, route }: RewardsClaimedModalProps) => {
  const prize = route.params.prize;

  if (!prize) return <Loading />;

  return (
    <Content
      navigation={navigation}
      icon={<Text>🎉</Text>}
      title={`Claiming ${prize.name}`}
      description={`Head over to the ASB Den to claim your prize with ${prize.points} ${prize.organization.name} points.`}
    />
  );
};

export default RewardsClaimedModal;
