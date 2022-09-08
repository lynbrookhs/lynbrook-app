import { format } from "date-fns";
import { usePolls, usePost } from "lynbrook-app-api-hooks";
import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import tw from "twrnc";

import APIError from "../../components/APIError";
import Loading from "../../components/Loading";
import Poll from "../../components/Poll";
import Stack from "../../components/Stack";
import markdownStyles from "../../helpers/markdownStyles";
import { PostDetailScreenProps } from "../../navigation/tabs/NewsNavigator";

const PostDetailScreen = ({ navigation, route }: PostDetailScreenProps) => {
  const { data: post, error } = usePost(route.params.id);
  const { data: polls, error: error2 } = usePolls(route.params.id);

  useEffect(() => {
    if (post) {
      navigation.setOptions({ title: post.title });
    }
  }, [post]);

  if (error) return <APIError error={error} />;
  if (error2) return <APIError error={error2} />;
  if (!post) return <Loading />;

  return (
    <Stack style={tw`flex-1`}>
      <Stack style={tw`bg-white p-3 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold`}>{post.title}</Text>
        <Text style={tw`text-sm text-gray-500`}>{post.organization.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          {format(new Date(post.date), "EEEE, MMMM d, y")}
        </Text>
      </Stack>
      <ScrollView style={tw`bg-white flex-1`}>
        <Stack style={tw`p-3`} spacing={2}>
          <Markdown style={markdownStyles}>{post.content}</Markdown>
          {polls?.map((x) => (
            <Poll key={x.id} poll={x} submission={x.submissions[0]} />
          ))}
        </Stack>
      </ScrollView>
    </Stack>
  );
};

export default PostDetailScreen;
