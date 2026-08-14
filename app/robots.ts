import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** §16 — allow all, point at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
