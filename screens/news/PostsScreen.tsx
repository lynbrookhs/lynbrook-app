import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import ListItem from "../../components/ListItem";
import Stack from "../../components/Stack";
import { usePosts } from "../../helpers/api";

type Post = any;

type PostItemProps = {
  item: Post;
  index: number;
};

const PostItem = ({ item, index }: PostItemProps) => (
  <ListItem
    style={index === 0 && tw`border-t`}
    title={item.title}
    description={item.organization.name}
    direction="row"
  >
    <Stack direction="row" style={tw`items-center self-start`} spacing={1}>
      <Text style={tw`text-gray-500`}>{format(new Date(item.date), "M/d")}</Text>
      <Ionicons name="chevron-forward" style={tw`text-gray-500`} />
    </Stack>
  </ListItem>
);

const PostsScreen = () => {
  const { data: posts, error, size, setSize } = usePosts();

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

  if (!posts) {
    return <ActivityIndicator style={tw`m-4`} />;
  }

  return (
    <FlatList
      data={posts.flatMap((x: any) => x.results)}
      renderItem={PostItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => setSize(size + 1)}
    />
  );
};

export default PostsScreen;
