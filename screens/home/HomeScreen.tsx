import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import { useUser } from "../../helpers/api";

type ProfileProps = { name: string; email: string; uri: string };

const Profile = ({ name, email, uri }: ProfileProps) => (
  <Card direction="row">
    <View>
      {/* TODO: Image needs to be centered */}
      <Image style={tw`w-14 h-14 rounded-full mr-4`} source={{ uri }} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-base font-medium`}>{name}</Text>
      <Text style={tw`text-sm`}>{email}</Text>
    </View>
  </Card>
);

type SpiritPointsProps = { points: number; checkpoint: number };

const SpiritPoints = ({ points, checkpoint }: SpiritPointsProps) => (
  <Card direction="row">
    <View style={tw`mr-4`}>
      <ProgressCircle
        percent={(points / checkpoint) * 100}
        radius={40}
        borderWidth={8}
        color="#3399FF"
        shadowColor="#DDDDDD"
        bgColor="#fff"
      />
    </View>
    <View style={tw`flex-1`}>
      <Stack direction="row">
        <Text style={tw`text-4xl font-bold`}>{points}</Text>
        <Text style={tw`ml-2 text-2xl font-medium`}>/ {checkpoint}</Text>
      </Stack>
      <Text style={tw`font-medium`}>
        {checkpoint > points
          ? `${checkpoint - points} points to your next reward`
          : "A reward is ready to be redeemed."}
      </Text>
    </View>
  </Card>
);

const HomeScreen = () => {
  const { data: user, error } = useUser();

  if (error) return <APIError error={error} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;

  console.log(user);

  return (
    <Stack spacing={4} style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold text-center`}>Lynbrook High School</Text>
      <Profile
        name={`${user.first_name} ${user.last_name}`}
        email={user.email}
        uri={user.picture_url}
      />
      <SpiritPoints points={600} checkpoint={1000} />
    </Stack>
  );
};

export default HomeScreen;
