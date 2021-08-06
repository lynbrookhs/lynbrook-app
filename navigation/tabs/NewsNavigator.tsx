import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PostsScreen from "../../screens/news/PostsScreen";
import { screenOptions } from "../config";

type NewsParamList = {
  Posts: undefined;
};

const NewsStack = createStackNavigator<NewsParamList>();

const NewsNavigator = () => {
  return (
    <NewsStack.Navigator screenOptions={screenOptions}>
      <NewsStack.Screen name="Posts" component={PostsScreen} options={{ headerTitle: "Posts" }} />
    </NewsStack.Navigator>
  );
};

export default NewsNavigator;
