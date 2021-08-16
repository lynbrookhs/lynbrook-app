import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { useMemberships, useOrgs, useRequest } from "../../helpers/api";
import { ClubCategory, Organization, OrganizationType } from "../../helpers/api/models";
import { ClubsScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

type ClubItemProps = {
  item: Organization;
  subscribed: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onPress: () => void;
};

const ClubItem = ({ item, subscribed, onAdd, onRemove, onPress }: ClubItemProps) => (
  <TouchableHighlight onPress={onPress}>
    <ListItem text={item.name} direction="row" align="center">
      {item.type === OrganizationType.CLUB && (
        <Stack direction="row" spacing={2} align="center">
          <TouchableOpacity onPress={subscribed ? onRemove : onAdd}>
            <Ionicons
              name={subscribed ? "remove-circle-outline" : "add-circle-outline"}
              style={tw`text-${subscribed ? "red" : "green"}-500 text-2xl`}
            />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" style={tw`text-lg text-gray-500`} />
        </Stack>
      )}
    </ListItem>
  </TouchableHighlight>
);

const ClubsScreen = ({ navigation }: ClubsScreenProps) => {
  const { data: memberships, error, mutate } = useMemberships();
  const { data: orgs, error: error2 } = useOrgs();
  const { request, error: error3 } = useRequest();
  const [sorted, setSorted] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <HeaderButton side="right" icon="list" onPress={() => setSorted(!sorted)} {...props} />
      ),
    });
  });

  const handleAdd = useCallback(
    async (organization: Organization) => {
      if (!memberships) return;
      mutate([...memberships, { organization, points: 0 }], false);
      await request("POST", "/users/me/orgs/", { organization: organization.id });
      mutate();
    },
    [memberships]
  );

  const handleRemove = useCallback(
    async (organization: Organization) => {
      if (!memberships) return;
      const filtered = memberships.filter((x) => x.organization.id !== organization.id);
      mutate(filtered, false);
      await request("DELETE", `/users/me/orgs/${organization.id}/`);
      mutate();
    },
    [memberships]
  );

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (error3) return <APIError error={error3} />;
  if (!memberships) return <ActivityIndicator style={tw`m-4`} />;
  if (!orgs) return <ActivityIndicator style={tw`m-4`} />;

  const clubs = orgs.filter((x) => x.type === OrganizationType.CLUB);

  const userOrgIds = memberships.map((x) => x.organization.id);
  const userOrgs = [
    ...orgs.filter((x) => x.type !== OrganizationType.CLUB && userOrgIds.includes(x.id)),
    ...clubs.filter((x) => userOrgIds.includes(x.id)),
  ];
  const otherClubs = clubs.filter((x) => !userOrgIds.includes(x.id));

  const listData = sorted
    ? [
        { title: "My Organizations", data: userOrgs },
        {
          title: "Competition",
          data: otherClubs.filter((x) => x.category === ClubCategory.COMPETITION),
        },
        { title: "Interest", data: otherClubs.filter((x) => x.category === ClubCategory.INTEREST) },
        { title: "Service", data: otherClubs.filter((x) => x.category === ClubCategory.SERVICE) },
      ]
    : [
        { title: "My Organizations", data: userOrgs },
        { title: "Other Organizations", data: otherClubs },
      ];

  return (
    <SectionList<Organization>
      style={tw`-mb-px`}
      sections={listData}
      renderItem={({ item }) => (
        <ClubItem
          item={item}
          subscribed={userOrgs.includes(item)}
          onAdd={() => handleAdd(item)}
          onRemove={() => handleRemove(item)}
          onPress={() => navigation.navigate("ClubDetail", { id: item.id })}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <ListItem
          style={tw`bg-gray-100`}
          border={listData.findIndex((x) => x.title === title) === 0 ? "both" : "bottom"}
        >
          <Text style={tw`font-medium text-center`}>{title}</Text>
        </ListItem>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ClubsScreen;
