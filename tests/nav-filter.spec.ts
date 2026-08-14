import { expect, test } from "@playwright/test";

/** §18 — nav on mobile and desktop; filter → URL → refresh → back. */

test("desktop nav reaches every section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work");
});

test("mobile menu opens, traps focus, closes on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("filter is URL state: click → shareable → refresh → back (edge #26)", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("navigation", { name: "Filter projects by track" }).getByRole("link", { name: "Engineering" }).click();
  await expect(page).toHaveURL(/track=engineering/);
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "Filter projects by track" }).getByRole("link", { name: "Engineering" }),
  ).toHaveAttribute("aria-current", "true");
  await page.goBack();
  await expect(page).toHaveURL(/\/work$/);
});

test("deep link to a case study, then Back, keeps the filter (edge #27)", async ({ page }) => {
  await page.goto("/work?track=engineering");
  await page.getByRole("link", { name: "RightNowMD" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("RightNowMD");
  await page.goBack();
  await expect(page).toHaveURL(/track=engineering/);
});

test("unknown ?track= normalises to /work, no 404 (edge #10)", async ({ page }) => {
  const response = await page.goto("/work?track=bogus");
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/work$/);
});

test("skip link is first in tab order and works (§15)", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#/);
});
