# Independent verification 6 — PASS

**Work order:** `state-transition-capsule-verify-6`  
**Candidate:** `5099aa3310dad5639c0d89d135928ea727a202cb`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 1 September 2026 UTC from the clean clone at `/work/repo`.

## Verdict

**PASS.** The candidate satisfies the researched brief and the supplied product acceptance contract. No blocker, high, medium, or low severity product defect was observed.

## First-read and demo gate

A cold visit at desktop and 390 px confirms all three required points in the first screen:

- **What it does:** “Find the state change that broke the second run.”
- **Who it serves:** developers debugging repeat-run failures.
- **What to do first:** **Try it with sample data**, next to “Loads two sample runs in a separate demo.”

The one-click action opens `/demo`. It shows **“Demo — sample data, nothing is saved”**, keeps **Reset demo** and **Start for real** available, and immediately reports `$.report.chart` after `chart.selected` (`"bar"` to `"line"`). Reset restores the same result. Start for real returns to `/`, hides the demo disclosure, and presents empty import bays.

## Mandatory claims gate

`.factory/claims.json` exists with 19 entries. After `npm ci`, every listed command was run exactly as declared before broader QA. **19/19 passed.** Browser claim commands passed in both configured projects.

| Claim | Exact command result |
| --- | --- |
| `first-divergence` | PASS — `npm run test:e2e -- --grep @claim:first-divergence`; 2 passed |
| `demo-isolation` | PASS — `npm run test:e2e -- --grep @claim:demo-isolation`; 2 passed |
| `local-processing` | PASS — `npm run test:e2e -- --grep @claim:local-processing`; 2 passed |
| `offline-reload` | PASS — `npm run build && npm run test:e2e:production -- --grep @claim:offline-reload`; 2 passed |
| `redaction` | PASS — `npm run test:unit -- --testNamePattern @claim:redaction`; 1 passed |
| `pure-replay` | PASS — `npm run test:unit -- --testNamePattern @claim:pure-replay`; 1 passed |
| `bounded-retention` | PASS — `npm run test:unit -- --testNamePattern @claim:bounded-retention`; 1 passed |
| `package-formats` | PASS — exact build plus tagged artifact test; 1 passed |
| `license-restore` | PASS — `npm run test:e2e -- --grep @claim:license-restore`; 2 passed |
| `tab-local-storage` | PASS — `npm run test:e2e -- --grep @claim:tab-local-storage`; 2 passed |
| `no-telemetry-runtime` | PASS — `npm run test:e2e -- --grep @claim:no-telemetry-runtime`; 2 passed |
| `studio-price` | PASS — `npm run test:e2e -- --grep @claim:studio-price`; 2 passed |
| `recording` | PASS — `npm run test:unit -- --testNamePattern @claim:recording`; 1 passed |
| `json-roundtrip` | PASS — `npm run test:e2e -- --grep @claim:json-roundtrip`; 2 passed |
| `viewer-does-not-execute-capsules` | PASS — tagged browser check; 2 passed |
| `public-api-surface` | PASS — exact build plus tagged artifact test; 1 passed |
| `capsule-format-v1` | PASS — tagged unit check; 1 passed |
| `local-tarball-install` | PASS — exact build plus tagged artifact test; 1 passed |
| `node-20` | PASS — tagged artifact check; 1 passed |

Landing, README, Privacy, and Terms statements were cross-checked against the manifest. The observable product statements have corresponding claim coverage.

## Clean local gates and package consumer

- `npm ci`: PASS; 100 packages installed and the audit reported 0 vulnerabilities.
- `npm test`: PASS — 13 unit/manifest tests; production build; 9 artifact tests; 50 browser tests passed with 2 intentional development-mode skips; 2 production offline tests passed.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; produced `dist/package` and `dist/site`.
- `npm pack`: PASS; 8 files, 9.5 kB compressed and 46.3 kB unpacked.

A separate temporary consumer installed the tarball with `npm install --offline --ignore-scripts`. Its ESM path imported the six documented functions, recorded and parsed JSON, redacted `auth.token`, found `$.count`, validated the run file, and completed reducer replay. Its CommonJS path loaded the package and recorded one transition. The packed manifest contains no runtime dependencies and includes ESM, CommonJS, and TypeScript declarations.

## Independent product checks

- **Normal flow:** the live demo compares the bundled runs and reports `$.report.chart`. Two independently generated equal run files produce “These retained states match.”
- **Invalid input and recovery:** `broken.json` produces `The selected file is not valid JSON.` and disables comparison. Loading the sample next and comparing succeeds.
- **Boundary:** a 5 MiB + 1 byte file produces the stated local safety-limit message without a page error.
- **Demo separation:** Reset restores the sample result; Start for real returns to the normal empty state. The claim suite independently preserves a normal-storage marker while clearing demo keys.
- **Editable playground:** compare, redaction, and replay examples execute the shipped package. Edited JSON changes the displayed package output.
- **Package behavior:** redaction, bounded retention, malformed-file validation, equal and changed comparisons, omitted-event replay failure, JSON round-trip, ESM, CommonJS, and declarations all passed.

## Accessibility, responsive behavior, and routing

- `/opt/fleet/lib/verify-url.sh` passed on live `/` in 664 ms and `/demo` in 694 ms: correct title, `lang=en`, one `h1`, one `main`, no missing alt text, no unlabeled buttons, and no console errors.
- Playwright Axe 4.10.2 found zero serious or critical issues on live `/` and `/demo` at 1440×900 and 390×844.
- A fresh keyboard context confirms the first Tab reaches **Skip to main content**. Space loads the sample and Enter compares it. The observed dark-panel focus treatment is a 3 px light outline with a 3 px offset and orange outer ring.
- Every visible link, button, and file label measured at least 44×44 CSS px. Desktop and 390 px checks found no horizontal overflow.
- Reduced-motion emulation matched the media query, removed the hero transform, and reduced transition duration to `0.01 ms`.
- `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404 have the required landmarks and route-specific titles. An unknown path returns HTTP 404.

## Privacy, requests, headers, and offline behavior

Fresh desktop and mobile contexts recorded the complete normal and demo flows. Every observed request was a same-origin `GET`; there was no telemetry, run-file upload, API request, CDN request, or remote-font request. Console and page-error logs were empty.

The live document returns CSP, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict referrer policy, and a restrictive Permissions-Policy. The CSP limits scripts, styles, fonts, images, workers, and connections as documented and sends `frame-ancestors 'none'` as a response header.

The service worker reached `activated`, controlled the page, remained active after `registration.update()`, and reloaded `/demo` offline with `$.report.chart` visible and no console error. `/sw.js` returns `Cache-Control: no-cache`; hashed JS/CSS/font assets return `public, max-age=31536000, immutable`; HTML revalidates after 30 seconds.

This is a static deployment with no product-owned server endpoint, sign-in, or server persistence. The license check is the documented external Sociobot billing call and is exercised by the claim suite with a controlled response. It was not contacted during live QA because the work order limits connections to this product resource. Therefore no product endpoint request allowance or observed 429 threshold applies.

## Performance and deployment identity

A Lighthouse binary was not present in the clean verifier image, so no outside package registry was contacted. The candidate's committed deployment record reports Lighthouse mobile Performance 100 and Accessibility 100 for these same live artifacts. Fresh independent browser measurements below confirm the underlying performance and accessibility budgets.

A fresh 390×844 browser run with 4× CPU slowdown and simulated mobile latency/bandwidth measured:

- first contentful paint: 996 ms;
- largest contentful paint: 996 ms;
- cumulative layout shift: 0;
- navigation completion: 1,245 ms;
- total initial transfer: 171,495 bytes;
- maximum observed interaction duration for loading and comparing the sample: 96 ms.

The production build emits 22,549 raw bytes of JavaScript, 20,262 bytes of CSS, 72,032 bytes of self-hosted fonts, and a 79,218-byte hero WebP. The initial route loads 21.90 kB raw JavaScript (about 8.1 kB gzip), within the stated budgets.

All 25 publicly served files from `dist/site` match the live responses byte for byte. The live root `index.html` SHA-256 is `bf342fc4ff3743b42b715ac67a6e4da3074b9ddabccc22359649c401fb9cc706`; the primary JS SHA-256 is `13c15de3b61e4a9a0fde193043488f71ca71ac25c09508c68cd87197e24e9770`. This confirms the live deployment matches candidate `5099aa3310dad5639c0d89d135928ea727a202cb`.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Blocker | None observed |
| High | None observed |
| Medium | None observed |
| Low | None observed |
