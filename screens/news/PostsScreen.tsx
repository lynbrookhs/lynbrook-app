import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Post, usePosts } from "lynbrook-app-api-hooks";
import React from "react";
import { FlatList, Text, TouchableHighlight } from "react-native";
import tw from "twrnc";

import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Loading from "../../components/Loading";
import Stack from "../../components/Stack";
import { PostsScreenProps } from "../../navigation/tabs/NewsNavigator";

type PostItemProps = {
  item: Post;
  index: number;
  onPress: () => void;
};

const PostItem = ({ item, index, onPress }: PostItemProps) => (
  <TouchableHighlight onPress={onPress}>
    <ListItem
      primary={item.title}
      secondary={item.organization.name}
      direction="row"
      border={index === 0 ? "both" : "bottom"}
    >
      <Stack direction="row" align="center" style={tw`self-start`} spacing={1}>
        <Text style={tw`text-sm text-gray-500`}>{format(new Date(item.date), "M/d")}</Text>
        <Ionicons name="chevron-forward" style={tw`text-sm text-gray-500`} />
      </Stack>
    </ListItem>
  </TouchableHighlight>
);

const PostsScreen = ({ navigation }: PostsScreenProps) => {
  const { data: posts, error, size, setSize } = usePosts();

  if (error) return <APIError error={error} />;
  if (!posts) return <Loading />;

  return (
    <FlatList<Post>
      style={tw`-mt-px`}
      data={posts.flatMap((x) => x.results)}
      renderItem={({ item, index }) => (
        <PostItem
          item={item}
          index={index}
          onPress={() => navigation.navigate("PostDetail", { id: item.id })}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => setSize(size + 1)}
    />
  );
};

export default PostsScreen;
