import { defineConfig, devices } from "@playwright/test";

/**
 * E2E — §18, run against a PRODUCTION build (webpack), never the
 * Turbopack dev server: dev and build have been on split bundlers since
 * M4, and this suite is the divergence check. `reducedMotion: reduce`
 * keeps screenshots deterministic and doubles as a standing test of the
 * §11.6 guard (content must be fully present with no animation).
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3400",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // The production build runs BEFORE playwright (see the test:e2e script):
  // building inside webServer inherits Playwright's test environment and
  // corrupts Next's page-data collection. `next start` serves the already
  // built output — the whole point is webpack-production verification.
  webServer: {
    command: "pnpm exec next start -p 3400",
    url: "http://localhost:3400",
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
