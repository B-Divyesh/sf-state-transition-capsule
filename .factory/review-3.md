# Adversarial first-read review 3 — State Transition Capsule

**Work order:** `state-transition-capsule-review-3`  
**Candidate:** `25d134655b5a8285a65dd6f8361b135581314ab8`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Reviewed:** 1 September 2026 UTC

## Verdict

**FAIL — 1 blocking finding.**

The free library and comparison viewer meet the first-read, demo, local-processing, accessibility, routing, and claims checks. The visible paid purchase action is a dead link: it returns HTTP 404 instead of opening the advertised hosted checkout. PASS requires no finding.

## Findings

### Blocking

#### F-3-1 — The advertised Studio checkout is a dead link

- **Location and quote:** live `/`, Capsule Studio section: **“Buy Studio in hosted checkout.”** Its `href` is `https://api.sociobot.in/api/v1/products/state-transition-capsule/checkout`.
- **Observed:** on 1 September 2026 UTC, both an initial `HEAD` request and a browser-context `GET` to that exact URL returned **HTTP 404**, `content-type: application/json`, body `{"error":"enabled factory product","status":404}`. The link is therefore not an explicit email/download link or a successful checkout redirect.
- **Why this blocks:** a visitor is offered a $39 one-time Studio purchase, but clicking its only purchase action ends at an error rather than a checkout. This fails the required no-dead-links crawl and leaves the paid tier unable to complete end to end. The listed `studio-price` claim passes only because its test asserts the displayed price and exact URL; it does not assert that the visitor reaches a live checkout.
- **Concrete fix:** configure the product's real hosted checkout at that endpoint, or replace the `href` with the live checkout URL. Add a deployment-level link-integrity check that issues a non-purchasing request to the CTA URL and accepts only a successful checkout response or an expected redirect. Do not show the purchase CTA until that check passes.

## 1. Cold first read

Fresh browser contexts loaded the live root at 390 × 844 and 1440 × 900 with `scrollY = 0`.

- **What it does:** “Find the state change that broke the second run.”
- **Who it is for:** developers debugging repeat-run failures.
- **What to click first:** **Try it with sample data**. The adjacent text says “Loads two sample runs in a separate demo.”

All three answers are visible before scrolling at both sizes. At 390 px the page width was 390 px, so no horizontal overflow was observed. This first-read gate passes.

## 2. Copy audit

Counts are whitespace-separated words. The audit includes visitor-facing headings and prose. Navigation labels, control labels, URLs, code listings, and required legal boilerplate are excluded from the sentence table; controls are assessed after it. No audited sentence exceeds 22 words. No banned marketing term, unexplained metaphor/mood heading, or inconsistent core term was found.

### Landing page

| Words | Sentence or heading |
| ---: | --- |
| 3 | Local comparison viewer |
| 9 | Find the state change that broke the second run. |
| 17 | For developers debugging repeat-run failures, it compares two state histories and names the first field that changed. |
| 8 | Loads two sample runs in a separate demo. |
| 8 | Run files stay in this tab by default. |
| 6 | Works offline after the first visit. |
| 8 | Free core tools · Studio costs $39 once. |
| 11 | The viewer compares two runs and marks the first changed field. |
| 3 | Compare two runs |
| 2 | Comparison viewer |
| 10 | Load a known-good run file and a failed run file. |
| 7 | Files stay in this tab by default. |
| 2 | Ready offline |
| 3 | Known-good run file |
| 4 | No run file loaded |
| 3 | Failed run file |
| 4 | No run file loaded |
| 4 | Awaiting two run files |
| 14 | Import JSON run files or load the example to see the first changed field. |
| 3 | Editable library playground |
| 8 | Change sample state and inspect the package output. |
| 3 | Edit the JSON. |
| 14 | The browser records two run files, exports and imports them, then compares them locally. |
| 13 | Change a value such as “line”, then pause briefly to update the output. |
| 2 | Package output |
| 3 | How it works |
| 7 | Capture only the state your bug changed. |
| 9 | Run files contain the state and events you declare. |
| 11 | Review JSON on another machine, and redact sensitive fields before recording. |
| 1 | Record |
| 7 | Wrap the point where durable state changes. |
| 9 | Set how many recent transitions each run file keeps. |
| 1 | Redact |
| 11 | Replace exact or wildcard paths before anything reaches the run file. |
| 1 | Compare |
| 11 | Align snapshots in order and stop at the first changed field. |
| 2 | Package contents |
| 8 | Six functions to record, replay, and compare state. |
| 13 | Build this source checkout with `npm pack` to create a local package tarball. |
| 2 | One-time purchase |
| 5 | Keep a local case history. |
| 11 | The open package records run files, and the viewer compares them. |
| 8 | Studio saves labels and history in this browser. |
| 6 | $39 one time · per user |
| 4 | Saved local comparison history |
| 3 | Named incident labels |
| 2 | License status |
| 2 | Studio locked |
| 7 | The free comparison viewer remains fully available. |
| 5 | Compare recorded state changes locally. |

The visible controls name their outcomes: **Try it with sample data**, **Read package setup**, **Choose JSON**, **Load two-run example**, **Compare runs**, **Compare example**, **Show redaction**, **Run replay**, **Copy code**, **Buy Studio in hosted checkout**, **Restore a license**, **Verify license**, **Save case**, **Reset demo**, and **Start for real**. The checkout button is F-3-1 because the named result cannot occur.

### README

| Words | Sentence |
| ---: | --- |
| 7 | Record state before and after application events. |
| 12 | Redact secrets, replay transitions, and find the first changed field between runs. |
| 13 | For application developers debugging a second run that fails after persisted state changes. |
| 14 | The browser viewer compares JSON run files locally and does not execute their contents. |
| 5 | Open `/demo` or add `?demo=1`. |
| 12 | It loads two report run files in the separate `demo:` browser-storage namespace. |
| 9 | The banner offers **Reset demo** and **Start for real**. |
| 9 | The sample identifies `$.report.chart` as the first changed field. |
| 16 | Build a local tarball from this checkout, then install that exact file in a fresh project. |
| 13 | The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations. |
| 14 | Configured fields are redacted before state, event, and metadata values enter a run file. |
| 6 | Inputs are cloned and never mutated. |
| 15 | Run files serialize as JSON, parse on another machine, and retain the same comparison result. |
| 16 | The viewer handles their text as data; it does not run scripts or make external changes. |
| 10 | Replay calls only the reducer supplied by your application process. |
| 14 | The public API exports `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus TypeScript types. |
| 8 | Run files use the versioned media marker `state-transition-capsule/v1`. |
| 18 | The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers. |
| 14 | Capsule Studio costs $39 once per user for local history and saved comparison labels. |
| 7 | The comparison viewer remains available without Studio. |
| 6 | Run files may contain sensitive data. |
| 11 | Prefer broad redaction rules and inspect exported JSON before sharing it. |
| 7 | Redaction replaces values; it is not encryption. |
| 12 | The viewer processes run files locally and does not upload their contents. |
| 17 | Standard and demo visits make no telemetry, API, or third-party runtime request unless you choose license verification. |
| 3 | Requires Node.js 20+. |
| 9 | `npm run build:site` writes the static deployment to `dist/site/`. |
| 3 | MIT. See [LICENSE](LICENSE). |

The landing and README claims map to the 20 manifest entries for recording, redaction, input immutability, comparison, JSON round trips, non-execution, replay, format/API support, retention, local/tab processing, offline use, demo isolation, Studio license behavior/price, tarball installation, Node version, and site build output. No additional unlisted copy claim was found. The checkout action itself is still broken as F-3-1.

## 3. Demo and sandbox behavior

- One click on **Try it with sample data** opened `/demo`.
- The first demo screen already showed a completed realistic comparison: event `chart.selected`, path `$.report.chart`, with `"bar"` changing to `"line"`.
- The persistent banner read **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start for real**.
- At 390 px, after scrolling to the bottom, the banner remained at `top: 0` through `bottom: 76`; both actions were visible and operable.
- After deliberately setting normal-storage key `real:marker` to `intact`, **Reset demo** left that marker unchanged. It left no `demo:` key behind.
- The live normal-to-demo flow made only same-origin GET requests for HTML and local assets. It made no console or page error.
- The `/demo` source and the editable playground use the shipped package functions. Editing the seeded JSON changes the local package output; Compare, Redaction, and Replay examples are present.

This passes the one-click realistic sample, banner, reset, isolated-storage, local-processing, and library-playground checks.

## 4. Claims verification

I made a fresh local clone at `/tmp/stc-review3-clone.sUQHsu`, ran `npm ci` (100 packages; 0 vulnerabilities), then invoked every command in `.factory/claims.json` exactly as declared. All 20 passed. `npm test`, `npm run typecheck`, and `npm run lint` also passed in that clone. The final Playwright result file reports `{"status":"passed","failedTests":[]}`.

| Claim id | Result |
| --- | --- |
| `first-divergence` | PASS |
| `demo-isolation` | PASS |
| `local-processing` | PASS |
| `offline-reload` | PASS |
| `redaction` | PASS |
| `pure-replay` | PASS |
| `bounded-retention` | PASS |
| `package-formats` | PASS |
| `site-build-output` | PASS |
| `license-restore` | PASS |
| `tab-local-storage` | PASS |
| `no-telemetry-runtime` | PASS |
| `studio-price` | PASS — displayed price and href only; see F-3-1 for the live destination failure |
| `recording` | PASS |
| `json-roundtrip` | PASS |
| `viewer-does-not-execute-capsules` | PASS |
| `public-api-surface` | PASS |
| `capsule-format-v1` | PASS |
| `local-tarball-install` | PASS |
| `node-20` | PASS |

No listed claim test failed. The F-3-1 checkout failure is a live link-integrity defect that the current claim test does not observe.

## 5. Earlier-review confirmation

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the prior handoff. Each earlier finding was rechecked against live behavior and current source/tests, rather than accepted from a status label.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | At 390 px the sticky demo banner, Reset demo, and Start for real remained visible while using the viewer. |
| F-1-2 | The live editable JSON playground updates package output and provides comparison, redaction, and replay examples. |
| F-1-3 | Landing and README provide the tested local-tarball flow, not an npm-registry install command. |
| F-1-4 | The broad “safe to inspect” statement is absent; copy directs users to review JSON and redact fields. |
| F-1-5 | `json-roundtrip` is registered and passed in a fresh browser-context import/comparison flow. |
| F-1-6 | `viewer-does-not-execute-capsules` is registered and passed with script-like payload text. |
| F-1-7 | `public-api-surface` passed for all six documented functions and declarations in ESM and CommonJS. |
| F-1-8 | `capsule-format-v1` is registered and passed for serialization, parsing, and rejection. |
| F-1-9 | Recording and JSON import/export are separately registered and passed. |
| F-1-10 | The former merchant-of-record statement is absent from landing, Privacy, and Terms. |
| F-1-11 | Current route source focuses the destination h1 and announces navigation; the browser suite passed forward/back tests. |
| F-1-12 | Raw live `/demo` has a route-specific title, canonical URL, Open Graph, and Twitter metadata. |
| F-1-13 | The live designed 404 has canonical, Open Graph, and Twitter metadata. |
| F-1-14 | The 390 px header visibly retains Demo, Viewer, API, and Privacy. |
| F-1-15 | The footer builder/version text remains visible at 390 px. |
| F-1-16 | README opening prose is short; its longest opening sentence is 14 words. |
| F-1-17 | Landing and README consistently use run file, failed run file, first changed field, and comparison viewer. |
| F-1-18 | Retention copy explains keeping recent transitions. |
| F-1-19 | The hero caption explains that the viewer marks the first changed field. |
| F-1-20 | The package section names six recording/replay/comparison functions. |
| F-1-21 | The landing gives a concrete free viewer versus $39 local-history split. |
| F-1-22 | Current controls use result-naming labels including Copy code and Save case. |
| F-2-1 | `site-build-output` is registered and passed; it builds the required deployment files under `dist/site/`. |
| F-2-2 | README no longer claims publishing readiness or a factory deployment workflow. |

None of the earlier finding IDs regressed. F-3-1 is newly observed through the required full link crawl.

## 6. Structure, routing, accessibility, privacy, and visual checks

- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, assets, `robots.txt`, and `sitemap.xml` returned 200. An unknown product URL returned the designed 404 with HTTP 404.
- GitHub source and README links returned 200. `mailto:` links are explicit email links. The hosted checkout link is the sole failed crawl target (F-3-1).
- Root, demo, Privacy, Terms, and 404 have `lang="en"`, one h1, one main landmark, a route-specific title, description, canonical URL, favicon, Apple touch icon, Open Graph, and Twitter metadata.
- Root title is **State Transition Capsule — Find the first changed field**. Demo, legal, and 404 routes use the required route-first pattern.
- Headers/footers are consistent, include Privacy and Terms, and the 404 offers **Return home**. Source uses h1 focus plus a polite route announcer for same-site navigation.
- The cold browser request log contained only same-origin GETs. The document CSP, HSTS, `nosniff`, referrer policy, permissions policy, and response-header `frame-ancestors 'none'` were present. There were no console errors on root or demo.
- The warm enamel, dark bench-console, stamped labels, self-hosted Bricolage Grotesque/IBM Plex Mono pair, original instrument artwork, and ruled diagnostic trace match `.factory/design.md`; this is a distinct instrument-panel system rather than a generic SaaS template.
- The full browser suite passed its desktop/mobile Axe coverage, keyboard controls, route focus, touch target, responsive layout, reduced-motion, privacy, and offline checks.

## 7. Missed-leverage check

The brief calls for local recording, redaction, retention, replay without effects, comparison, and export/import. The library playground and the comparison viewer cover those steps. Remote AI, sync, or an embedded provider key would not be an implied need for this deterministic local-first debugging tool. No decorative or unexplained AI feature was found.

## What would make this perfect

Make the visible Studio purchase CTA resolve to a real hosted checkout, add a live link-integrity test for it, then rerun this full review from a fresh clone. With F-3-1 resolved, this review found no other remaining gap.
