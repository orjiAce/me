import type { NextConfig } from "next";

/*
 * Security headers — §13 (as amended, decision 2026-08).
 *
 * script-src keeps 'unsafe-inline' permanently: a nonce-based CSP forces
 * dynamic rendering on every route, which breaks the static/ISR model (§8)
 * and the LCP budget (§14). The policy is tightened around it instead:
 * object-src 'none', base-uri 'self', form-action 'self',
 * frame-ancestors 'none'. style-src needs 'unsafe-inline' for Next's
 * injected inline styles.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.prod.website-files.com https://*.supabase.co",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io",
  "frame-src https://challenges.cloudflare.com https://cal.com",
  "object-src 'none'",
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
