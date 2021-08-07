import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { ActivityIndicator, FlatList, Text, TouchableHighlight } from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { usePosts } from "../../helpers/api";
import { Post } from "../../helpers/api/models";
import { PostsScreenProps } from "../../navigation/tabs/NewsNavigator";

type PostItemProps = {
  item: Post;
  onPress: () => void;
};

const PostItem = ({ item, onPress }: PostItemProps) => (
  <TouchableHighlight onPress={onPress}>
    <ListItem primary={item.title} secondary={item.organization.name} direction="row">
      <Stack direction="row" style={tw`items-center self-start`} spacing={1}>
        <Text style={tw`text-sm text-gray-500`}>{format(new Date(item.date), "M/d")}</Text>
        <Ionicons name="chevron-forward" style={tw`text-sm text-gray-500`} />
      </Stack>
    </ListItem>
  </TouchableHighlight>
);

const PostsScreen = ({ navigation }: PostsScreenProps) => {
  const { data: posts, error, size, setSize } = usePosts();

  if (error) return <APIError error={error} />;
  if (!posts) return <ActivityIndicator style={tw`m-4`} />;

  return (
    <FlatList<Post>
      data={posts.flatMap((x) => x.results)}
      renderItem={({ item, index }) => (
        <PostItem item={item} onPress={() => navigation.navigate("PostDetail", { id: item.id })} />
      )}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => setSize(size + 1)}
    />
  );
};

export default PostsScreen;
