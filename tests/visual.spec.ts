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
        // Flip every lazy image to eager before walking the page. Chrome
        // does not reliably start a lazy load for an element that only
        // passes through the viewport during fast programmatic scrolling,
        // which left covers unpainted at capture time.
        document
          .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
          .forEach((img) => { img.loading = "eager"; });
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        // Live npm counts (§12.3) change the page height between runs.
        document
          .querySelectorAll("[data-npm-count]")
          .forEach((el) => ((el as HTMLElement).style.display = "none"));
        // Only images that are actually rendered can ever load: a lazy
        // image inside a display:none element (the spine app icons below
        // 768px) stays `complete === false` forever, so waiting on it
        // hangs. Race a timeout too, so a stalled request can never wedge
        // the whole suite.
        await Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete && img.getClientRects().length > 0)
            .map((img) =>
              Promise.race([
                new Promise((r) => { img.onload = img.onerror = r; }),
                new Promise((r) => setTimeout(r, 15000)),
              ]),
            ),
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
