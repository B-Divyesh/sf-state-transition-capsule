import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@claim:first-divergence loads the demo and locates the first divergent field", async ({ page }) => {
  await page.goto("/demo");
  await expect(page).toHaveTitle(/State Transition Capsule/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await expect(page.getByText('State changed after “chart.selected”.')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Awaiting two capsules" })).toBeHidden();
});

test("@claim:demo-isolation keeps demo storage separate from real data", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("stc:saved-runs", "real-data-marker"));
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(await page.evaluate(() => localStorage.getItem("stc:saved-runs"))).toBe("real-data-marker");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("demo:")))).toEqual([]);
});

test("@claim:local-processing sends no capsule data off origin", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });
  await page.goto("/demo");
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test("reports an invalid capsule without breaking the workbench", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("{nope") });
  await expect(page.locator("#bench-message")).toContainText("not valid JSON");
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeDisabled();
});

test("rejects files above the documented 5 MB safety limit", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles({
    name: "too-large.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1)
  });
  await expect(page.locator("#bench-message")).toContainText("larger than the 5 MB local safety limit");
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

test("local routes load without console errors and keep required landmarks", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/demo", "/privacy/", "/terms/", "/404.html"]) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await page.title(), path).not.toBe("");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("used controls meet the 44px target and the page does not overflow", async ({ page }) => {
  await page.goto("/demo");
  for (const control of [
    page.getByRole("button", { name: "Reset demo" }),
    page.getByRole("link", { name: "Start for real" }),
    page.getByRole("button", { name: "Load two-run example" }),
    page.getByRole("button", { name: "Compare again" })
  ]) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("@claim:license-restore restores and verifies a Studio license", async ({ page }) => {
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
  for (const path of ["/", "/demo"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, `${testInfo.project.name} ${path}`).toEqual([]);
  }
});

test("legal pages have one main heading and landmark", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/", "/404.html"]) {
    await page.goto(path);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
