import type { Profile } from "./types";

/**
 * Sentinel for facts the owner has not supplied yet (§21 open items).
 * Rendering code must check `isProvided()` and omit the element rather
 * than ever printing this string on the page.
 */
export const NEEDS_INPUT = "⚠ NEEDS INPUT";

export const isProvided = (value: string): boolean =>
  value !== NEEDS_INPUT && value.length > 0;

export const profile: Profile = {
  name: "Joseph Orji",
  alias: "Ace",
  title: "Lead Mobile Engineer · React Native & TypeScript",
  company: "Brains Digital Software Technology",
  location: "Abuja, Nigeria",
  timezone: "WAT (UTC+1)",
  availability: {
    open: true,
    note: "Available for fully remote contract engagements",
    preferredLength: "3–6 months",
  },
  stats: [
    { value: "7+", label: "Years shipping mobile" },
    { value: "12+", label: "Apps in production" },
    { value: "4", label: "Continents served" },
    { value: "2", label: "Open-source packages" },
  ],
  socials: [], // ⚠ NEEDS INPUT: GitHub, LinkedIn, X, Upwork URLs
  email: NEEDS_INPUT, // ⚠ NEEDS INPUT: public contact email
};
