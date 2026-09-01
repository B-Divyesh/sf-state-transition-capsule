# Independent verification 7 — PASS

**Work order:** `state-transition-capsule-verify-7`

**Candidate:** `637fa5705b561e3ad2ef602743e36c3dd3cb0d47`

**Live URL:** <https://state-transition-capsule.sociobot.in/>

**Verified:** 1 September 2026 UTC from the clean clone at `/work/repo`.

## Verdict

**PASS.** The candidate satisfies the researched brief and supplied acceptance contract. No blocker, high, medium, or low severity product defect was observed. The live deployment matches the candidate.

## First-read and demo gate

A cold desktop visit answers the required questions on the first screen:

- **What it does:** “Find the state change that broke the second run.”
- **Who it serves:** developers debugging repeat-run failures.
- **What to click first:** **Try it with sample data**, beside “Loads two sample runs in a separate demo.”

That one click opens `/demo`, shows **“Demo — sample data, nothing is saved”**, and immediately reports `$.report.chart` after `chart.selected`, from `"bar"` to `"line"`. Reset restores the sample. Start for real returns to `/`. The same first action and result are visible at 390 px.

## Mandatory claims gate

`.factory/claims.json` exists with 20 unique entries. After `npm ci`, every listed command was run individually and exactly as declared before broader QA. **20/20 passed.** Browser claim commands passed in both configured projects.

| Claim | Result |
| --- | --- |
| `first-divergence` | PASS — 2 browser projects |
| `demo-isolation` | PASS — 2 browser projects |
| `local-processing` | PASS — 2 browser projects |
| `offline-reload` | PASS — exact build plus 2 production browser projects |
| `redaction` | PASS — 1 tagged unit test |
| `pure-replay` | PASS — 1 tagged unit test |
| `bounded-retention` | PASS — 1 tagged unit test |
| `package-formats` | PASS — exact build plus 1 tagged artifact test |
| `site-build-output` | PASS — 1 tagged artifact test |
| `license-restore` | PASS — 2 mocked-verifier browser projects |
| `tab-local-storage` | PASS — 2 browser projects |
| `no-telemetry-runtime` | PASS — 2 browser projects |
| `studio-price` | PASS — 2 browser projects |
| `recording` | PASS — 1 tagged unit test |
| `json-roundtrip` | PASS — 2 browser projects |
| `viewer-does-not-execute-capsules` | PASS — 2 browser projects |
| `public-api-surface` | PASS — exact build plus 1 tagged artifact test |
| `capsule-format-v1` | PASS — 1 tagged unit test |
| `local-tarball-install` | PASS — exact build plus 1 tagged artifact test |
| `node-20` | PASS — 1 tagged artifact test |

The landing page, README, Privacy, and Terms copy were cross-checked against the manifest. Observable claims about recording, JSON round trips, redaction, replay, retention, format, local processing, storage, offline use, license behavior, price, build output, and package installation have matching tests.

## Clean local gates and package consumer

- `npm ci`: PASS — 100 packages installed; 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 14 unit/manifest tests, 10 artifact tests, 52 browser tests, and 2 production-offline tests. The 2 development-mode offline skips are intentional.
- `npm run build`: PASS — produced `dist/package` and `dist/site`.
- `npm pack`: PASS — 8 files, 9,384 bytes compressed and 46,112 bytes unpacked.

A separate temporary consumer installed the tarball with `npm install --offline --ignore-scripts`. ESM and CommonJS imports both worked. The consumer independently exercised recording, redaction, a one-transition retention boundary, JSON round trip, equal and divergent comparison, validation, and reducer-error reporting. Empty names, zero retention, malformed JSON, and an unsupported format were rejected. The tarball includes ESM, CommonJS, TypeScript declarations, and no runtime dependencies.

## Independent product checks

- **Normal case:** the live sample identifies `$.report.chart`; two valid empty-transition run files report “These retained states match.”
- **Invalid input:** malformed JSON produces the stated JSON error and leaves comparison disabled.
- **Boundary:** a 5 MiB + 1 byte file produces the local safety-limit error.
- **Recovery:** loading the bundled example after each invalid input restores a successful comparison.
- **Demo isolation:** the persistent banner, Reset demo, and Start for real controls work at desktop and 390 px. The claim test separately proves a normal-storage marker survives demo reset and demo keys are cleared.
- **Playground and package:** the unfiltered browser suite exercises edited comparison input, redaction, replay, copy, hostile script-like strings, and local JSON import/export.

## Accessibility, mobile, and routing

- `/opt/fleet/lib/verify-url.sh` passed on live `/`, `/demo`, `/privacy/`, and `/terms/`: nonempty route title, `lang=en`, one `h1`, one `main`, complete image alt text, labelled buttons, and no console errors.
- Playwright Axe 4.10.2 found **zero serious or critical violations** on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` at both 1440×900 and 390×844.
- The first Tab reaches **Skip to main content**. Space loads the sample and Enter compares it. Focus on the dark workbench measured a 3 px light outline plus a 6 px orange outer ring.
- Every visible link, button, and file-label control measured at least 44×44 CSS px. Desktop and mobile showed no horizontal overflow.
- Reduced-motion emulation changed smooth scrolling to `auto`, reduced animation and transition durations to `0.01 ms`, and limited iterations to one.
- Route navigation/back-focus tests pass in the full suite. Legal and 404 routes have route-specific metadata. An unknown path returns HTTP 404 with the designed recovery page.
- The same-origin link crawl found no broken route or fragment. Both GitHub links returned 200; `mailto:` is explicit. The hosted checkout link was not followed because it is outside the product-owned resource scope.

## Privacy, headers, caching, and offline behavior

Fresh desktop and mobile contexts recorded the full normal → demo → reset → normal flow. Every request was a same-origin `GET`; no telemetry, run-file upload, API call, CDN request, or remote-font request occurred. Console and page-error logs were empty.

The live document returns HSTS, CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and a restrictive Permissions-Policy. `frame-ancestors 'none'` is delivered in the response header. Hashed JS/CSS/font assets return `public, max-age=31536000, immutable`; `/sw.js` returns `no-cache`; HTML revalidates after 30 seconds.

In a fresh browser-owned context, the service worker reached `activated`, `registration.update()` completed, and `/demo` reloaded offline with `$.report.chart` visible and no console/page error.

This is a static site and npm library with no product-owned server endpoint, sign-in, or server persistence. The optional license verifier is the shared Sociobot billing API, not an `sf-state-transition-capsule*` resource. The work-order boundary expressly forbids connecting to non-product resources, so it was not live rate-tested and no external allowance/429 threshold was observed. Its client path is covered by the controlled `license-restore` claim test, including the free-viewer fallback. Entra sign-in is not applicable.

## Performance and deployment identity

Fresh Lighthouse mobile results:

- Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**.
- FCP **1.1 s**, LCP **1.8 s**, TBT **190 ms**, CLS **0.0001**.
- Initial transfer **170,775 bytes** (167 KiB).

Production output is within every supplied asset budget: initial route JavaScript is 21,890 raw bytes, CSS is 20,262 bytes, self-hosted fonts total 72,032 bytes, and the hero WebP is 79,218 bytes.

All 25 publicly served files in the fresh `dist/site` build match the live responses byte for byte. This includes HTML, hashed JavaScript and CSS, fonts, images, source maps, metadata files, and `sw.js`, confirming that the deployment matches candidate `637fa5705b561e3ad2ef602743e36c3dd3cb0d47`.

Local evidence is retained under `.factory/evidence/verification-7/` (claim log, full-suite logs, consumer probes, live request/header checks, screenshots, Axe results, Lighthouse JSON, offline result, link crawl, and byte hashes).

## Defects by severity

| Severity | Findings |
| --- | --- |
| Blocker | None observed |
| High | None observed |
| Medium | None observed |
| Low | None observed |
