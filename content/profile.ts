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
  // §9.2 seed, amended v3: "17" counts the dated engineering projects in
  // §9.3 (UWA unarchived, Nexaflex added). Confirm before publishing (§21).
  stats: [
    { value: "7+", label: "Years shipping mobile" },
    { value: "18", label: "Products shipped" },
    { value: "2019", label: "Shipping since" },
    { value: "2", label: "Open-source packages" },
  ],
  // Owner-confirmed 2026-08: no X, no Upwork link.
  socials: [
    { label: "GitHub", href: "https://github.com/orjiace" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/orji-joseph-mobile-dev" },
  ],
  email: "orjiace@gmail.com",
};
