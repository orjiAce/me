import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** §18 — axe on every route, zero WCAG A/AA violations. */
const ROUTES = [
  "/",
  "/work",
  "/work?track=founder",
  "/work?track=open-source",
  "/zowis",
  "/about",
  "/lab",
  "/contact",
  "/work/rightnowmd",
  "/work/jifu360",
  "/work/nexaflex",
  "/work/uwa",
  "/work/leadership-news",
  "/definitely-not-a-page",
];

for (const route of ROUTES) {
  test(`axe clean: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
}
