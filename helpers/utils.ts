import { Children, isValidElement } from "react";

export function getValidChildren(children: React.ReactNode) {
  return Children.toArray(children).filter((child) => isValidElement(child));
}
