import React from "react";
import { ViewProps } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Error } from "../helpers/api";
import Alert from "./Alert";

export type APIErrorProps = ViewProps & {
  error: Error;
};

const TEXT: { [key: number]: [string, string] } = {
  404: ["Not Found", "The requested resource was not found."],
  401: ["Unauthorized", "You don't seem to be logged in. Try again?"],
  [-1]: ["Error", "An unknown error has occurred. Please try again."],
};

const APIError = ({ error, style, ...props }: APIErrorProps) => {
  const [title, description] = TEXT[error.status] ?? TEXT[-1];

  console.error(error);

  return (
    <Alert
      style={[tw`m-6`, style]}
      status="error"
      title={title}
      description={error.detail ?? description}
      {...props}
    />
  );
};

export default APIError;
