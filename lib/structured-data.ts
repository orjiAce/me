import type { Domain, Project } from "@/content/types";
import { profile } from "@/content/profile";
import { displayName } from "./accent";
import { siteUrl } from "./site";

/**
 * Structured data shared across routes — §16 as amended (v5 §4.1/§4.2).
 *
 * The Person is emitted once with a stable @id so the home page's Person,
 * the About page's ProfilePage mainEntity and every SoftwareApplication
 * author resolve to the same entity rather than three unlinked copies.
 */
export const PERSON_ID = `${siteUrl}/#person`;

export function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    alternateName: profile.alias,
    jobTitle: "Lead Mobile Engineer",
    worksFor: { "@type": "Organization", name: profile.company },
    knowsAbout: [
      "React Native",
      "TypeScript",
      "Expo",
      "Mobile architecture",
      "WebRTC",
      "Payments",
    ],
    sameAs: profile.socials.map((s) => s.href),
    email: `mailto:${profile.email}`,
    url: siteUrl,
  };
}

/**
 * schema.org applicationCategory, derived from the §5.1 domain axis rather
 * than judged per project, so the mapping is auditable in one place.
 */
const APP_CATEGORY: Record<Domain, string> = {
  fintech: "FinanceApplication",
  health: "HealthApplication",
  media: "MultimediaApplication",
  marketplace: "BusinessApplication",
  mobility: "TravelApplication",
};

const storeUrl = (project: Project, label: string) =>
  project.links?.find((l) => l.label.includes(label))?.href;

/**
 * aggregateRating is read out of the project's own metrics and emitted
 * only when a real rating value AND a real rating count are both present
 * — it can never be synthesised from nothing. Today exactly one project
 * qualifies: JIFU360, at 4.8/5 from 96 iOS ratings. Never hand-write one.
 */
function aggregateRating(project: Project) {
  const metric = project.metrics?.find((m) => /rating/i.test(m.label));
  if (!metric) return undefined;

  const score = /^([\d.]+)\s*\/\s*([\d.]+)$/.exec(metric.value);
  const count = metric.note ? /(\d[\d,]*)\s+ratings?/i.exec(metric.note) : null;
  if (!score || !count) return undefined;

  return {
    "@type": "AggregateRating",
    ratingValue: Number(score[1]),
    bestRating: Number(score[2]),
    ratingCount: Number(count[1]!.replace(/,/g, "")),
  };
}

/**
 * SoftwareApplication for a case study with live store listings (v5 §4.1).
 * The author is Ace — the developer — never the client, who is the
 * publisher. operatingSystem is derived from which listings actually
 * exist, so a Play-only app is never described as shipping on iOS.
 *
 * Returns null when the project has no store listing.
 */
export function softwareApplicationNode(project: Project) {
  const ios = storeUrl(project, "App Store");
  const android = storeUrl(project, "Google Play");
  if (!ios && !android) return null;

  const platforms = [ios && "iOS", android && "Android"].filter(Boolean);
  const rating = aggregateRating(project);

  return {
    "@type": "SoftwareApplication",
    name: displayName(project),
    description: project.summary,
    applicationCategory: project.domain
      ? APP_CATEGORY[project.domain]
      : undefined,
    operatingSystem: platforms.join(", "),
    author: { "@id": PERSON_ID },
    sameAs: [ios, android].filter(Boolean),
    url: `${siteUrl}/work/${project.slug}`,
    ...(rating ? { aggregateRating: rating } : {}),
  };
}
