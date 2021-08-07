import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
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
  <ListItem title={item.name} direction="row">
    <Stack direction="row" style={tw`items-center self-center`}>
      {item.type == OrganizationType.CLUB && (
        <TouchableOpacity onPress={toggle}>
          {subscribed ? (
            <Ionicons name="remove-circle-outline" style={tw`text-red-500 text-xl`} />
          ) : (
            <Ionicons name="add-circle-outline" style={tw`text-green-500 text-xl`} />
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={info}>
        <Ionicons name="information-circle" style={tw`text-xl`} />
      </TouchableOpacity>
    </Stack>
  </ListItem>
);

const ClubsScreen = ({ navigation }: ClubsScreenProps) => {
  const { data: clubOrgs, error } = useClubOrgs();
  const { data: userOrgs, error: error2 } = useUserOrgs();

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!clubOrgs) return <ActivityIndicator style={tw`m-4`} />;
  if (!userOrgs) return <ActivityIndicator style={tw`m-4`} />;

  console.log(userOrgs);

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
    /* <FlatList<Organization>
      data={[...userOrgs.filter((item) => item.type != OrganizationType.CLUB), ...clubOrgs]}
      renderItem={({ item, index }) => (
        <ClubItem
          item={item}
          subscribed={userOrgs.includes(item)}
          toggle={() => console.log("TODO TOGGLE :D")}
          info={() => navigation.navigate("ClubsDetail", { id: item.id })}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
    /> */
    <SectionList<Organization>
      sections={listData}
      renderItem={({ item, index }) => (
        <ClubItem
          item={item}
          subscribed={userOrgs.includes(item)}
          toggle={() => console.log("TODO TOGGLE :D")}
          info={() => navigation.navigate("ClubsDetail", { id: item.id })}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={tw`py-3 font-medium text-center`}>{title}</Text>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ClubsScreen;
