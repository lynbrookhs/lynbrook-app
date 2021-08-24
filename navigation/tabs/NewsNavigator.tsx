import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";

import { RootStackParamList } from "..";
import PostDetailScreen from "../../screens/news/PostDetailScreen";
import PostsScreen from "../../screens/news/PostsScreen";
import { MainParamList } from "../MainNavigator";
import { screenOptions } from "../config";

type NewsTabScreenProps<T extends keyof NewsTabParamList> = {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<NewsTabParamList, T>,
    CompositeNavigationProp<
      BottomTabNavigationProp<MainParamList>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >;
  route: RouteProp<NewsTabParamList, T>;
};

export type PostsScreenProps = NewsTabScreenProps<"Posts">;
export type PostDetailScreenProps = NewsTabScreenProps<"PostDetail">;

export type NewsTabParamList = {
  Posts: undefined;
  PostDetail: { id: number };
};

const NewsStack = createNativeStackNavigator<NewsTabParamList>();

const NewsNavigator = () => {
  return (
    <NewsStack.Navigator screenOptions={screenOptions}>
      <NewsStack.Screen name="Posts" component={PostsScreen} options={{ title: "Posts" }} />
      <NewsStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "" }} />
    </NewsStack.Navigator>
  );
};

export default NewsNavigator;
