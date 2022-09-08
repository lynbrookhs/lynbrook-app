import { Error } from "lynbrook-app-api-hooks";
import React, { useEffect, useMemo } from "react";
import { ViewProps } from "react-native";
import tw from "twrnc";

import Alert from "./Alert";

export type APIErrorProps = ViewProps & {
  error: Error;
};

const TEXT: { [key: number]: [string | undefined, string] } = {
  413: ["Payload Too Large", "The file you uploaded was too large."],
  404: ["Not Found", "The requested resource was not found."],
  401: ["Unauthorized", "You don't seem to be logged in. Try again?"],
  [-1]: [undefined, "An unknown error has occurred. Please try again."],
};

const traverse = (val: any): string | undefined => {
  if (val === undefined || val === null) return undefined;

  if (Array.isArray(val)) {
    if (val.length > 0) {
      return traverse(val[0]);
    }
  } else if (typeof val === "object") {
    return traverse(Object.values(val));
  }

  return val.toString();
};

const APIError = ({ error, style, ...props }: APIErrorProps) => {
  const [title, description] = TEXT[error.status] ?? TEXT[-1];
  const errorDesc = useMemo(() => traverse(error.inner), [error.inner]);
  useEffect(() => console.error(error), [error]);

  return (
    <Alert
      style={[tw`m-6`, style]}
      status="error"
      title={title ?? `Error ${error.status}`}
      description={errorDesc ?? description}
      {...props}
    />
  );
};

export default APIError;
