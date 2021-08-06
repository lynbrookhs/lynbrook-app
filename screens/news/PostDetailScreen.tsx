import { format } from "date-fns";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import Stack from "../../components/Stack";
import { usePost } from "../../helpers/api";
import markdownStyles from "../../helpers/markdownStyles";
import { PostDetailScreenProps } from "../../navigation/tabs/NewsNavigator";

const PostDetailScreen = ({ navigation, route }: PostDetailScreenProps) => {
  const { data: post, error } = usePost(route.params.id);

  useEffect(() => {
    if (post) {
      navigation.setOptions({ headerTitle: post.title });
    }
  }, [post]);

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

  if (!post) {
    return <ActivityIndicator style={tw`m-4`} />;
  }

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{post.title}</Text>
        <Text style={tw`text-sm text-gray-500`}>{post.organization.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          {format(new Date(post.date), "EEEE, MMMM d y")}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white p-3 flex-1`}>
        <Markdown style={markdownStyles}>{post.content}</Markdown>
      </ScrollView>
    </Stack>
  );
};

export default PostDetailScreen;
