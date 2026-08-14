/**
 * Content types — §9.1.
 *
 * Two deviations from the spec's literal type, both in service of the
 * "never invent a date" rule:
 *
 * - `start` is `string | null` rather than `string`. `start: null` means
 *   the engagement's months are not yet supplied (⚠ NEEDS INPUT) — the
 *   project never docks to the spine.
 * - `endUnknown` marks a completed engagement whose end month the CV does
 *   not record (edge case #4: EvriCent, Delta Digital). It renders as
 *   `02.2024 —` with a trailing dash, is never treated as active, and for
 *   overlap purposes only its start month counts — the minimal extent that
 *   is actually known. `end` must stay null alongside it.
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
  endUnknown?: true; // end month not recorded — see header comment (edge case #4)
  status: "active" | "completed" | "on-hold" | "archived";
  confidential?: boolean; // hides client name, shows "Confidential — fintech"
  domain?: string; // "fintech" | "marketplace" | "media" … — reserved for the §7.5 colour pass (amendment v3)
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
