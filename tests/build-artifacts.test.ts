import { createRequire } from "node:module";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
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
  it("@claim:site-build-output writes the static site to dist/site", () => {
    rmSync(siteRoot, { recursive: true, force: true });
    expect(existsSync(siteRoot)).toBe(false);

    execFileSync("npm", ["run", "build:site"], { cwd: resolve("."), stdio: "pipe" });

    expect(existsSync(resolve(siteRoot, "index.html"))).toBe(true);
    expect(existsSync(resolve(siteRoot, "demo/index.html"))).toBe(true);
    expect(existsSync(resolve(siteRoot, "privacy/index.html"))).toBe(true);
    expect(existsSync(resolve(siteRoot, "terms/index.html"))).toBe(true);
    expect(existsSync(resolve(siteRoot, "404.html"))).toBe(true);
    expect(existsSync(resolve(siteRoot, "staticwebapp.config.json"))).toBe(true);
  });

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
    expect(config.routes.find((route) => route.route === "/demo")?.rewrite).toBe("/demo/index.html");
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

  it("@claim:public-api-surface exports every documented function in both module formats and declares them", async () => {
    const esmPath = new URL("../dist/package/index.js", import.meta.url).href;
    const esm = await import(esmPath);
    const cjs = createRequire(import.meta.url)("../dist/package/index.cjs") as typeof esm;
    const names = ["createRecorder", "compareCapsules", "replayCapsule", "parseCapsule", "stringifyCapsule", "validateCapsule"] as const;
    for (const name of names) {
      expect(typeof esm[name], `ESM ${name}`).toBe("function");
      expect(typeof cjs[name], `CommonJS ${name}`).toBe("function");
    }
    const consumer = mkdtempSync(resolve(tmpdir(), "stc-types-"));
    try {
      writeFileSync(resolve(consumer, "consumer.mts"), `import { createRecorder, compareCapsules, replayCapsule, parseCapsule, stringifyCapsule, validateCapsule, type Capsule } from ${JSON.stringify(resolve("dist/package/index.js"))};\nconst recorder = createRecorder({ name: "typed", initialState: { count: 0 } });\nconst capsule: Capsule = parseCapsule(stringifyCapsule(recorder.capsule()));\ncompareCapsules(capsule, capsule);\nreplayCapsule(capsule, () => ({ count: 0 }));\nvalidateCapsule(capsule);\n`);
      try {
        execFileSync(resolve("node_modules/.bin/tsc"), ["--noEmit", "--module", "NodeNext", "--moduleResolution", "NodeNext", "--target", "ES2022", "consumer.mts"], { cwd: consumer, stdio: "pipe" });
      } catch (error) {
        const result = error as { stdout?: Buffer; stderr?: Buffer };
        throw new Error(`${result.stdout?.toString() ?? ""}${result.stderr?.toString() ?? ""}`);
      }
    } finally {
      rmSync(consumer, { recursive: true, force: true });
    }
  });

  it("@claim:local-tarball-install packs, installs offline, and imports the package from a fresh project", () => {
    const sandbox = mkdtempSync(resolve(tmpdir(), "stc-consumer-"));
    const packDir = resolve(sandbox, "pack");
    const consumer = resolve(sandbox, "consumer");
    try {
      mkdirSync(packDir);
      mkdirSync(consumer);
      execFileSync("npm", ["pack", "--pack-destination", packDir], { cwd: resolve("."), stdio: "pipe" });
      const tarball = resolve(packDir, "state-transition-capsule-0.1.0.tgz");
      expect(existsSync(tarball)).toBe(true);
      writeFileSync(resolve(consumer, "package.json"), JSON.stringify({ name: "fresh-consumer", private: true, type: "module" }));
      execFileSync("npm", ["install", "--offline", "--ignore-scripts", tarball], { cwd: consumer, stdio: "pipe" });
      const output = execFileSync("node", ["--input-type=module", "--eval", 'import { createRecorder, compareCapsules } from "state-transition-capsule"; const run = createRecorder({ name: "fresh", initialState: { count: 0 } }).capsule(); console.log(typeof compareCapsules + ":" + run.format);'], { cwd: consumer, encoding: "utf8" });
      expect(output.trim()).toBe("function:state-transition-capsule/v1");
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  it("@claim:node-20 declares Node.js 20 or newer in the published package manifest", () => {
    const manifest = JSON.parse(readFileSync(resolve("package.json"), "utf8")) as { engines?: { node?: string } };
    expect(manifest.engines?.node).toBe(">=20");
  });

  it("emits a dedicated raw demo document with demo social metadata", () => {
    const demo = readFileSync(resolve(siteRoot, "demo/index.html"), "utf8");
    expect(demo).toContain("<title>Demo — State Transition Capsule</title>");
    expect(demo).toContain('property="og:title" content="Demo — State Transition Capsule"');
    expect(demo).toContain('property="og:url" content="https://state-transition-capsule.sociobot.in/demo"');
    expect(demo).toContain('name="twitter:title" content="Demo — State Transition Capsule"');
  });
});
