import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import { useAuth } from "../../components/AuthProvider";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { useUser } from "../../helpers/api";

// TODO: Put class links in DB

const SCHOOL_LINKS = [
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

const STUDENT_LINKS = [
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

const CLASS_INSTAGRAMS = ["lynbrook2022", "lynbrook2023", "lynbrookclassof2024", ""];

const CLASS_FACEBOOKS = ["395859940822522", "lynbrookclassof2023", "1603301959845362", ""];

type ProfileProps = {
  name: string;
  email: string;
  uri: string;
};

const Profile = ({ name, email, uri }: ProfileProps) => (
  <ListItem direction="row" border="both">
    <View>
      {/* TODO: Image needs to be centered */}
      <Image style={tw`w-14 h-14 rounded-full mr-4`} source={{ uri }} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-base font-medium`}>{name}</Text>
      <Text style={tw`text-sm`}>{email}</Text>
    </View>
  </ListItem>
);

type ResourceLinkProps = {
  idx: number;
  title: string;
  url: string;
};

const ResourceLink = ({ idx, title, url }: ResourceLinkProps) => (
  <TouchableHighlight onPress={() => Linking.openURL(url)}>
    <ListItem direction="row" style={tw`items-center`} border={idx === 0 ? "both" : "bottom"}>
      <Text style={tw`flex-1`}>{title}</Text>
      <Ionicons name="link" style={tw`text-gray-500`} />
    </ListItem>
  </TouchableHighlight>
);

const SettingsScreen = () => {
  const { data: user, error } = useUser();
  const { signOut } = useAuth();

  if (error) return <APIError error={error} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <ScrollView style={tw`flex-1`}>
      <Stack spacing={8} style={tw`py-8`}>
        <Profile
          name={`${user.first_name} ${user.last_name}`}
          email={user.email}
          uri={user.picture_url}
        />

        <Stack>
          {SCHOOL_LINKS.map(({ title, link }, idx) => (
            <ResourceLink key={link} idx={idx} title={title} url={link} />
          ))}
        </Stack>

        <ResourceLink
          idx={0}
          title="Guidance & Student Support Resources"
          url="https://lhs.fuhsd.org/guidance-student-support/high-school-planning/forms-and-quicklinks"
        />

        <Stack>
          {STUDENT_LINKS.map(({ title, link }, idx) => (
            <ResourceLink key={link} title={title} idx={idx} url={link} />
          ))}

          {user.grad_year && (
            <>
              <ResourceLink
                idx={-1}
                title={`Class of ${user.grad_year} Instagram`}
                url={`https://www.instagram.com/${CLASS_INSTAGRAMS[user.grad_year - 2022]}`}
              />
              <ResourceLink
                idx={-1}
                title={`Class of ${user.grad_year} Facebook`}
                url={`https://www.facebook.com/groups/${CLASS_FACEBOOKS[user.grad_year - 2022]}`}
              />
            </>
          )}
        </Stack>

        <ResourceLink
          idx={0}
          title={"Lynbrook Principal Twitter"}
          url="https://twitter.com/lhsvikingprin/"
        />

        <ListItem border="both">
          <Button title="Sign Out" onPress={signOut} />
        </ListItem>
      </Stack>
    </ScrollView>
  );
};

export default SettingsScreen;
