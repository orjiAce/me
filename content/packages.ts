import type { Pkg } from "./types";
import { NEEDS_INPUT } from "./profile";

/** npm packages — §9.5 seed. Repo URLs are ⚠ NEEDS INPUT; the Lab page
 *  hides the repo link (never guesses a URL) until they are supplied. */
export const packages: Pkg[] = [
  {
    name: "rn-credit-card-textinput",
    description:
      "Credit card input for React Native with formatting, validation and card-type detection.",
    repo: NEEDS_INPUT, // ⚠ NEEDS INPUT: repository URL
    npm: "https://www.npmjs.com/package/rn-credit-card-textinput",
    install: "npm i rn-credit-card-textinput",
  },
  {
    name: "rn-slick-bottom-tabs",
    description: "Animated bottom tab bar for React Native.",
    repo: NEEDS_INPUT, // ⚠ NEEDS INPUT: repository URL
    npm: "https://www.npmjs.com/package/rn-slick-bottom-tabs",
    install: "npm i rn-slick-bottom-tabs",
  },
];
