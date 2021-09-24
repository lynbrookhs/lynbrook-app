import React from "react";
import { ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";

import { MONTAVISTA_PURPLE } from "../helpers/constants";

const Loading = () => <ActivityIndicator color={MONTAVISTA_PURPLE} style={tw`mt-4`} />;

export default Loading;
