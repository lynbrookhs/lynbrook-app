import { expect, test } from "@jest/globals";

import { ID_NUMBER_FILE, isSavedPhoto } from "../idFiles";

test("the saved ID number is not treated as a photo", () => {
  const files = [ID_NUMBER_FILE, "student-id-1700000000000.jpg", "other.txt"];
  expect(files.filter(isSavedPhoto)).toEqual(["student-id-1700000000000.jpg"]);
});

test("files outside the ID prefix are ignored", () => {
  expect(isSavedPhoto("photo.jpg")).toBe(false);
  expect(isSavedPhoto("student-id.jpg")).toBe(false);
});
