import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import PostDetailScreen from "../../screens/news/PostDetailScreen";
import PostsScreen from "../../screens/news/PostsScreen";
import { screenOptions } from "../config";

export type PostsScreenProps = {
  navigation: StackNavigationProp<NewsParamList, "Posts">;
  route: RouteProp<NewsParamList, "Posts">;
};

export type PostDetailScreenProps = {
  navigation: StackNavigationProp<NewsParamList, "PostDetail">;
  route: RouteProp<NewsParamList, "PostDetail">;
};

type NewsParamList = {
  Posts: undefined;
  PostDetail: { id: number };
};

const NewsStack = createNativeStackNavigator<NewsParamList>();

const NewsNavigator = () => {
  return (
    <NewsStack.Navigator screenOptions={screenOptions}>
      <NewsStack.Screen name="Posts" component={PostsScreen} options={{ headerTitle: "Posts" }} />
      <NewsStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ headerTitle: "" }}
      />
    </NewsStack.Navigator>
  );
};

export default NewsNavigator;
