import { expect, test } from "@playwright/test";

/** §18 — case-study navigation; §17 rows 3 and 11. */

test("spine row → case study → NextProject band", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("link", { name: "JIFU360" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("JIFU360");
  await expect(page.getByText("4.8/5").first()).toBeVisible();
  await page.getByRole("link", { name: /Next project/i }).click();
  await expect(page).toHaveURL(/\/work\/leadership-news/);
});

test("unknown slug 404s with correct status (edge #11)", async ({ page }) => {
  const response = await page.goto("/work/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("That page doesn’t exist.")).toBeVisible();
});

test("spine-only project has no page (edge #3)", async ({ page }) => {
  const response = await page.goto("/work/sinimax");
  expect(response?.status()).toBe(404);
});

test("Leadership News page is live now that it is dated", async ({ page }) => {
  const response = await page.goto("/work/leadership-news");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leadership News");
  await expect(page.getByRole("heading", { name: "AI reading aids" })).toBeVisible();
});

test("case study fact rail and prose render", async ({ page }) => {
  await page.goto("/work/nexaflex");
  await expect(page.getByText("Role", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The security architecture" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The quote-polling engine" })).toBeVisible();
});
