import React from "react";
import { ActivityIndicator, Button, Image, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import { useAuth } from "../../components/AuthProvider";
import Card from "../../components/Card";
import Stack from "../../components/Stack";
import { useUser } from "../../helpers/api";

type ProfileProps = { name: string; email: string; uri: string };

const Profile = ({ name, email, uri }: ProfileProps) => (
  <Card direction="row">
    <View>
      <Image style={tw`w-14 h-14 rounded-full mr-4`} source={{ uri }} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-base font-medium`}>{name}</Text>
      <Text style={tw`text-sm`}>{email}</Text>
    </View>
  </Card>
);

const HomeScreen = () => {
  const { data: user, error } = useUser();
  const { signOut } = useAuth();

  if (error) {
    return (
      <Alert
        style={tw`m-6`}
        status="error"
        title="Error"
        description="An unknown error has occurred. Please try again."
      />
    );
  }

  if (!user) {
    return <ActivityIndicator style={tw`m-4`} />;
  }

  return (
    <Stack spacing={4} style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold text-center`}>Lynbrook High School</Text>
      <Profile
        name={`${user.first_name} ${user.last_name}`}
        email={user.email}
        uri={user.picture_url}
      />
      <Button title="Sign Out" onPress={signOut} />
    </Stack>
  );
};

export default HomeScreen;
