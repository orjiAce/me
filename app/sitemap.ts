import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

/** §16 — every static route plus every case-study slug. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["", "/work", "/zowis", "/about", "/lab", "/contact"].map(
    (path) => ({ url: `${siteUrl}${path}`, lastModified }),
  );
  const caseStudies = projects
    .filter((p) => p.caseStudy)
    .map((p) => ({ url: `${siteUrl}/work/${p.slug}`, lastModified }));
  return [...routes, ...caseStudies];
}
