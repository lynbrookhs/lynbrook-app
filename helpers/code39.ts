// Code 39 barcode encoding.
//
// Done in plain JS on purpose: a native barcode module cannot be delivered by an
// OTA update, and builds older than the current one would crash on it. Rendering
// is just a row of black and white bars, so Views are enough.
//
// Each character is nine elements that alternate bar, space, bar, ... starting
// and ending with a bar. Exactly three of the nine are wide.

const PATTERNS: { [key: string]: string } = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  $: "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn",
};

export const CODE39_CHARS = Object.keys(PATTERNS).filter((x) => x !== "*");

export const isEncodable = (value: string) => [...value].every((c) => c in PATTERNS && c !== "*");

export type Bar = { bar: boolean; wide: boolean };

/**
 * Encode `value` as the bar/space elements of a Code 39 barcode, including the
 * `*` start and stop characters and the narrow gap between characters.
 * Returns an empty array if the value contains anything Code 39 cannot express.
 */
export const encodeCode39 = (value: string): Bar[] => {
  const text = `*${value.toUpperCase()}*`;
  const out: Bar[] = [];

  for (const char of text) {
    const pattern = PATTERNS[char];
    if (pattern === undefined) return [];

    for (let i = 0; i < pattern.length; i++) {
      out.push({ bar: i % 2 === 0, wide: pattern[i] === "w" });
    }

    // Characters are separated by a narrow space.
    out.push({ bar: false, wide: false });
  }

  out.pop(); // no trailing gap after the stop character
  return out;
};
