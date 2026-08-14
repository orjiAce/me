import { expect, test } from "@playwright/test";

/**
 * §18 — visual baselines at 375 / 768 / 1440 per route, committed.
 * reducedMotion: reduce (config-wide) keeps them deterministic; the live
 * npm download counts are masked because they change per build.
 */
const WIDTHS = [375, 768, 1440] as const;
const ROUTES: [string, string][] = [
  ["/", "home"],
  ["/work", "work"],
  ["/zowis", "zowis"],
  ["/about", "about"],
  ["/lab", "lab"],
  ["/contact", "contact"],
  ["/work/jifu360", "case-jifu360"],
];

for (const width of WIDTHS) {
  for (const [route, name] of ROUTES) {
    test(`visual: ${name} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
        fullPage: true,
        mask: [page.getByText(/\/wk/)],
        maxDiffPixels: 120,
      });
    });
  }
}
