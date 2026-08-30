import { expect, test } from "@playwright/test";

test("@claim:offline-reload production shell installs, controls, and reloads offline", async ({ browser }, testInfo) => {
  test.skip(process.env.PLAYWRIGHT_PRODUCTION !== "1", "requires the built site served by Vite preview");
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4173",
    viewport: testInfo.project.name === "mobile" ? { width: 390, height: 844 } : { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  const serviceWorkerErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") serviceWorkerErrors.push(message.text()); });
  try {
    await page.goto("/demo");
    await page.waitForFunction(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active?.state === "activated";
    });

    await page.reload();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await expect.poll(() => page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
      return registration?.active?.state;
    })).toBe("activated");
    expect(serviceWorkerErrors).toEqual([]);

    await context.setOffline(true);
    await page.reload();
    await expect(page).toHaveTitle("Demo — State Transition Capsule");
    await expect(page.getByRole("heading", { name: "Find the state change that broke the second run." })).toBeAttached();
    await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  } finally {
    await context.close();
  }
});
