# Adversarial first-read review 5 — State Transition Capsule

**Work order:** `state-transition-capsule-review-5`  
**Candidate:** `830805fa84808786bbe9a3d3ebec55479cd65eab`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Reviewed:** 2 September 2026 UTC

## Verdict

**FAIL — 1 blocking finding.**

The cold first screen, one-click demo, sandbox boundary, all 20 declared claim
tests, live offline reload, routes, metadata, accessibility checks, request
privacy, and prior-finding repairs pass. The only documented installation path
for the unpublished npm library fails when copied from a normal GitHub clone.
PASS requires zero findings.

## Findings

### Blocking

#### F-5-1 — The README's copy-paste installation path does not exist

- **Location and exact quote:** `README.md`, **Install from this source
  checkout**, ends with
  **`npm install ../state-transition-capsule/state-transition-capsule-0.1.0.tgz`**.
- **Observed:** I cloned the repository into its normal GitHub directory name,
  `sf-state-transition-capsule`, and ran the entire documented block. `npm ci`,
  `npm run build`, `npm pack`, `mkdir`, and `npm init` succeeded. The final
  command failed with `ENOENT` for
  `/tmp/.../state-transition-capsule/state-transition-capsule-0.1.0.tgz`.
  The tarball was actually at
  `/tmp/.../sf-state-transition-capsule/state-transition-capsule-0.1.0.tgz`.
- **Why this blocks:** the package is not offered through an npm-registry
  install in this release, so this source-tarball procedure is the documented
  path from evaluation to real use. A first-time developer who follows it
  cannot install the library. The passing `local-tarball-install` claim uses an
  absolute temporary tarball path and does not execute the published snippet.
- **Concrete fix:** make the commands independent of the checkout directory.
  For example, create `../stc-consumer` first, run
  `npm pack --pack-destination ../stc-consumer`, enter that directory, and run
  `npm install ./state-transition-capsule-0.1.0.tgz`. Change the
  `@claim:local-tarball-install` regression to extract and execute the exact
  README block from a clean clone named `sf-state-transition-capsule`.

## 1. Cold first read

Fresh Chromium contexts opened the production root at 390 × 844 and
1440 × 900 with `scrollY = 0`.

- **What it does, in my words:** it compares two recorded application runs and
  identifies the first state field that changed.
- **For whom:** developers investigating a workflow that succeeds once and
  fails on a later run.
- **What I should click first:** **Try it with sample data**. The adjacent text
  says **“Loads two sample runs in a separate demo.”**

The exact first-screen copy that supplied those answers was **“Find the state
change that broke the second run.”** and **“For developers debugging repeat-run
failures, it compares two run files and names the first changed field.”** All
three facts and the primary action were visible before scrolling at both sizes.
The 390 px page had no horizontal overflow. This gate passes.

## 2. Copy audit

Counts use whitespace-separated tokens, matching the earlier reviews;
hyphenated terms and URLs count once. Code blocks are excluded. Navigation and
control labels are checked after the sentence tables. No sentence exceeds 22
words, no banned marketing adjective appears, and no heading relies on mood or
metaphor. F-5-1 is a functional defect in the install block, not a sentence
length defect.

### Landing page

| # | Words | Sentence, heading, or meaningful state | Result |
| ---: | ---: | --- | --- |
| L1 | 3 | Local comparison viewer | Pass |
| L2 | 9 | Find the state change that broke the second run. | Pass |
| L3 | 16 | For developers debugging repeat-run failures, it compares two run files and names the first changed field. | Pass |
| L4 | 8 | Loads two sample runs in a separate demo. | Pass |
| L5 | 6 | Run files stay in this tab | Pass; `tab-local-storage` |
| L6 | 6 | Works offline after the first visit | Pass; `offline-reload` |
| L7 | 6 | Free viewer · no account required | Pass; `registration-unavailable` |
| L8 | 11 | The viewer compares two runs and marks the first changed field. | Pass; `first-divergence` |
| L9 | 3 | Compare two runs | Pass |
| L10 | 2 | Comparison viewer | Pass |
| L11 | 10 | Load a known-good run file and a failed run file. | Pass |
| L12 | 7 | Files stay in this tab by default. | Pass; `tab-local-storage` |
| L13 | 3 | Local engine ready | Pass |
| L14 | 3 | Known-good run file | Pass |
| L15 | 4 | No run file loaded | Pass |
| L16 | 3 | Failed run file | Pass |
| L17 | 4 | No run file loaded | Pass |
| L18 | 4 | Awaiting two run files | Pass |
| L19 | 14 | Import JSON run files or load the example to see the first changed field. | Pass |
| L20 | 3 | Editable library playground | Pass |
| L21 | 8 | Change sample state and inspect the package output. | Pass |
| L22 | 3 | Edit the JSON. | Pass |
| L23 | 14 | The browser records two run files, exports and imports them, then compares them locally. | Pass; `recording`, `json-roundtrip`, `local-processing` |
| L24 | 13 | Change a value such as “line”, then pause briefly to update the output. | Pass |
| L25 | 2 | Package output | Pass |
| L26 | 6 | Comparison result updated from the package. | Pass |
| L27 | 3 | How it works | Pass |
| L28 | 7 | Capture only the state your bug changed. | Pass |
| L29 | 9 | Run files contain the state and events you declare. | Pass; `recording` |
| L30 | 11 | Review JSON on another machine, and redact sensitive fields before recording. | Pass; `json-roundtrip`, `redaction` |
| L31 | 1 | Record | Pass |
| L32 | 7 | Wrap the point where durable state changes. | Pass |
| L33 | 9 | Set how many recent transitions each run file keeps. | Pass; `bounded-retention` |
| L34 | 1 | Redact | Pass |
| L35 | 11 | Replace exact or wildcard paths before anything reaches the run file. | Pass; `redaction` |
| L36 | 1 | Compare | Pass |
| L37 | 11 | Align snapshots in order and stop at the first changed field. | Pass; `first-divergence` |
| L38 | 2 | Package contents | Pass |
| L39 | 8 | Six functions to record, replay, and compare state. | Pass; `public-api-surface` |
| L40 | 13 | Build this source checkout with `npm pack` to create a local package tarball. | Pass as a sentence; see F-5-1 for the install procedure |
| L41 | 2 | Free release | Pass |
| L42 | 5 | Compare runs without an account. | Pass; `registration-unavailable` |
| L43 | 13 | The open package records run files, and the browser viewer compares them locally. | Pass; `recording`, `local-processing` |
| L44 | 2 | No sign-up | Pass; `registration-unavailable` |
| L45 | 3 | No payment step | Pass; `registration-unavailable` |
| L46 | 4 | No run file upload | Pass; `local-processing` |
| L47 | 2 | Studio status | Pass |
| L48 | 2 | Registration unavailable | Pass; `registration-unavailable` |
| L49 | 9 | New Studio licenses are not offered in this release. | Pass; `registration-unavailable` |
| L50 | 5 | No checkout link is shown. | Pass; `registration-unavailable` |
| L51 | 5 | Compare recorded state changes locally. | Pass; `local-processing` |
| L52 | 6 | Built by Param Factory · v0.1.0 | Pass |

Runtime states were also checked. **“[name] loaded as the known-good/failed run
file”** is 7 words plus the name. The three import failures are 15, 17, and 10
words and each gives a next action. **“The runs start from different states”**
is 7 words. **“Changed fields in the first transition that differs between
runs”** is 10 words. These repairs remain present in the live accessibility
tree and source.

### README

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| R1 | 7 | Record state before and after application events. | Pass |
| R2 | 12 | Redact secrets, replay transitions, and find the first changed field between runs. | Pass |
| R3 | 13 | For application developers debugging a second run that fails after persisted state changes. | Pass |
| R4 | 14 | The browser viewer compares JSON run files locally and does not execute their contents. | Pass; `local-processing`, `viewer-does-not-execute-capsules` |
| R5 | 7 | Live viewer: [URL] · isolated sample: [URL] | Pass |
| R6 | 5 | Open `/demo` or add `?demo=1`. | Pass |
| R7 | 13 | It loads two report run files in memory and does not save them. | Pass; `demo-isolation` |
| R8 | 9 | The banner offers **Reset demo** and **Start for real**. | Pass |
| R9 | 9 | The sample identifies `$.report.chart` as the first changed field. | Pass; `first-divergence` |
| R10 | 16 | Build a local tarball from this checkout, then install that exact file in a fresh project. | **F-5-1** |
| R11 | 13 | The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations. | Pass; `package-formats` |
| R12 | 14 | Configured fields are redacted before state, event, and metadata values enter a run file. | Pass; `redaction` |
| R13 | 6 | Inputs are cloned and never mutated. | Pass; the `redaction` sandbox asserts the source input is unchanged |
| R14 | 15 | Run files serialize as JSON, parse on another machine, and retain the same comparison result. | Pass; `json-roundtrip` |
| R15 | 16 | The viewer handles their text as data; it does not run scripts or make external changes. | Pass; `viewer-does-not-execute-capsules` |
| R16 | 10 | Replay calls only the reducer supplied by your application process. | Pass; `pure-replay` |
| R17 | 14 | The public API exports `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus TypeScript types. | Pass; `public-api-surface` |
| R18 | 8 | Run files use the versioned media marker `state-transition-capsule/v1`. | Pass; `capsule-format-v1` |
| R19 | 18 | The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers. | Pass; corresponding individual claims |
| R20 | 9 | This release offers no Studio registration or checkout link. | Pass; `registration-unavailable` |
| R21 | 7 | The browser viewer works without an account. | Pass; `registration-unavailable` |
| R22 | 6 | Run files may contain sensitive data. | Useful warning |
| R23 | 11 | Prefer broad redaction rules and inspect exported JSON before sharing it. | Useful instruction |
| R24 | 7 | Redaction replaces values; it is not encryption. | Useful limitation |
| R25 | 12 | The viewer processes run files locally and does not upload their contents. | Pass; `local-processing` |
| R26 | 12 | Standard and demo visits make no telemetry, API, or third-party runtime request. | Pass; `no-telemetry-runtime` |
| R27 | 8 | The viewer works offline after the first visit. | Pass; `offline-reload` |
| R28 | 7 | Read the site Privacy policy and Terms. | Pass; both links return 200 |
| R29 | 3 | Requires Node.js 20+. | Pass; `node-20` |
| R30 | 9 | `npm run build:site` writes the static deployment to `dist/site/`. | Pass; `site-build-output` |
| R31 | 1 | MIT. | Pass |
| R32 | 2 | See [LICENSE](LICENSE). | Pass |

README headings are direct labels: **Try the sample**, **Install from this
source checkout**, **Record a run file**, **Compare two run files**, **Replay a
reducer**, **Format and API**, **Privacy**, **Develop, test, and deploy**, and
**License**. No heading needs surrounding brand lore to make sense.

Visible actions are **Try it with sample data**, **Read package setup**,
**Choose JSON**, **Load two-run example**, **Compare runs/again**, **Compare
example**, **Show redaction**, **Run replay**, **Copy code**, **Reset demo**,
**Start for real**, and **Return home**. Each starts with a result-naming verb;
navigation items are destination labels.

The terminology remains consistent: JSON artifact → **run file**; successful
input → **known-good run file**; later failure input → **failed run file**;
earliest unequal result → **first changed field**; browser interface →
**comparison viewer**; isolated sample → **demo**.

## 3. Demo and sandbox behavior

- One click on **Try it with sample data** opened `/demo`.
- The first view contained the populated **Quarterly report / known good** and
  **Quarterly report / second run** inputs. Desktop also showed the completed
  result immediately: event `chart.selected`, path `$.report.chart`, and
  `"bar"` → `"line"`. Mobile showed the populated comparison viewer and
  **Compare again**, with the result directly below.
- The sticky notice read **“Demo — sample data, nothing is saved”** and kept
  **Reset demo** and **Start for real** visible at the bottom of the 390 px
  page (`top: 0`, `bottom: 75.56`).
- A seeded normal key `real:review5 = intact` survived entry, Reset, and exit.
  A seeded `demo:` local key and `demo:` session key were removed. Fresh live
  checks found no local-storage keys, session-storage keys, or IndexedDB
  databases before or after Reset.
- Reset restored both sample inputs and the same result. Start for real
  returned to `/`, hid the banner, and left normal storage intact.
- The editable playground changed package output from edited JSON. Compare,
  Redaction, and Replay examples call the shipped package functions.
- The full live flow made only same-origin GET requests. It made no API,
  telemetry, or third-party request and produced no console or page error.
- After service-worker control, a fresh live `/demo` context went offline and
  reloaded with the banner and `$.report.chart` result still present.

The demo and sandbox gates pass.

## 4. Claims verification

I cloned candidate `830805fa` into
`/tmp/stc-review5.GkQqsn/clone`, ran `npm ci`, and invoked every command in
`.factory/claims.json` exactly as declared.

| Claim | Exact command | Result |
| --- | --- | --- |
| `first-divergence` | `npm run test:e2e -- --grep @claim:first-divergence` | PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| `local-processing` | `npm run test:e2e -- --grep @claim:local-processing` | PASS |
| `offline-reload` | `npm run build && npm run test:e2e:production -- --grep @claim:offline-reload` | PASS |
| `redaction` | `npm run test:unit -- --testNamePattern @claim:redaction` | PASS |
| `pure-replay` | `npm run test:unit -- --testNamePattern @claim:pure-replay` | PASS |
| `bounded-retention` | `npm run test:unit -- --testNamePattern @claim:bounded-retention` | PASS |
| `package-formats` | `npm run build && npm run test:artifacts -- --testNamePattern @claim:package-formats` | PASS |
| `site-build-output` | `npm run test:artifacts -- --testNamePattern @claim:site-build-output` | PASS |
| `tab-local-storage` | `npm run test:e2e -- --grep @claim:tab-local-storage` | PASS |
| `no-telemetry-runtime` | `npm run test:e2e -- --grep @claim:no-telemetry-runtime` | PASS |
| `registration-unavailable` | `npm run test:e2e -- --grep @claim:registration-unavailable` | PASS |
| `recording` | `npm run test:unit -- --testNamePattern @claim:recording` | PASS |
| `json-roundtrip` | `npm run test:e2e -- --grep @claim:json-roundtrip` | PASS |
| `viewer-does-not-execute-capsules` | `npm run test:e2e -- --grep @claim:viewer-does-not-execute-capsules` | PASS |
| `public-api-surface` | `npm run build && npm run test:artifacts -- --testNamePattern @claim:public-api-surface` | PASS |
| `capsule-format-v1` | `npm run test:unit -- --testNamePattern @claim:capsule-format-v1` | PASS |
| `local-tarball-install` | `npm run build && npm run test:artifacts -- --testNamePattern @claim:local-tarball-install` | PASS, but does not execute the README path; see F-5-1 |
| `node-20` | `npm run test:artifacts -- --testNamePattern @claim:node-20` | PASS |
| `file-size-limit` | `npm run test:e2e -- --grep @claim:file-size-limit` | PASS |

No declared test failed. No claim-like sentence on the landing page, README,
Privacy, or Terms lacks behavioral coverage in the manifest. F-5-1 is a gap
between the listed local-install claim and the different path shown to readers.

The complete clean-clone `npm test` also passed: 14 unit/manifest tests, 11
artifact tests, 54 browser tests with two expected development skips, and two
production-offline tests. `npm run typecheck` and `npm run lint` passed.

## 5. Earlier-finding verification

Every prior `review-*.md`, `polish-*.md`, and the preceding handoff was read.
The current production HTML, JavaScript, CSS, and original assets checked below
match the clean candidate build byte for byte. Earlier status labels were not
used as evidence.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the demo disclosure and both controls remain sticky and operable at 390 px. |
| F-1-2 | Fixed: the editable playground runs comparison, redaction, and replay and updates from edited JSON. |
| F-1-3 | Fixed as originally scoped: the unverified registry command is absent. F-5-1 is a new defect in the replacement tarball path. |
| F-1-4 | Fixed: the broad “safe to inspect” claim is absent; copy gives scoped JSON review and redaction guidance. |
| F-1-5 | Fixed: `json-roundtrip` is listed and passed in a fresh browser context. |
| F-1-6 | Fixed: hostile run-file strings are handled as data under a passing browser claim. |
| F-1-7 | Fixed: all six documented functions and declarations load in ESM and CommonJS. |
| F-1-8 | Fixed: the v1 marker is listed and tested for acceptance and rejection. |
| F-1-9 | Fixed: recording and JSON transfer have separate passing claims. |
| F-1-10 | Fixed: merchant-of-record copy remains absent. |
| F-1-11 | Fixed: live forward and back navigation focus the destination h1 and update the polite announcement. |
| F-1-12 | Fixed: raw live `/demo` has route-specific title, description, canonical, Open Graph, and Twitter fields. |
| F-1-13 | Fixed: the designed 404 has complete route metadata and an action home. |
| F-1-14 | Fixed: Demo, Viewer, API, and Privacy remain visible at 390 px. |
| F-1-15 | Fixed: **Built by Param Factory · v0.1.0** remains visible in the mobile footer. |
| F-1-16 | Fixed: README opening sentences are 7, 12, 13, and 14 words. |
| F-1-17 | Fixed after the review-4 regression: live and source text use run file and “first transition that differs”; `bay`, `capsule`, and `divergent` are absent from viewer copy. |
| F-1-18 | Fixed: retention copy says how many recent transitions each run file keeps. |
| F-1-19 | Fixed: the hero caption explains that the viewer marks the first changed field. |
| F-1-20 | Fixed: the package heading names recording, replay, and comparison. |
| F-1-21 | Fixed: the page states the available free release and unavailable Studio registration without a broad completeness claim. |
| F-1-22 | Fixed: **Copy code** is explicit and the obsolete paid Save action is absent. |
| F-2-1 | Fixed: `site-build-output` is listed and its production artifact test passes. |
| F-2-2 | Fixed: publishing-readiness and factory-deployment promises remain absent. |
| F-3-1 | Fixed: no checkout CTA or billing request exists; the live crawl found zero checkout links. |
| F-4-1 | Fixed: README now says the sample stays in memory, matching live storage and source behavior. |
| F-4-2 | Fixed: malformed, incomplete, and unreadable-file errors are short and state the next action. |
| F-4-3 | Fixed: the initial-state heading reads **“The runs start from different states.”** |

The polish-2 contrast control remains fixed: the mobile primary action measured
above 4.5:1 in every tested interaction state. The polish-3 operator-gated
commerce control remains fixed: live traffic contains no billing request.

## 6. Structure, routing, accessibility, and identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200. A new
  unknown path returned the designed 404 with HTTP 404 and **Return home**.
- Each route has `lang="en"`, one h1, one main landmark, a route-specific title
  within 60 characters, a description, canonical URL, Open Graph and Twitter
  metadata, SVG favicon, and 180 px Apple touch icon. `robots.txt` references a
  sitemap containing the four public routes.
- Root title is **State Transition Capsule — Find the first changed field**.
  Demo, Privacy, Terms, and the 404 use route-first titles.
- The header and footer are consistent on all routes and retain Privacy,
  Terms, Param Factory credit, and version. The live crawler checked five
  routes and 12 unique links, found no checkout link, and confirmed the GitHub
  source destination returns 200.
- Forward root → Privacy and browser Back both focused the destination h1 and
  updated the polite live region. Direct deep links retained their route.
- `verify-url.sh` passed the live root and demo with zero console errors, one
  h1, one main, `lang=en`, no missing alt text, and no unlabeled button.
- The clean browser suite's desktop/mobile Axe scans, keyboard checks, 44 px
  targets, exact CTA contrast, reduced motion, and overflow checks passed.
- Response headers contain a self-only CSP with header-only
  `frame-ancestors`, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, and
  frame denial. The first-load application module is 17.82 kB raw / 6.47 kB
  gzip, below the static-product limit.
- The warm enamel palette, charcoal comparison console, stamped labels,
  locally served Bricolage/Plex pairing, ruled trace, and original diagnostic
  instrument artwork match `.factory/design.md`. The result is distinguishable
  from a centered gradient/card SaaS template.

## 7. Missed leverage

No additional feature finding is warranted. The brief's recording, field
redaction, retention, JSON export/import, supplied-reducer replay, and first
changed-field comparison are present in the package and editable playground.
Sync would conflict with the explicit local evidence boundary. An AI step
would add nondeterminism to an exact replay/comparison task, and no decorative
AI feature or provider key is present.

## What would make this perfect

Replace the checkout-directory-dependent tarball path with a copy-paste block
that works from the normal repository name, and make the local-install claim
execute that exact README block. Then rerun all 20 claims and this complete
checklist. No other finding remains from this review.
