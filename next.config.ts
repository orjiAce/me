import type { NextConfig } from "next";

/*
 * Security headers — §13.
 *
 * Deviation from spec, flagged for review: `script-src 'self'` alone blocks
 * Next.js's inline bootstrap scripts (the page would render but never
 * hydrate), and the spec omits style-src while Next injects inline styles.
 * Both get 'unsafe-inline' for now; the hardening milestone (M10) should
 * replace this with a nonce-based CSP via middleware.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.prod.website-files.com https://*.supabase.co",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io",
  "frame-src https://challenges.cloudflare.com https://cal.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
