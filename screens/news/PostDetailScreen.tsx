import React from "react";
import { ActivityIndicator, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import Alert from "../../components/Alert";
import { usePost } from "../../helpers/api";
import { PostDetailScreenProps } from "../../navigation/tabs/NewsNavigator";

const PostDetailScreen = ({ route }: PostDetailScreenProps) => {
  const { data: post, error } = usePost(route.params.id);

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

  return <Text>{post.title}</Text>;
};

export default PostDetailScreen;
