import { expect, test } from "@playwright/test";

/** §17 rows never exercised before M10: 19, 22/32, 23, 28, plus 200% zoom. */

test.describe("JavaScript disabled (row 19)", () => {
  test.use({ javaScriptEnabled: false });

  test("home content fully visible — nothing stays hidden", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Seventeen apps in production",
    );
    // Reveal-wrapped content must be visible: no html.js → no hidden state.
    const card = page.getByRole("link", { name: /JIFU360/ }).first();
    await expect(card).toBeVisible();
    const opacity = await page
      .locator(".reveal")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });

  test("filter works via plain links", async ({ page }) => {
    await page.goto("/work");
    await page
      .getByRole("navigation", { name: "Filter projects by track" })
      .getByRole("link", { name: "Founder" })
      .click();
    await expect(page).toHaveURL(/track=founder/);
    await expect(page.getByText("Zowis Fashion Limited").first()).toBeVisible();
  });

  test("contact degrades to the mailto path", async ({ page }) => {
    await page.goto("/contact");
    // The always-rendered left column carries a working mailto without JS.
    await expect(
      page.getByRole("link", { name: /orjiace@gmail\.com/ }).first(),
    ).toBeVisible();
    // The <noscript> fallback is in the document. (Playwright's JS-off
    // emulation is post-parse, so noscript children never become visible
    // DOM in this harness — asserted structurally instead.)
    const html = await page.content();
    expect(html).toContain("The form needs JavaScript");
  });
});

test("print hides chrome and prints external URLs (row 28)", async ({ page }) => {
  await page.goto("/work/nexaflex");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("body > header")).toBeHidden();
  await expect(page.locator("body > footer")).toBeHidden();
  const afterContent = await page
    .locator("a[href^='https://www.nexaflex.com']")
    .first()
    .evaluate((el) => getComputedStyle(el, "::after").content);
  expect(afterContent).toContain("nexaflex.com");
});

test("200% zoom equivalent: no horizontal scroll at 640px (WCAG 1.4.10)", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 512 });
  for (const route of ["/", "/work", "/contact"]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
});

test("the spine at 320px: all entries, sane scroll length (rows 22/32)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/work");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  // 17 dated engagements: 11 lane rows + 6 inside the 2022 group.
  await expect(page.locator("ol[aria-label] article")).toHaveCount(17);
  const screens = await page.evaluate(
    () => document.body.scrollHeight / window.innerHeight,
  );
  expect(screens).toBeLessThan(12);
});

test("very wide viewport: container caps at 1280 (row 23)", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1200 });
  await page.goto("/");
  // Full-bleed section backgrounds SHOULD span the viewport (row 23) —
  // it is the inner container that caps at 1280 + gutters.
  const width = await page.evaluate(() => {
    const container = document.querySelector("main [class*='max-w-']");
    return container ? container.getBoundingClientRect().width : Infinity;
  });
  expect(width).toBeLessThanOrEqual(1280 + 96);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("text remains selectable on cards (row 25)", async ({ page }) => {
  await page.goto("/work");
  const userSelect = await page
    .locator("ol[aria-label] article p.measure")
    .first()
    .evaluate((el) => getComputedStyle(el).userSelect);
  expect(userSelect).not.toBe("none");
});
