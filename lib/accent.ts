import type { CSSProperties } from "react";
import type { Domain, Project, Track } from "@/content/types";

/**
 * The one hue a card is allowed — §5.1 (M7.5). Engineering projects
 * carry a domain hue; Zowis and LingoBase fall back to their track
 * accent (plum), per the owner's revision. Exposed as CSS variables so
 * the four sanctioned applications (tag, duotone cover, hover border,
 * case-study rule + fact-rail labels) all reference tokens, never raw
 * values.
 */

export const DOMAIN_LABEL: Record<Domain, string> = {
  fintech: "Fintech",
  health: "Health",
  media: "Media & learning",
  marketplace: "Marketplace",
  mobility: "Mobility",
};

const TRACK_LABEL: Record<Track, string> = {
  engineering: "Engineering",
  founder: "Founder",
  "open-source": "Open source",
};

type Accentable = Pick<Project, "track" | "domain">;

export function accentLabel(project: Accentable): string {
  return project.domain ? DOMAIN_LABEL[project.domain] : TRACK_LABEL[project.track];
}

export function accentVars(project: Accentable): CSSProperties {
  if (project.domain) {
    return {
      "--accent": `var(--color-${project.domain})`,
      "--accent-sub": `var(--color-${project.domain}-sub)`,
    } as CSSProperties;
  }
  const track = project.track === "founder" ? "plum" : "signal";
  return {
    "--accent": `var(--color-${track})`,
    "--accent-sub": `var(--color-${track}-sub)`,
  } as CSSProperties;
}

/** The track-accent tint for the card hover bloom (§5.1 redirect item 5). */
export function bloomVar(project: Accentable): CSSProperties {
  const track = project.track === "founder" ? "plum" : "signal";
  return { "--bloom": `var(--color-${track}-sub)` } as CSSProperties;
}
