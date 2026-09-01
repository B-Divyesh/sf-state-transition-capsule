import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const siteRoot = resolve("dist/site");

function precacheUrls(): string[] {
  const worker = readFileSync(resolve(siteRoot, "sw.js"), "utf8");
  const match = worker.match(/const ASSETS=(\[[^;]+\])/);
  const source = match?.[1];
  if (!source) throw new Error("Service worker does not declare its precache assets");
  return JSON.parse(source) as string[];
}

function outputPath(url: string): string {
  if (url === "/") return resolve(siteRoot, "index.html");
  if (url.endsWith("/")) return resolve(siteRoot, url.slice(1), "index.html");
  return resolve(siteRoot, url.slice(1));
}

describe("production artifacts", () => {
  it("precache contains only emitted non-map files (regression for f04ddbaf)", () => {
    const urls = precacheUrls();
    expect(urls).not.toContain("/assets/privacy-CVplLqVl.js");
    expect(urls).not.toContain("/assets/terms-CVplLqVl.js");
    expect(urls.filter((url) => url.endsWith(".map"))).toEqual([]);
    expect(urls.filter((url) => !existsSync(outputPath(url)))).toEqual([]);
  });

  it("ships immutable asset caching and browser response policies", () => {
    const config = JSON.parse(readFileSync(resolve(siteRoot, "staticwebapp.config.json"), "utf8")) as {
      globalHeaders: Record<string, string>;
      routes: Array<{ route: string; headers?: Record<string, string>; rewrite?: string }>;
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(config.routes.find((route) => route.route === "/assets/*")?.headers?.["Cache-Control"]).toBe("public, max-age=31536000, immutable");
    expect(config.routes.find((route) => route.route === "/demo")?.rewrite).toBe("/index.html");
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.responseOverrides["404"]?.rewrite).toBe("/404.html");
  });

  it("preloads the emitted display and data fonts to avoid first-view layout movement", () => {
    const home = readFileSync(resolve(siteRoot, "index.html"), "utf8");
    const preloadUrls = [...home.matchAll(/<link rel="preload" href="([^\"]+\.woff2)" as="font" type="font\/woff2" crossorigin\s*\/?\s*>/g)].map((match) => match[1]!);
    expect(preloadUrls).toHaveLength(2);
    expect(preloadUrls.some((url) => url.includes("bricolage-grotesque"))).toBe(true);
    expect(preloadUrls.some((url) => url.includes("ibm-plex-mono-latin-400"))).toBe(true);
    expect(preloadUrls.every((url) => existsSync(outputPath(url)))).toBe(true);
  });

  it("ships a distinct 180px Apple touch icon on every document route", () => {
    const icon = readFileSync(resolve(siteRoot, "apple-touch-icon.png"));
    expect(icon.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(icon.readUInt32BE(16)).toBe(180);
    expect(icon.readUInt32BE(20)).toBe(180);

    for (const route of ["index.html", "privacy/index.html", "terms/index.html", "404.html"]) {
      const document = readFileSync(resolve(siteRoot, route), "utf8");
      expect(document, route).toMatch(/<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"\s*\/?\s*>/);
    }
  });

  it("@claim:package-formats loads ESM and CommonJS and ships declarations", async () => {
    const esmPath = new URL("../dist/package/index.js", import.meta.url).href;
    const esm = await import(esmPath);
    const cjs = createRequire(import.meta.url)("../dist/package/index.cjs") as typeof esm;
    const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { dependencies?: Record<string, string> };
    expect(typeof esm.createRecorder).toBe("function");
    expect(typeof cjs.compareCapsules).toBe("function");
    expect(existsSync(resolve("dist/package/index.d.ts"))).toBe(true);
    expect(manifest.dependencies ?? {}).toEqual({});
  });
});
