// Filenames the ID tab stores in the app's document directory.
//
// A photo of the student ID card is saved as `student-id-<timestamp>.jpg`; a
// typed ID number is saved as `student-id-number.txt`. Both share the prefix,
// so anything that cleans up photos must exclude the number file explicitly or
// it deletes the number the student just saved.

export const ID_PREFIX = "student-id-";
export const ID_NUMBER_FILE = "student-id-number.txt";

export const isSavedPhoto = (name: string) => name.startsWith(ID_PREFIX) && name !== ID_NUMBER_FILE;
