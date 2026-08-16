import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

/**
 * §16 — every static route plus every case-study slug.
 *
 * lastModified derives from the content itself (amendment v5 §4.5), never
 * from build time: a deploy that changes nothing must not claim every page
 * changed. A project's own date is its end month, or its start month while
 * it is still running; the static routes carry the most recent date in the
 * record, which is what actually moves them.
 */

/** 'YYYY-MM' → a Date on the first of that month. */
const monthDate = (ym: string) => new Date(`${ym}-01T00:00:00Z`);

function projectDate(project: (typeof projects)[number]): Date | null {
  const ym = project.end ?? project.start;
  return ym ? monthDate(ym) : null;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = projects
    .filter((p) => p.caseStudy && p.start !== null && p.status !== "archived")
    .map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified: projectDate(p) ?? monthDate(p.start!),
    }));

  const dates = caseStudies.map((entry) => entry.lastModified.getTime());
  const newest = dates.length
    ? new Date(Math.max(...dates))
    : monthDate("2019-09");

  const routes = ["", "/work", "/zowis", "/about", "/lab", "/contact"].map(
    (path) => ({ url: `${siteUrl}${path}`, lastModified: newest }),
  );

  return [...routes, ...caseStudies];
}
