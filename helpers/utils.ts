import { Children, isValidElement } from "react";

const API_BASE_URL = "http://localhost:8000/api/";
export const apiPath = (path: string) => new URL(path, API_BASE_URL);

export function getValidChildren(children: React.ReactNode) {
  return Children.toArray(children).filter((child) => isValidElement(child));
}
