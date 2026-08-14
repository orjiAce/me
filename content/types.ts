/**
 * Content types — §9.1. Only `Profile` exists at Milestone 1; `Project`,
 * `Pkg` and the rest of the content model land in Milestone 2.
 */
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
