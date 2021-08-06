import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import { ActivityIndicator, Button, Image, Text, TouchableHighlight, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import { useAuth } from "../../components/AuthProvider";
import Card from "../../components/Card";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { useUser } from "../../helpers/api";

// TODO: Fix page

const schoolLinks = [
  {
    title: "Lynbrook High School Website",
    link: "https://www.lhs.fuhsd.org/",
  },
  {
    title: "Schoology",
    link: "https://www.fuhsd.schoology.org/",
  },
  {
    title: "Infinite Campus",
    link: "https://campus.fuhsd.org/campus/portal/fremont.jsp",
  },
  {
    title: "Naviance",
    link: "https://student.naviance.com/lynbrookhs",
  },
];

const studentLinks = [
  {
    title: "Lynbrook ASB Website",
    link: "https://www.lynbrookasb.com/",
  },
  {
    title: "The Epic",
    link: "https://lhsepic.com",
  },
  {
    title: "Lynbrook Facebook Group",
    link: "https://www.facebook.com/groups/lynbrookhighschool/",
  },
  {
    title: "Lynbrook ASB Instagram",
    link: "https://www.instagram.com/lynbrookasb/",
  },
];

const classInstagrams = ["lynbrook2022", "lynbrook2023", "lynbrookclassof2024", ""];

const classFacebooks = ["395859940822522", "lynbrookclassof2023", "1603301959845362", ""];

type ProfileProps = {
  name: string;
  email: string;
  uri: string;
};

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

type ResourceLinkProps = {
  title: string;
  onPress: () => void;
};

const ResourceLink = ({ title, onPress }: ResourceLinkProps) => (
  <TouchableHighlight onPress={onPress}>
    <ListItem direction="row" style={tw`items-center`}>
      <Text style={tw`flex-1`}>{title}</Text>
      <Ionicons name="link" style={tw`text-gray-500`} />
    </ListItem>
  </TouchableHighlight>
);

const SettingsScreen = () => {
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

  const makeOpenUrl = (url: string) => () => Linking.openURL(url);

  return (
    <Stack spacing={4} style={tw`flex-1 py-4`}>
      <Profile
        name={`${user.first_name} ${user.last_name}`}
        email={user.email}
        uri={user.picture_url}
      />
      <Stack>
        {schoolLinks.map(({ title, link }, index) => (
          <ResourceLink title={title} onPress={() => Linking.openURL(link)} />
        ))}
      </Stack>
      <ResourceLink
        title="Guidance & Student Support Resources"
        onPress={makeOpenUrl(
          "https://lhs.fuhsd.org/guidance-student-support/high-school-planning/forms-and-quicklinks"
        )}
      />
      <Stack>
        {studentLinks.map(({ title, link }) => (
          <ResourceLink title={title} onPress={() => Linking.openURL(link)} />
        ))}
        {user.grad_year && (
          <>
            <ResourceLink
              title={`Class of ${user.grad_year} Instagram`}
              onPress={makeOpenUrl(
                `https://www.instagram.com/${classInstagrams[user.grad_year - 2022]}`
              )}
            />
            <ResourceLink
              title={`Class of ${user.grad_year} Facebook`}
              onPress={makeOpenUrl(
                `https://www.facebook.com/groups/${classFacebooks[user.grad_year - 2022]}`
              )}
            />
          </>
        )}
      </Stack>
      <ResourceLink
        title={"Lynbrook Principal Twitter"}
        onPress={() => Linking.openURL("https://twitter.com/lhsvikingprin/")}
      />
      <Button title="Sign Out" onPress={signOut} />
    </Stack>
  );
};

export default SettingsScreen;
