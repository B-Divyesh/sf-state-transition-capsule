import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("loads the sample and locates the first divergent field", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/State Transition Capsule/);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.getByRole("button", { name: "Load two-run example" }).click();
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeEnabled();
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await expect(page.getByText('State changed after “chart.selected”.')).toBeVisible();
});

test("reports an invalid capsule without breaking the workbench", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("{nope") });
  await expect(page.getByRole("status")).toContainText("not valid JSON");
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeDisabled();
});

test("keeps the comparison path available offline", async ({ page, context }) => {
  await page.goto("/");
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await expect(page.getByText("Offline · still ready")).toBeVisible();
  await page.getByRole("button", { name: "Load two-run example" }).click();
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
});

test("supports the two-run workflow from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

  const sample = page.getByRole("button", { name: "Load two-run example" });
  await sample.focus();
  await page.keyboard.press("Space");
  const compare = page.getByRole("button", { name: "Compare runs" });
  await expect(compare).toBeEnabled();
  await compare.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
});

test("production offline shell installs, updates its controller, and reloads offline", async ({ page, context }) => {
  test.skip(process.env.PLAYWRIGHT_PRODUCTION !== "1", "requires the built site served by Vite preview");

  await page.goto("/");
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state === "activated";
  });

  // A worker controls its clients after a navigation, not its first registration page.
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Find the first state change that broke the second run." })).toBeVisible();
  await page.getByRole("button", { name: "Load two-run example" }).click();
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
});

test("restores and verifies a Studio license", async ({ page }) => {
  await page.route("**/products/state-transition-capsule/verify?license=test-token", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ valid: true, reason: "ok", expires_at: null })
  }));
  await page.goto("/?license=test-token");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Studio active" })).toBeVisible();
  await expect(page.getByLabel("Remember on this device")).toBeEnabled();
});

test("has no serious accessibility violations", async ({ page }, testInfo) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, testInfo.project.name).toEqual([]);
});

test("legal pages have one main heading and landmark", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
