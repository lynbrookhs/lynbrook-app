import { Children, isValidElement } from "react";

export const apiPath = (path: string) => {
  return new URL(path, "http://localhost:8000/api/");
  // return new URL(path, "https://lynbrookasb.org/api/");
};

export const COLORS = ["red", "yellow", "green", "blue", "indigo", "purple", "pink", "gray"];

export function getValidChildren(children: React.ReactNode) {
  return Children.toArray(children).filter((child) => isValidElement(child));
}
