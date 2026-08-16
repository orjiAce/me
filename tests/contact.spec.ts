import { expect, test } from "@playwright/test";

/** §18 — contact happy path against a mocked API, plus failure paths. */

async function fillForm(page: import("@playwright/test").Page) {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill("e2e@example.com");
  // v5 §3: project type is a pill radio group, not a select. Click the
  // visible label, which is what a user actually hits.
  await page.locator("label").filter({ hasText: /^Contract role$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("A message from the E2E suite, long enough to pass.");
}

test("happy path: success replaces the form", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    } else {
      await route.continue();
    }
  });
  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message sent.")).toBeVisible();
});

test("network failure: inline error + toast + mailto, text preserved (edge #12)", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "POST") await route.abort("connectionrefused");
    else await route.continue();
  });
  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();
  const alert = page.getByRole("alert").filter({ hasText: /\S/ });
  await expect(alert).toContainText("Your message is still here");
  // v5 §3: the failure state surfaces BOTH direct channels.
  await expect(alert.locator('a[href^="mailto:"]')).toHaveAttribute(
    "href",
    /^mailto:.*body=A%20message/,
  );
  await expect(
    alert.getByRole("link", { name: "Message me on WhatsApp" }),
  ).toBeVisible();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(/E2E suite/);
  await expect(page.getByText("Message not sent").first()).toBeVisible(); // toast
});

test("rate limited: friendly 429 with retry window (edge #13)", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 429,
        headers: { "Retry-After": "600" },
        contentType: "application/json",
        body: '{"ok":false,"error":"rate_limited"}',
      });
    } else {
      await route.continue();
    }
  });
  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText("Try again in 10 minutes");
});

test("inline validation on blur", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Email").blur();
  await expect(page.getByText("That email doesn't look right.")).toBeVisible();
});
