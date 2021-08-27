import { Ionicons } from "@expo/vector-icons";
import {
  ClubCategory,
  Membership,
  Organization,
  OrganizationType,
  useMemberships,
  useOrgs,
  useRequest,
} from "lynbrook-app-api-hooks";
import React, { PropsWithChildren, useCallback, useLayoutEffect, useState } from "react";
import { SectionList, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

import APIError from "../../components/APIError";
import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { ClubsScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

type ClubItemProps = {
  item: Organization;
  points?: number;
  onAdd: () => void;
  onRemove: () => void;
  onPress: () => void;
};

const ClubItem = ({ item, points, onAdd, onRemove, onPress }: ClubItemProps) => {
  const subscribed = points !== undefined;

  const Wrapper = ({ children }: PropsWithChildren<object>) =>
    item.type === OrganizationType.CLUB ? (
      <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
    ) : (
      <>{children}</>
    );

  return (
    <Wrapper>
      <ListItem direction="row" align="center">
        <Stack direction="row" style={tw`flex-1`} align="center" spacing={4}>
          <Text style={tw`text-base`}>{item.name}</Text>
          {points !== undefined && points > 0 && (
            <Text style={tw`text-gray-500 text-sm`}>{points} points</Text>
          )}
        </Stack>

        {item.type === OrganizationType.CLUB && (
          <Stack direction="row" spacing={4} align="center">
            <TouchableOpacity onPress={subscribed ? onRemove : onAdd}>
              <Ionicons
                name={subscribed ? "person-remove-outline" : "person-add-outline"}
                style={tw`text-${subscribed ? "red" : "green"}-500 text-lg`}
              />
            </TouchableOpacity>

            <Ionicons name="chevron-forward" style={tw`text-lg text-gray-500`} />
          </Stack>
        )}
      </ListItem>
    </Wrapper>
  );
};

const ClubsScreen = ({ navigation }: ClubsScreenProps) => {
  const { data: memberships, error, mutate } = useMemberships();
  const { data: _orgs, error: error2 } = useOrgs();
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
  if (!memberships) return <Loading />;
  if (!_orgs) return <Loading />;

  const membershipsById = memberships.reduce((acc, val) => {
    acc.set(val.organization.id, val);
    return acc;
  }, new Map<number, Membership>());

  const orgs = _orgs.map((x) => ({ ...x, membership: membershipsById.get(x.id) }));

  const userOrgs = [
    ...orgs.filter((x) => x.type !== OrganizationType.CLUB && x.membership),
    ...orgs.filter((x) => x.type === OrganizationType.CLUB && x.membership),
  ];
  const otherClubs = orgs.filter((x) => x.type === OrganizationType.CLUB && !x.membership);

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
    <SectionList<typeof orgs[0]>
      style={tw`-mb-px`}
      sections={listData}
      renderItem={({ item }) => (
        <ClubItem
          item={item}
          points={item.membership?.points}
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
