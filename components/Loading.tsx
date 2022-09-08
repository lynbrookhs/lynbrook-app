import React from "react";
import { ActivityIndicator } from "react-native";
import tw from "twrnc";

import { LYNBROOK_BLUE } from "../helpers/constants";

const Loading = () => <ActivityIndicator color={LYNBROOK_BLUE} style={tw`mt-4`} />;

export default Loading;
