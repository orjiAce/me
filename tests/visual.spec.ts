import { expect, test } from "@playwright/test";

/**
 * §18 — visual baselines at 375 / 768 / 1440 per route, committed.
 * reducedMotion: reduce (config-wide) keeps them deterministic. The npm
 * package cards are masked whole: their download counts come from a live
 * API at build time and may render or hide (§12.3), so nothing inside
 * them can be a baseline.
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
      // networkidle is flaky under parallel load, and below-fold lazy
      // images never complete without scrolling — walk the page to force
      // them, then wait for fonts and every image before capturing.
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map((img) => new Promise((r) => { img.onload = img.onerror = r; })),
        );
      });
      await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
        fullPage: true,
        mask: [page.locator("section[aria-label='Open source'] .rounded-lg.border")],
        maxDiffPixels: 120,
      });
    });
  }
}
