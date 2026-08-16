import { expect, test } from "@playwright/test";

/**
 * §7.2 / §9.3 — a spine row does exactly one thing: navigate to its own
 * page, or expand in place. Never both, never neither.
 */

/** The row article carrying a given project title. */
const row = (page: import("@playwright/test").Page, name: string) =>
  page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });

test("grouped rows link to their own case study, not the last row's (regression)", async ({
  page,
}) => {
  // The 2022 cluster renders through SpineGroup. Grouped rows used to be
  // position:static, so each stretched ::after overlay escaped to the group
  // wrapper and the last row in the DOM swallowed every click in the
  // cluster — BluetanksEV navigated to Sumotrust.
  await page.goto("/work");
  await row(page, "BluetanksEV").getByRole("link", { name: "BluetanksEV" }).click();
  await expect(page).toHaveURL(/\/work\/bluetanks-ev$/);

  await page.goto("/work");
  await row(page, "Sumotrust").getByRole("link", { name: "Sumotrust" }).click();
  await expect(page).toHaveURL(/\/work\/sumotrust$/);
});

test("spine-only rows expand in place with a working disclosure", async ({ page }) => {
  await page.goto("/work");
  const portsconnect = row(page, "PortsConnect");
  const summary = portsconnect.locator("summary");
  const panel = portsconnect.locator("summary + div");

  await expect(summary).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();

  await summary.click();

  await expect(summary).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  // The detail is the stack, the full highlights and any metric.
  await expect(panel).toContainText("React Native");
  await expect(panel.locator("li")).not.toHaveCount(0);

  await summary.click();
  await expect(summary).toHaveAttribute("aria-expanded", "false");
});

test("the disclosure is keyboard operable", async ({ page }) => {
  await page.goto("/work");
  const summary = row(page, "Truzact").locator("summary");
  await summary.focus();
  await expect(summary).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(summary).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Enter");
  await expect(summary).toHaveAttribute("aria-expanded", "false");
});

test("no row is both a link and a disclosure, and none is neither", async ({ page }) => {
  await page.goto("/work");
  const articles = page.locator("article").filter({ has: page.locator("h2, h3") });

  const modes = await articles.evaluateAll((nodes) =>
    nodes.map((node) => ({
      name: node.querySelector("h2, h3")?.textContent?.trim() ?? "?",
      link: !!node.querySelector('a[href^="/work/"], a[href="/zowis"]'),
      disclosure: !!node.querySelector("summary"),
      // ProjectCard renders undated founder work with no spine behaviour.
      isSpineRow: node.classList.contains("spine-row") || node.classList.contains("relative"),
    })),
  );

  const spineRows = modes.filter((m) => m.isSpineRow);
  expect(spineRows.length).toBeGreaterThan(0);

  for (const m of spineRows) {
    expect(m.link && m.disclosure, `${m.name} is both a link and a disclosure`).toBe(false);
    expect(m.link || m.disclosure, `${m.name} is neither a link nor a disclosure`).toBe(true);
  }
});

test("the two affordances are distinguishable before the click", async ({ page }) => {
  await page.goto("/work");
  // Case-study rows carry an arrow; expandable rows carry a chevron.
  const linked = row(page, "BluetanksEV");
  const expandable = row(page, "PortsConnect");

  await expect(linked.locator("h2 svg, h3 svg")).toHaveCount(1);
  await expect(linked.locator(".spine-chevron")).toHaveCount(0);
  await expect(expandable.locator(".spine-chevron")).toHaveCount(1);
});

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("spine-only detail is still reachable (§11.6: nothing hidden without JS)", async ({
    page,
  }) => {
    // The disclosure is a native <details>, so the stack and highlights of
    // every spine-only project — which have no case-study page to fall back
    // to — stay reachable with no script running.
    await page.goto("/work");
    const portsconnect = row(page, "PortsConnect");
    const panel = portsconnect.locator("summary + div");

    await expect(panel).toBeHidden();
    await portsconnect.locator("summary").click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("React Native");
  });
});
