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
import { useUser, useUserOrgs } from "../../helpers/api";
import { OrganizationType } from "../../helpers/api/models";

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
    <ListItem
      text={title}
      direction="row"
      style={tw`items-center`}
      border={idx === 0 ? "both" : "bottom"}
    >
      <Ionicons name="open-outline" style={tw`text-lg text-gray-500`} />
    </ListItem>
  </TouchableHighlight>
);

const SettingsScreen = () => {
  const { data: user, error } = useUser();
  const { data: orgs, error: error2 } = useUserOrgs();
  const { signOut } = useAuth();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user) return <ActivityIndicator style={tw`m-4`} />;
  if (!orgs) return <ActivityIndicator style={tw`m-4`} />;

  const mainOrgs = orgs.filter((x) => x.type !== OrganizationType.CLUB);

  return (
    <ScrollView style={tw`flex-1`}>
      <Stack spacing={8} style={tw`py-8`}>
        <Profile
          name={`${user.first_name} ${user.last_name}`}
          email={user.email}
          uri={user.picture_url}
        />

        {mainOrgs.map((x) => (
          <Stack key={x.id}>
            {x.links.map(({ title, url }, idx) => (
              <ResourceLink key={url} idx={idx} title={title} url={url} />
            ))}
          </Stack>
        ))}

        <Stack>
          <ResourceLink
            idx={0}
            title="Guidance & Student Support Resources"
            url="https://lhs.fuhsd.org/guidance-student-support/high-school-planning/forms-and-quicklinks"
          />
          <ResourceLink
            idx={1}
            title={"Lynbrook Principal Twitter"}
            url="https://twitter.com/lhsvikingprin/"
          />
        </Stack>

        <ListItem border="both">
          <Button title="Sign Out" onPress={signOut} />
        </ListItem>
      </Stack>
    </ScrollView>
  );
};

export default SettingsScreen;
