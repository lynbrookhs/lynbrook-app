import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import { useClubOrgs, useUserOrgs } from "../../helpers/api";
import { Organization, OrganizationType } from "../../helpers/api/models";
import { ClubsScreenProps } from "../../navigation/tabs/ActivitiesNavigator";

type ClubItemProps = {
  item: Organization;
  subscribed: boolean;
  toggle: () => void;
  info: () => void;
};

const ClubItem = ({ item, subscribed, toggle, info }: ClubItemProps) => (
  <TouchableHighlight onPress={info}>
    <ListItem text={item.name} direction="row" style={tw`items-center`} spacing={2}>
      {item.type == OrganizationType.CLUB && (
        <TouchableOpacity onPress={toggle}>
          <Ionicons
            name={subscribed ? "remove-circle-outline" : "add-circle-outline"}
            style={tw`text-${subscribed ? "red" : "green"}-500 text-2xl`}
          />
        </TouchableOpacity>
      )}
      <Ionicons name="chevron-forward" style={tw`text-lg text-gray-500`} />
    </ListItem>
  </TouchableHighlight>
);

const ClubsScreen = ({ navigation }: ClubsScreenProps) => {
  const { data: clubOrgs, error } = useClubOrgs();
  const { data: userOrgs, error: error2 } = useUserOrgs();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!clubOrgs) return <ActivityIndicator style={tw`m-4`} />;
  if (!userOrgs) return <ActivityIndicator style={tw`m-4`} />;

  const listData = [
    {
      title: "My Clubs",
      data: userOrgs,
    },
    {
      title: "Other Clubs",
      data: clubOrgs.filter((item) => !userOrgs.some((i) => i.id === item.id)),
    },
  ];

  return (
    <SectionList<Organization>
      sections={listData}
      renderItem={({ item }) => (
        <ClubItem
          item={item}
          subscribed={userOrgs.includes(item)}
          toggle={() => console.log("TODO TOGGLE :D")}
          info={() => navigation.navigate("ClubDetail", { id: item.id })}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={tw`bg-gray-100 border-b border-gray-200`}>
          <Text style={tw`py-3 font-medium text-center`}>{title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ClubsScreen;
