import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { createRecorder, stringifyCapsule } from "../../src";

type ButtonColors = { foreground: string; background: string };

function rgbChannels(color: string): [number, number, number] {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Expected an opaque RGB color, received ${color}`);
  return channels as [number, number, number];
}

function relativeLuminance(color: string): number {
  const linearize = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const [redChannel, greenChannel, blueChannel] = rgbChannels(color);
  const red = linearize(redChannel);
  const green = linearize(greenChannel);
  const blue = linearize(blueChannel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio({ foreground, background }: ButtonColors): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

async function buttonColors(control: Locator): Promise<ButtonColors> {
  return control.evaluate((element) => {
    const style = getComputedStyle(element);
    return { foreground: style.color, background: style.backgroundColor };
  });
}

function capsuleFile(id: string, initialState: unknown = { count: 0 }) {
  return {
    name: `${id}.json`,
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      format: "state-transition-capsule/v1",
      id,
      name: id,
      createdAt: "2026-08-30T00:00:00.000Z",
      metadata: {},
      redactions: [],
      retention: { maxTransitions: 10, includeEvents: true },
      initial: { label: "Initial state", capturedAt: "2026-08-30T00:00:00.000Z", hash: "fixture", state: initialState },
      transitions: []
    }))
  };
}

async function demoStorageSnapshot(page: Page) {
  return page.evaluate(async () => {
    const storageEntries = (storage: Storage) => Array.from({ length: storage.length }, (_, index) => {
      const key = storage.key(index) ?? "";
      return [key, storage.getItem(key) ?? ""] as const;
    });
    const localEntries = storageEntries(localStorage);
    const sessionEntries = storageEntries(sessionStorage);
    const sampleMarkers = ["Quarterly report", "Q2 revenue", "chart.selected", "run_known_good", "run_changed"];
    const sampleStorageEntries = [...localEntries, ...sessionEntries]
      .filter(([key, value]) => sampleMarkers.some((marker) => key.includes(marker) || value.includes(marker)));
    const factory = indexedDB as IDBFactory & { databases?: () => Promise<Array<{ name?: string }>> };
    const databases = factory.databases ? await factory.databases() : [];

    return {
      normalLocalMarker: localStorage.getItem("stc:saved-runs"),
      normalSessionMarker: sessionStorage.getItem("stc:session-marker"),
      demoLocalKeys: localEntries.filter(([key]) => key.startsWith("demo:")).map(([key]) => key),
      demoSessionKeys: sessionEntries.filter(([key]) => key.startsWith("demo:")).map(([key]) => key),
      sampleStorageEntries,
      indexedDbNames: databases.flatMap(({ name }) => name ? [name] : [])
    };
  });
}

test("@claim:first-divergence loads the demo and locates the first divergent field", async ({ page }) => {
  await page.goto("/demo");
  await expect(page).toHaveTitle(/State Transition Capsule/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await expect(page.getByText('State changed after “chart.selected”.')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Awaiting two run files" })).toBeHidden();
});

test("@claim:demo-isolation keeps demo samples in memory and separate from real data", async ({ page }) => {
  await page.addInitScript(() => {
    if (location.pathname === "/demo") {
      localStorage.setItem("stc:saved-runs", "real-data-marker");
      sessionStorage.setItem("stc:session-marker", "real-session-marker");
      localStorage.setItem("demo:stale-local", "discard me");
      sessionStorage.setItem("demo:stale-session", "discard me");
    }
  });
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  expect(await demoStorageSnapshot(page)).toEqual({
    normalLocalMarker: "real-data-marker",
    normalSessionMarker: "real-session-marker",
    demoLocalKeys: [],
    demoSessionKeys: [],
    sampleStorageEntries: [],
    indexedDbNames: []
  });
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(await demoStorageSnapshot(page)).toEqual({
    normalLocalMarker: "real-data-marker",
    normalSessionMarker: "real-session-marker",
    demoLocalKeys: [],
    demoSessionKeys: [],
    sampleStorageEntries: [],
    indexedDbNames: []
  });
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL("/");
  const afterExit = await demoStorageSnapshot(page);
  expect(afterExit.normalLocalMarker).toBe("real-data-marker");
  expect(afterExit.normalSessionMarker).toBe("real-session-marker");
  expect(afterExit.demoLocalKeys).toEqual([]);
  expect(afterExit.demoSessionKeys).toEqual([]);
  expect(afterExit.sampleStorageEntries).toEqual([]);
  expect(afterExit.indexedDbNames).toEqual([]);
});

test("opens the isolated sample directly with the documented query URL", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL("/");
});

test("@claim:tab-local-storage keeps imported run files in the current tab only", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles(capsuleFile("known-good"));
  await page.locator("#candidate-file").setInputFiles(capsuleFile("changed-run"));
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeEnabled();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);

  await page.reload();
  await expect(page.locator("#baseline-status")).toHaveText("No run file loaded");
  await expect(page.locator("#candidate-status")).toHaveText("No run file loaded");
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeDisabled();
});

test("@claim:local-processing sends no capsule data off origin", async ({ page }) => {
  const unsafeRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173" || request.method() !== "GET") unsafeRequests.push(request.url());
  });
  await page.goto("/demo");
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  expect(unsafeRequests).toEqual([]);
});

test("@claim:no-telemetry-runtime makes only local static requests", async ({ page }) => {
  const unexpectedRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    const staticAsset = /\.(?:css|js|ts|woff2|webp|svg)$/.test(url.pathname) || url.pathname.startsWith("/@vite/") || url.pathname.startsWith("/node_modules/") || url.pathname.startsWith("/@fs/");
    if (url.origin !== "http://127.0.0.1:4173" || request.method() !== "GET" || (!request.isNavigationRequest() && !staticAsset)) {
      unexpectedRequests.push(request.url());
    }
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Load two-run example" }).click();
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await page.goto("/demo");
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  expect(unexpectedRequests).toEqual([]);
});

test("@claim:registration-unavailable removes checkout and leaves the viewer usable without an account", async ({ page }) => {
  const billingRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname === "api.sociobot.in") billingRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.getByText("Free viewer · no account required")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Registration unavailable" })).toBeVisible();
  await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Load two-run example" }).click();
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await page.goto("/terms/");
  await expect(page.getByText("This release does not offer Studio registration or a payment link.", { exact: false })).toBeVisible();
  expect(billingRequests).toEqual([]);
});

test("gives short recovery actions for malformed and incomplete run files", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("{nope") });
  const message = page.locator("#bench-message");
  await expect(message).toHaveText("broken.json is not valid JSON. Export the run file again, then choose the new file.");
  expect((await message.innerText()).trim().split(/\s+/)).toHaveLength(15);
  await page.locator("#baseline-file").setInputFiles({ name: "wrong.json", mimeType: "application/json", buffer: Buffer.from("{}") });
  await expect(message).toHaveText("wrong.json is missing the run-file format and required fields. Export it again, then choose the new file.");
  const schemaMessage = (await message.innerText()).trim();
  expect(schemaMessage.split(/\s+/)).toHaveLength(17);
  expect(schemaMessage).not.toMatch(/capsule/i);
  await expect(page.getByRole("button", { name: "Compare runs" })).toBeDisabled();
});

test("uses established run-file terms in viewer messages and result descriptions", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("#baseline-file").setInputFiles(capsuleFile("known-good"));
  await expect(page.locator("#bench-message")).toHaveText("known-good loaded as the known-good run file.");
  await expect(page.locator(".diff-table caption")).toHaveText("Changed fields in the first transition that differs between runs.");
  const viewerText = await page.locator("#workbench").textContent();
  expect(viewerText).not.toMatch(/\b(?:bay|capsule|divergent)\b/i);
});

test("describes unequal initial states with complete grammar", async ({ page }) => {
  await page.goto("/");
  await page.locator("#baseline-file").setInputFiles(capsuleFile("known-good", { count: 0 }));
  await page.locator("#candidate-file").setInputFiles(capsuleFile("failed-run", { count: 1 }));
  await page.getByRole("button", { name: "Compare runs" }).click();
  await expect(page.getByRole("heading", { name: "The runs start from different states." })).toBeVisible();
});

test("@claim:file-size-limit rejects files above the documented 5 MB safety limit", async ({ page }) => {
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

test("all visible links and controls meet the 44px target without overflow", async ({ page }, testInfo) => {
  for (const path of ["/demo", "/privacy/", "/terms/", "/404.html"]) {
    await page.goto(path);
    const controls = page.locator("a, button, label.file-label");
    for (let index = 0; index < await controls.count(); index += 1) {
      const control = controls.nth(index);
      if (!await control.isVisible()) continue;
      const box = await control.boundingBox();
      const label = (await control.innerText()).trim() || await control.getAttribute("aria-label") || control.toString();
      expect(box?.width, `${testInfo.project.name} ${path} ${label} width`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${testInfo.project.name} ${path} ${label} height`).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${testInfo.project.name} ${path} overflow`).toBe(true);
  }
});

test("supporting body copy stays at or above 16px", async ({ page }, testInfo) => {
  await page.goto("/");
  for (const selector of [".action-note", ".signal-list li", ".fine-print", ".site-footer"]) {
    const sizes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    expect(sizes.every((size) => size >= 16), `${testInfo.project.name} ${selector}: ${sizes.join(", ")}`).toBe(true);
  }
});

test("has no serious accessibility violations", async ({ page }, testInfo) => {
  for (const path of ["/", "/demo"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, `${testInfo.project.name} ${path}`).toEqual([]);

    const nameResults = await new AxeBuilder({ page }).withRules(["label-content-name-mismatch"]).analyze();
    expect(nameResults.violations, `${testInfo.project.name} ${path} accessible-name match`).toEqual([]);
  }
});

test("mobile primary CTA keeps exact AA contrast in every interaction state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const controls = [page.getByRole("link", { name: "Try it with sample data" })];

  for (const control of controls) {
    await control.scrollIntoViewIfNeeded();

    const normal = await buttonColors(control);
    expect(normal).toEqual({ foreground: "rgb(255, 249, 234)", background: "rgb(169, 58, 34)" });
    expect(contrastRatio(normal)).toBeCloseTo(6.03, 2);
    expect(contrastRatio(normal)).toBeGreaterThan(4.5);

    await control.focus();
    const focused = await buttonColors(control);
    expect(focused).toEqual(normal);
    expect(contrastRatio(focused)).toBeGreaterThan(4.5);

    await control.hover();
    await page.waitForTimeout(220);
    const hovered = await buttonColors(control);
    expect(hovered).toEqual({ foreground: "rgb(255, 249, 234)", background: "rgb(142, 47, 29)" });
    expect(contrastRatio(hovered)).toBeCloseTo(7.76, 2);
    expect(contrastRatio(hovered)).toBeGreaterThan(4.5);

    const box = await control.boundingBox();
    if (!box) throw new Error("Expected the primary CTA to have a bounding box");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const pressed = await buttonColors(control);
    expect(pressed).toEqual(hovered);
    expect(contrastRatio(pressed)).toBeGreaterThan(4.5);
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }

  const results = await new AxeBuilder({ page })
    .include(".hero .button-primary")
    .withRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(results.incomplete).toEqual([]);
});

test("copy code control includes its visible label in its accessible name", async ({ page, context }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const path of ["/", "/demo"]) {
    await page.goto(path);
    await expect(page.locator(".brand"), `${testInfo.project.name} ${path} wordmark`).toHaveAccessibleName("ST/C State Transition Capsule home");
    const copy = page.locator("[data-copy-target='api-code']");
    await expect(copy).toHaveAccessibleName("Copy code");
    await copy.click();
    await expect(copy).toHaveAccessibleName("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("createRecorder");
  }
});

test("keeps the demo disclosure and controls visible through the mobile comparison viewer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  await page.locator("#workbench-title").scrollIntoViewIfNeeded();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeInViewport();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeInViewport();
  await expect(page.getByRole("link", { name: "Start for real" })).toBeInViewport();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL("/");
});

test("runs editable package playground examples and updates output from edited JSON", async ({ page }) => {
  await page.goto("/demo");
  const input = page.getByLabel("Editable JSON scenario");
  await expect(page.locator("#playground-output")).toContainText("$.report.chart");
  await input.fill((await input.inputValue()).replace('"line"', '"area"'));
  await expect(page.locator("#playground-output")).toContainText('"area"');
  await page.getByRole("button", { name: "Show redaction" }).click();
  await expect(page.locator("#playground-output")).toContainText("[REDACTED]");
  await page.getByRole("button", { name: "Run replay" }).click();
  await expect(page.locator("#playground-output")).toContainText('"ok": true');
});

test("@claim:json-roundtrip imports package JSON in a fresh browser context and preserves the comparison", async ({ browser }) => {
  const initial = { report: { chart: null } };
  const good = createRecorder({ id: "roundtrip-good", name: "Roundtrip good", initialState: initial });
  const failed = createRecorder({ id: "roundtrip-failed", name: "Roundtrip failed", initialState: initial });
  good.record({ type: "chart.selected" }, { report: { chart: "bar" } });
  failed.record({ type: "chart.selected" }, { report: { chart: "line" } });
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:4173" });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await page.locator("#baseline-file").setInputFiles({ name: "known-good.json", mimeType: "application/json", buffer: Buffer.from(stringifyCapsule(good.capsule())) });
    await page.locator("#candidate-file").setInputFiles({ name: "failed-run.json", mimeType: "application/json", buffer: Buffer.from(stringifyCapsule(failed.capsule())) });
    await page.getByRole("button", { name: "Compare runs" }).click();
    await expect(page.getByText("$.report.chart", { exact: true }).first()).toBeVisible();
  } finally {
    await context.close();
  }
});

test("@claim:viewer-does-not-execute-capsules treats script-like run file text as data", async ({ page }) => {
  const unexpectedRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") unexpectedRequests.push(request.url());
  });
  await page.addInitScript(() => (window as Window & { capsuleExecuted?: boolean }).capsuleExecuted = false);
  await page.goto("/");
  const hostile = capsuleFile("hostile");
  const data = JSON.parse(hostile.buffer.toString()) as Record<string, unknown>;
  data.metadata = { note: '<img src="https://example.invalid/pixel" onerror="window.capsuleExecuted=true">' };
  data.initial = { label: "Initial state", capturedAt: "2026-08-30T00:00:00.000Z", hash: "fixture", state: { note: '<script>window.capsuleExecuted=true</script>' } };
  hostile.buffer = Buffer.from(JSON.stringify(data));
  await page.locator("#baseline-file").setInputFiles(hostile);
  await page.locator("#candidate-file").setInputFiles(hostile);
  await page.getByRole("button", { name: "Compare runs" }).click();
  expect(await page.evaluate(() => (window as Window & { capsuleExecuted?: boolean }).capsuleExecuted)).toBe(false);
  expect(unexpectedRequests).toEqual([]);
});

test("moves focus to each destination heading after forward and back navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacy" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Find the state change that broke the second run." })).toBeFocused();
  await page.getByRole("link", { name: "Demo" }).first().click();
  await expect(page.getByRole("heading", { name: "Find the state change that broke the second run." })).toBeFocused();
});

test("legal pages have one main heading and landmark", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/", "/404.html"]) {
    await page.goto(path);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("legal pages publish route-specific Open Graph and Twitter metadata", async ({ page }) => {
  for (const [path, title] of [["/privacy/", "Privacy — State Transition Capsule"], ["/terms/", "Terms — State Transition Capsule"]] as const) {
    await page.goto(path);
    await expect(page.locator("meta[property='og:title']")).toHaveAttribute("content", title);
    await expect(page.locator("meta[property='og:description']")).toHaveAttribute("content", /.+/);
    await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", "https://state-transition-capsule.sociobot.in/og-instrument-trace.webp");
    await expect(page.locator("meta[name='twitter:card']")).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("meta[name='twitter:title']")).toHaveAttribute("content", title);
    await expect(page.locator("meta[name='twitter:description']")).toHaveAttribute("content", /.+/);
    await expect(page.locator("meta[name='twitter:image']")).toHaveAttribute("content", "https://state-transition-capsule.sociobot.in/og-instrument-trace.webp");
  }
});

test("404 publishes route-specific social metadata", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://state-transition-capsule.sociobot.in/404.html");
  await expect(page.locator("meta[property='og:title']")).toHaveAttribute("content", "Page not found — State Transition Capsule");
  await expect(page.locator("meta[name='twitter:title']")).toHaveAttribute("content", "Page not found — State Transition Capsule");
});
