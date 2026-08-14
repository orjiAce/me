/**
 * Canonical site origin for metadata, OG URLs, sitemap and robots.
 * ⚠ The production domain is NEEDS INPUT (§21) — set NEXT_PUBLIC_SITE_URL
 * before deploying; the localhost fallback keeps builds honest rather
 * than inventing a domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
