import { defineConfig } from "vitest/config";

/**
 * Unit tests only — Playwright owns tests/**\/*.spec.ts, so the include
 * list is explicit to keep the two runners out of each other's files.
 */
export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts", "content/**/*.test.ts"],
  },
});
