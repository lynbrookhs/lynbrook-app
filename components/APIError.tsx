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
};

const APIError = ({ error, style, ...props }: APIErrorProps) => {
  const [title, description] = TEXT[error.status];

  return (
    <Alert
      style={[tw`m-6`, style]}
      status="error"
      title={title ?? "Error"}
      description={description ?? "An unknown error has occurred. Please try again."}
      {...props}
    />
  );
};

export default APIError;
