import React from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import Stack from "../../components/Stack";
import { usePosts } from "../../helpers/api";

type Post = any;

type PostItemProps = {
  item: Post;
  index: number;
};

const PostItem = ({ item, index }: PostItemProps) => (
  <Stack style={[tw`p-3 bg-white border-b border-gray-200`, index === 0 && tw`border-t`]}>
    <Text style={tw`text-sm font-bold`}>{item.title}</Text>
    <Text style={tw`text-sm text-gray-500`}>{item.organization.name}</Text>
  </Stack>
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
