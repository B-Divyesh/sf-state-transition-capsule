# Product QA review 2 — State Transition Capsule

**Work order:** `state-transition-capsule-review-2`  
**Candidate:** `4ec229156543d22df0d744d32072eef8a1a1771e`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Reviewed:** 1 September 2026 UTC

## Verdict

**FAIL — 2 minor findings.**

The first-screen, demo, product behavior, route, accessibility, privacy, and visual checks pass. PASS requires no finding and no statement that a visitor can rely on without a matching claims-manifest entry. Two README deployment/package statements remain outside that manifest.

## Findings

### Minor

#### F-2-1 — The site-build output statement has no claims-manifest entry

- **Location and quote:** `README.md`, Develop, test, and deploy: **“`npm run build:site` writes the static deployment to `dist/site/`.”**
- **Check:** the clean-worktree build did create `dist/site/`, but no `.factory/claims.json` entry names this promise or provides its tagged command.
- **Why this matters:** a package maintainer can rely on this output location when preparing a deployment.
- **Concrete fix:** add a `site-build-output` claim with a tagged test that runs `npm run build:site` and confirms the expected site files in `dist/site/`; or change the README to a non-promissory instruction that is covered by an existing documented test.

#### F-2-2 — The README makes publishing-readiness statements without claim coverage

- **Location and quotes:** `README.md`, Install and Develop sections: **“Version 0.1.0 is ready to publish”**, **“`npm pack` # ready-to-publish tarball”**, and **“The factory deployment workflow publishes that directory.”**
- **Check:** `local-tarball-install` confirms that a built tarball installs and imports in a fresh project. It does not establish publication readiness or the factory workflow outcome. No manifest entry covers either statement.
- **Why this matters:** these statements describe an expected release and deployment result beyond the tested local install path.
- **Concrete fix:** retain only the verified wording, for example **“`npm pack` creates a local tarball that the included claim test installs in a fresh project.”** Remove the factory-workflow statement unless a permitted deployment check and claims entry can confirm it.

## 1. Cold first read

Fresh browser contexts at 390 × 844 and 1440 × 900 loaded the live root with `scrollY = 0`.

- **What it does:** “Find the state change that broke the second run.”
- **Who it is for:** developers debugging repeat-run failures.
- **What to click first:** **Try it with sample data**; the adjacent note says it loads two sample runs in a separate demo.

All three answers are visible before scrolling at both widths. The 390 px page width equals the viewport width, so no horizontal scrolling was observed.

## 2. Copy audit

Counts use whitespace-separated words. Code samples, URLs, navigation labels, controls, and required legal wording are excluded; headings and visible prose are included. No listed prose sentence exceeds 22 words. No jargon, marketing adjective, inconsistent result term, mood heading, or non-result-naming button was found in this audit.

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
| 3 | Local engine ready |
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
| 8 | Run files contain the state and events you declare. |
| 12 | Review JSON on another machine, and redact sensitive fields before recording. |
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
| 10 | The open package records run files, and the viewer compares them. |
| 9 | Studio saves labels and history in this browser. |
| 6 | $39 one time · per user. |
| 4 | Saved local comparison history |
| 3 | Named incident labels |
| 2 | License status |
| 2 | Studio locked |
| 7 | The free comparison viewer remains fully available. |
| 5 | Compare recorded state changes locally. |

Visible actions name their outcomes: **Try it with sample data**, **Read package setup**, **Choose JSON**, **Load two-run example**, **Compare runs**, **Compare example**, **Show redaction**, **Run replay**, **Copy code**, **Buy Studio in hosted checkout**, **Restore a license**, **Verify license**, **Save case**, **Reset demo**, and **Start for real**.

### README

| Words | Sentence |
| ---: | --- |
| 7 | Record state before and after application events. |
| 12 | Redact secrets, replay transitions, and find the first changed field between runs. |
| 13 | For application developers debugging a second run that fails after persisted state changes. |
| 14 | The browser viewer compares JSON run files locally and does not execute their contents. |
| 6 | Open `/demo` or add `?demo=1`. |
| 12 | It loads two report run files in the separate `demo:` browser-storage namespace. |
| 9 | The banner offers **Reset demo** and **Start for real**. |
| 8 | The sample identifies `$.report.chart` as the first changed field. |
| 15 | Version 0.1.0 is ready to publish but is not yet available from the npm registry. |
| 14 | Build a local tarball, then install that exact file in a fresh project. |
| 11 | The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations. |
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
| 9 | `npm run build:site` writes the static deployment to `dist/site/`. |
| 14 | The factory deployment workflow publishes that directory; this repository does not contain deployment credentials. |
| 2 | See [LICENSE](LICENSE). |

The two publishing statements are F-2-1 and F-2-2. The remaining observable product statements map to the manifest entries listed below.

## 3. Demo and storage checks

- One click on **Try it with sample data** opened `/demo`.
- The first demo screen already showed the completed realistic comparison: `chart.selected`, `$.report.chart`, and `"bar"` changing to `"line"`.
- The persistent notice read **“Demo — sample data, nothing is saved”** and showed **Reset demo** and **Start for real**.
- At 390 px, both controls remained visible after scrolling to the bottom of the page.
- Reset restored the sample comparison. Source and the `demo-isolation` claim confirm `demo:` keys are cleared without changing the normal-storage marker.
- Source confirms demo mode has a separate `demo:` namespace and does not read normal license, history, or saved-run keys.
- A fresh live normal-to-demo flow recorded only same-origin GET requests. No console or page error was recorded.

## 4. Claims check

`.factory/claims.json` contains 19 entries. In the clean worktree, `npm ci` completed with zero reported vulnerabilities. I invoked every listed command exactly as written; each selected test completed successfully. The full `npm test` suite also completed, followed by passing `npm run typecheck` and `npm run lint`.

| Claim | Result |
| --- | --- |
| `first-divergence` | PASS |
| `demo-isolation` | PASS |
| `local-processing` | PASS |
| `offline-reload` | PASS |
| `redaction` | PASS |
| `pure-replay` | PASS |
| `bounded-retention` | PASS |
| `package-formats` | PASS |
| `license-restore` | PASS |
| `tab-local-storage` | PASS |
| `no-telemetry-runtime` | PASS |
| `studio-price` | PASS |
| `recording` | PASS |
| `json-roundtrip` | PASS |
| `viewer-does-not-execute-capsules` | PASS |
| `public-api-surface` | PASS |
| `capsule-format-v1` | PASS |
| `local-tarball-install` | PASS |
| `node-20` | PASS |

The unlisted README statements are F-2-1 and F-2-2. No listed claim test failed.

## 5. Earlier-review confirmation

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the preceding handoff. Each earlier item was checked on the live page and in the source rather than accepted from its status label.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Demo notice, Reset, and Start for real remain visible on the 390 px workbench. |
| F-1-2 | Editable playground updates comparison output after JSON changes and has redaction and replay examples. |
| F-1-3 | README gives the tested local-tarball path and does not show a registry install command. |
| F-1-4 | The broad inspection statement was replaced with JSON review and redaction guidance. |
| F-1-5 | JSON round-trip is listed and its browser test passes. |
| F-1-6 | Viewer text-as-data behavior is listed and tested. |
| F-1-7 | All six documented functions and types are listed and tested in both formats. |
| F-1-8 | The v1 format marker is listed and tested. |
| F-1-9 | Recording and JSON import/export are now covered by separate claims. |
| F-1-10 | The removed commercial relationship statement is absent from landing, Privacy, and Terms. |
| F-1-11 | Same-site forward and back navigation move focus to the destination h1. |
| F-1-12 | Raw `/demo` has demo-specific title, description, canonical, OG, and Twitter metadata. |
| F-1-13 | The designed 404 has canonical, OG, and Twitter metadata. |
| F-1-14 | The 390 px header shows Demo, Viewer, API, and Privacy. |
| F-1-15 | The footer build line remains visible at 390 px. |
| F-1-16 | README opening sentences are 7, 12, 13, and 14 words. |
| F-1-17 | Visitor copy consistently uses run file, failed run file, first changed field, and comparison viewer. |
| F-1-18 | Retention copy says how many recent transitions each run file keeps. |
| F-1-19 | The image caption explains the comparison result. |
| F-1-20 | The API heading names the six functions' operations. |
| F-1-21 | The free and Studio responsibilities are concrete rather than broad. |
| F-1-22 | The active controls use Copy code and Save case. |

## 6. Structure, routes, accessibility, and visual checks

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200. An unknown path returned the designed 404 with status 404.
- Every page has `lang="en"`, one `<main>`, one h1, a route-specific title, a description, canonical URL, favicon, apple-touch icon, OG metadata, and Twitter metadata.
- The live title pattern is plain and route-specific: root is **State Transition Capsule — Find the first changed field**; demo is **Demo — State Transition Capsule**; legal and 404 routes follow the required route-first form.
- Every discovered same-origin product link returned 200, except the intentionally requested unknown route, which returned its designed 404. `mailto:` links were identified as explicit email links.
- The header and footer are consistent across routes and include Privacy and Terms. The 404 provides **Return home**.
- `/opt/fleet/lib/verify-url.sh` completed on root and demo with zero console errors, one h1, one main landmark, `lang=en`, and no image missing alt text.
- Axe checks at desktop and 390 px reported zero serious or critical items on root and demo.
- Keyboard coverage in the browser suite includes the skip link, Space to load the example, Enter to compare, visible focus, and route-heading focus.
- The warm enamel, charcoal diagnostic console, stamped labels, locally served display/data fonts, original instrument art, and ruled trace layout match `.factory/design.md`. The result is product-specific rather than a generic dashboard.

## 7. Missed-leverage check

The brief calls for local recording, redaction, replay, comparison, retention controls, and a local viewer. The editable playground covers the library-specific try-out path, and JSON import/export is present. A remote AI action or sync feature would not add a necessary step to this deterministic, local-first task. No embedded provider key or unexplained AI feature was found.

## What would make this perfect

Add claim coverage for the verified site-build output, and remove or test the publishing-readiness and factory-workflow statements. Then repeat this review with a clean worktree. With those two documentation promises resolved, the reviewed product has no other open QA finding.
