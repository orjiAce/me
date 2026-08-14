/**
 * Content types — §9.1.
 *
 * One deviation from the spec's literal type, agreed for edge case #4
 * (undated projects): `start` is `string | null` rather than `string`.
 * `start: null` means the engagement's months are not yet supplied
 * (⚠ NEEDS INPUT) — the project renders in the "Earlier work" block and
 * never docks to the spine. No dates are ever fabricated to avoid this.
 */
export type Track = "engineering" | "founder" | "open-source";

export type Project = {
  slug: string;
  name: string;
  track: Track;
  role: string; // "Lead Mobile Engineer"
  org?: string; // client / company
  location?: string; // "Dubai, UAE"
  summary: string; // ≤ 160 chars, used on cards and meta description
  start: string | null; // ISO 'YYYY-MM'; null === undated (⚠ NEEDS INPUT)
  end: string | null; // null === present (only meaningful when start is set)
  status: "active" | "completed" | "on-hold" | "archived";
  confidential?: boolean; // hides client name, shows "Confidential — fintech"
  stack: string[];
  metrics?: { value: string; label: string; note?: string }[];
  highlights: string[]; // 3–5 bullets, each a shipped outcome
  links?: { label: string; href: string }[];
  cover?: { src: string; alt: string; ratio: "16/10" | "4/5" | "1/1" };
  gallery?: { src: string; alt: string }[];
  featured?: boolean; // surfaces on home
  caseStudy?: boolean; // if true, an MDX body must exist
};

export type Pkg = {
  name: string; // npm name
  description: string;
  repo: string;
  npm: string;
  install: string;
};

export type Profile = {
  name: string;
  alias: string;
  title: string;
  company: string;
  location: string;
  timezone: string;
  availability: { open: boolean; note: string; preferredLength: string };
  stats: { value: string; label: string }[];
  socials: { label: string; href: string }[];
  email: string;
};

export type TimelineEntry = {
  date: string; // ISO 'YYYY-MM'
  title: string;
  track: Track;
  note?: string;
};
