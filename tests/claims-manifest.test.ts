import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

const root = resolve(".");
const claims = JSON.parse(readFileSync(resolve(root, ".factory/claims.json"), "utf8")) as Claim[];
const testSources = [
  "tests/core.test.ts",
  "tests/build-artifacts.test.ts",
  "tests/browser/site.spec.ts",
  "tests/browser/offline.spec.ts"
].map((file) => readFileSync(resolve(root, file), "utf8"));

function tagOccurrences(id: string): number {
  const tag = `@claim:${id}`;
  return testSources.reduce((count, source) => count + (source.match(new RegExp(tag, "g"))?.length ?? 0), 0);
}

describe("claims manifest", () => {
  it("keeps every published claim selector compatible with the pinned Vitest version", () => {
    const lockfile = JSON.parse(readFileSync(resolve(root, "package-lock.json"), "utf8")) as {
      packages: Record<string, { version?: string }>;
    };
    expect(lockfile.packages["node_modules/vitest"]?.version).toBe("3.2.7");

    for (const claim of claims) {
      const usesVitest = claim.test.includes("test:unit") || claim.test.includes("test:artifacts");
      if (usesVitest) {
        expect(claim.test, claim.id).not.toContain("--grep");
        expect(claim.test, claim.id).toContain(`--testNamePattern @claim:${claim.id}`);
      } else {
        expect(claim.test, claim.id).toContain(`--grep @claim:${claim.id}`);
      }
    }
  });

  it("maps every published claim to exactly one tagged regression test", () => {
    for (const claim of claims) {
      expect(tagOccurrences(claim.id), claim.id).toBe(1);
    }
  });

  it("keeps the review-2 build and tarball wording tied to tested claims", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");
    const buildClaim = claims.find((claim) => claim.id === "site-build-output");
    const tarballClaim = claims.find((claim) => claim.id === "local-tarball-install");

    expect(buildClaim).toEqual({
      id: "site-build-output",
      claim: "`npm run build:site` writes the static deployment to `dist/site/`.",
      where: "README",
      test: "npm run test:artifacts -- --testNamePattern @claim:site-build-output",
      sandbox: "remove dist/site, run npm run build:site, and assert the home, demo, legal, 404, and deployment configuration files exist under dist/site"
    });
    expect(tarballClaim?.test).toContain("@claim:local-tarball-install");
    expect(readme).toContain("`npm run build:site` writes the static deployment to `dist/site/`.");
    expect(readme).toContain("Build a local tarball from this checkout, then install that exact file in a fresh project:");
    expect(readme).not.toMatch(/ready[- ]to[- ]publish|factory deployment workflow/i);
  });
});
