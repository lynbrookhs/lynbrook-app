import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { OrganizationType, useMemberships, useSignOut, useUser } from "lynbrook-app-api-hooks";
import React from "react";
import { Button, ScrollView, Text, TouchableHighlight, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import tw from "twrnc";

import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";

type ProfileProps = {
  name: string;
  email: string;
  uri: string;
};

const Profile = ({ name, email, uri }: ProfileProps) => (
  <ListItem direction="row" spacing={4} align="center" border="both">
    <View>
      <View style={tw`w-14 h-14 rounded-full overflow-hidden`}>
        <AutoHeightImage width={56} source={{ uri }} />
      </View>
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-base font-bold`}>{name}</Text>
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
    <ListItem text={title} direction="row" align="center" border={idx === 0 ? "both" : "bottom"}>
      <Ionicons name="open-outline" style={tw`text-lg text-gray-500`} />
    </ListItem>
  </TouchableHighlight>
);

const SettingsScreen = () => {
  const { data: user, error } = useUser();
  const { data: memberships, error: error2 } = useMemberships();
  const signOut = useSignOut();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!user) return <Loading />;
  if (!memberships) return <Loading />;

  const mainOrgs = memberships
    .map((x) => x.organization)
    .filter((x) => x.type !== OrganizationType.CLUB)
    .filter((x) => x.links.length > 0);

  return (
    <ScrollView>
      <Stack spacing={8} style={tw`py-8`}>
        <Profile
          name={user.first_name ? `${user.first_name} ${user.last_name}` : "Guest User"}
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
            title="Lynbrook Principal Twitter"
            url="https://twitter.com/lhsvikingprin/"
          />
        </Stack>

        <Stack spacing={2}>
          <ListItem border="both">
            <Button title="Sign Out" onPress={signOut} />
          </ListItem>

          {Constants.manifest?.revisionId && (
            <ListItem style={tw`bg-transparent`} border="none">
              <Text style={tw`text-center text-gray-500`}>
                Stable {Constants.manifest?.revisionId}
              </Text>
            </ListItem>
          )}
        </Stack>
      </Stack>
    </ScrollView>
  );
};

export default SettingsScreen;
