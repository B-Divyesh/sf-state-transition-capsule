# Adversarial first-read review 4 — State Transition Capsule

**Work order:** `state-transition-capsule-review-4`

**Candidate:** `a0313f0a92dd2f0862244288a56de78f80dcdd0b`

**Live URL:** <https://state-transition-capsule.sociobot.in/>

**Reviewed:** 2 September 2026 UTC

## Verdict

**FAIL — 4 findings (1 blocking, 1 high, 1 medium, 1 minor).**

The first screen, one-click demo, isolation behavior, listed claim tests, routes, accessibility checks, privacy request log, offline reload, and visual identity pass. PASS still requires zero findings. Runtime copy regresses an earlier terminology finding, the README describes a storage mechanism the demo does not use, import errors omit a recovery action, and one comparison state contains a grammar error.

## Findings

### Blocking

#### F-1-17 — Runtime copy regresses the required run-file terminology

- **Earlier finding:** review 1 required one vocabulary: **run file**, **failed run file**, **first changed field**, and **comparison viewer**. The repair records say this was fixed everywhere in visitor copy.
- **Current locations and exact quotes:** `site/src/main.ts:119`, **“[name] loaded into the known-good run file bay.”**; `site/src/main.ts:193`, screen-reader table caption **“State differences at the first divergent transition”**.
- **Live check:** importing a file exposes the “run file bay” message. The completed live demo exposes the “divergent transition” caption in the accessibility tree.
- **Why this blocks:** “bay” is an instrument-panel metaphor rather than the established input term, and “divergent transition” reintroduces the jargon that the earlier finding replaced. A first-time user must map these terms back to the two run files and first changed field. The work order requires any unfixed or regressed earlier finding to remain blocking under its original id.
- **Concrete fix:** use **“[name] loaded as the known-good run file.”** (or **failed run file**) and **“Changed fields in the first transition that differs between runs.”** Add both runtime strings to the copy audit and a browser assertion that rejects `bay`, `capsule`, and `divergent` in user-facing viewer text.

### High

#### F-4-1 — The README says demo files use storage that the implementation never uses

- **Location and exact quote:** `README.md`, Try the sample: **“It loads two report run files in the separate `demo:` browser-storage namespace.”**
- **Check:** `site/src/main.ts:19-20` keeps both samples in module variables. `loadSampleRuns()` assigns those variables, while `clearDemoStorage()` only removes any pre-existing `demo:` local-storage keys. The live demo and Reset left no `demo:` key because sample files were never stored there. `.factory/demo.md` correctly says the current sample needs no persistence.
- **Why this misleads:** a developer assessing the privacy boundary is told a specific storage mechanism that is not used. The `demo-isolation` test proves normal data remains untouched; it does not prove that sample run files are loaded into `demo:` storage.
- **Concrete fix:** rewrite the sentence as **“It loads two report run files in memory and does not save them.”** Update `demo-isolation` so its assertions confirm that sample run data never enters local storage, session storage, or IndexedDB during entry, Reset, and exit.

### Medium

#### F-4-2 — Import errors do not give the required next action

- **Location and exact quotes:** live comparison viewer after malformed imports; `site/src/main.ts:130-131` displays **“broken.json: The selected file is not valid JSON.”** and **“wrong.json: Invalid capsule: format must be state-transition-capsule/v1; id must be a non-empty string; name must be a non-empty string; createdAt must be an ISO date string; metadata must be an object; redactions must be an array of paths; retention policy is invalid; initial snapshot is missing; transitions must be an array.”**
- **Check:** the first error has no recovery action. The second is 51 words, exposes the retired “capsule” term, and has no recovery action. The fallback **“The file could not be read.”** also gives neither a reason nor a next step.
- **Why this loses users:** a first-time user knows the file failed but is not told how to produce an accepted run file. The long schema dump is difficult to scan on a phone and exceeds the 22-word hard cap.
- **Concrete fix:** show a short summary plus optional technical details. For malformed JSON: **“broken.json is not valid JSON. Export the run file again, then choose the new file.”** For a wrong schema: **“wrong.json is missing the run-file format and required fields. Export it again, then choose the new file.”** Add browser tests for the action text and the 22-word cap.

### Minor

#### F-4-3 — The initial-state result is grammatically incorrect

- **Location and exact quote:** `site/src/main.ts:179`, shown when two imports differ before their first transition: **“The runs start from different state.”**
- **Why this matters:** the sentence is visible as the main result heading and reads as unfinished English.
- **Concrete fix:** use **“The runs start from different states.”** Add this result state to the copy audit and browser coverage.

## 1. Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900 with `scrollY = 0`.

- **What it does, in my words:** it compares two recorded application runs and identifies the first state field that changed.
- **For whom:** developers investigating a workflow that works once and fails on a later run.
- **What I should click first:** **Try it with sample data**; the adjacent line says it loads two sample runs in a separate demo.

All three answers and the three fact lines were visible before scrolling at both widths. The mobile page had zero horizontal overflow. This gate passes.

## 2. Copy audit

Counts are whitespace-separated words; hyphenated terms, code identifiers, and URLs count as one word. Code blocks are excluded. Static landing and README sentences are complete below; controls and runtime states follow separately.

### Landing page static copy

| # | Words | Sentence or heading | Result |
| ---: | ---: | --- | --- |
| L1 | 3 | Local comparison viewer | Pass |
| L2 | 9 | Find the state change that broke the second run. | Pass |
| L3 | 16 | For developers debugging repeat-run failures, it compares two run files and names the first changed field. | Pass |
| L4 | 8 | Loads two sample runs in a separate demo. | Pass |
| L5 | 6 | Run files stay in this tab | Pass |
| L6 | 6 | Works offline after the first visit | Pass; `offline-reload` |
| L7 | 6 | Free viewer · no account required | Pass; `registration-unavailable` |
| L8 | 11 | The viewer compares two runs and marks the first changed field. | Pass |
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
| L23 | 14 | The browser records two run files, exports and imports them, then compares them locally. | Pass |
| L24 | 13 | Change a value such as “line”, then pause briefly to update the output. | Pass |
| L25 | 2 | Package output | Pass |
| L26 | 3 | How it works | Pass |
| L27 | 7 | Capture only the state your bug changed. | Pass |
| L28 | 9 | Run files contain the state and events you declare. | Pass |
| L29 | 11 | Review JSON on another machine, and redact sensitive fields before recording. | Pass |
| L30 | 1 | Record | Pass |
| L31 | 7 | Wrap the point where durable state changes. | Pass |
| L32 | 9 | Set how many recent transitions each run file keeps. | Pass |
| L33 | 1 | Redact | Pass |
| L34 | 11 | Replace exact or wildcard paths before anything reaches the run file. | Pass |
| L35 | 1 | Compare | Pass |
| L36 | 11 | Align snapshots in order and stop at the first changed field. | Pass |
| L37 | 2 | Package contents | Pass |
| L38 | 8 | Six functions to record, replay, and compare state. | Pass |
| L39 | 13 | Build this source checkout with `npm pack` to create a local package tarball. | Pass |
| L40 | 2 | Free release | Pass |
| L41 | 5 | Compare runs without an account. | Pass |
| L42 | 13 | The open package records run files, and the browser viewer compares them locally. | Pass |
| L43 | 2 | No sign-up | Pass |
| L44 | 3 | No payment step | Pass |
| L45 | 4 | No run file upload | Pass |
| L46 | 2 | Studio status | Pass |
| L47 | 2 | Registration unavailable | Pass |
| L48 | 9 | New Studio licenses are not offered in this release. | Pass |
| L49 | 5 | No checkout link is shown. | Pass |
| L50 | 5 | Compare recorded state changes locally. | Pass |
| L51 | 6 | Built by Param Factory · v0.1.0 | Pass |

### Runtime and error copy

| Words | Sentence or state | Result |
| ---: | --- | --- |
| 7 + name | [name] loaded into the known-good/failed run file bay. | F-1-17 |
| 10 | [file] is larger than the 5 MB local safety limit. | Pass |
| 5 | Reduce retention and export again. | Pass |
| 8 | [file]: The selected file is not valid JSON. | F-4-2 |
| 51 | [file]: Invalid capsule: format must be … transitions must be an array. | F-4-2 |
| 6 | The file could not be read. | F-4-2 |
| 4 | These retained states match. | Pass |
| 3 | [number] transitions compared. | Pass |
| 7 | The runs start from different state. | F-4-3 |
| 4 + event | State changed after “[event]”. | Pass |
| 7 | State differences at the first divergent transition | F-1-17 |
| 4 | Reading retained snapshots locally… | Pass |
| 2 | Comparison complete. | Pass |
| 4 | No changed field found. | Pass |
| 4 | Copy was blocked. | Pass |
| 4 | Select the command manually. | Pass |
| 6 | [Example] result updated from the package. | Pass |
| 6 | Check the JSON and try again. | Pass |
| 3 | Example runs loaded. | Pass |
| 8 | Compare them to locate the first changed field. | Pass |
| 7 | Demo — sample data, nothing is saved | Pass |

### README sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| R1 | 7 | Record state before and after application events. | Pass |
| R2 | 12 | Redact secrets, replay transitions, and find the first changed field between runs. | Pass |
| R3 | 13 | For application developers debugging a second run that fails after persisted state changes. | Pass |
| R4 | 14 | The browser viewer compares JSON run files locally and does not execute their contents. | Pass |
| R5 | 7 | Live viewer: [URL] · isolated sample: [URL] | Pass |
| R6 | 5 | Open `/demo` or add `?demo=1`. | Pass |
| R7 | 12 | It loads two report run files in the separate `demo:` browser-storage namespace. | F-4-1 |
| R8 | 9 | The banner offers **Reset demo** and **Start for real**. | Pass |
| R9 | 9 | The sample identifies `$.report.chart` as the first changed field. | Pass |
| R10 | 16 | Build a local tarball from this checkout, then install that exact file in a fresh project. | Pass |
| R11 | 13 | The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations. | Pass |
| R12 | 14 | Configured fields are redacted before state, event, and metadata values enter a run file. | Pass |
| R13 | 6 | Inputs are cloned and never mutated. | Pass |
| R14 | 15 | Run files serialize as JSON, parse on another machine, and retain the same comparison result. | Pass |
| R15 | 16 | The viewer handles their text as data; it does not run scripts or make external changes. | Pass |
| R16 | 10 | Replay calls only the reducer supplied by your application process. | Pass |
| R17 | 14 | The public API exports `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus TypeScript types. | Pass |
| R18 | 8 | Run files use the versioned media marker `state-transition-capsule/v1`. | Pass |
| R19 | 18 | The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers. | Pass |
| R20 | 9 | This release offers no Studio registration or checkout link. | Pass |
| R21 | 7 | The browser viewer works without an account. | Pass |
| R22 | 6 | Run files may contain sensitive data. | Pass |
| R23 | 11 | Prefer broad redaction rules and inspect exported JSON before sharing it. | Pass |
| R24 | 7 | Redaction replaces values; it is not encryption. | Pass |
| R25 | 12 | The viewer processes run files locally and does not upload their contents. | Pass |
| R26 | 12 | Standard and demo visits make no telemetry, API, or third-party runtime request. | Pass |
| R27 | 8 | The viewer works offline after the first visit. | Pass |
| R28 | 7 | Read the site Privacy policy and Terms. | Pass |
| R29 | 3 | Requires Node.js 20+. | Pass |
| R30 | 9 | `npm run build:site` writes the static deployment to `dist/site/`. | Pass |
| R31 | 1 | MIT. | Pass |
| R32 | 2 | See [LICENSE](LICENSE). | Pass |

No static landing or README sentence exceeds 22 words. No banned marketing adjective appears. Section headings name their content. The terminology and error-state exceptions are the findings above.

Visible actions were also checked: **Try it with sample data**, **Read package setup**, **Choose JSON**, **Load two-run example**, **Compare runs/again**, **Compare example**, **Show redaction**, **Run replay**, **Copy code**, **Reset demo**, **Start for real**, and **Return home** name their action or result. Navigation labels are destinations rather than commands.

Terminology should remain: JSON artifact → **run file**; successful input → **known-good run file**; later failure input → **failed run file**; earliest unequal field → **first changed field**; browser interface → **comparison viewer**; isolated sample → **demo**. F-1-17 identifies runtime exceptions.

## 3. Demo and sandbox

- One click from the cold root opened `/demo`.
- After the route settled, the page was already scrolled to the populated comparison viewer. At 390 px it showed both realistic report run files; at desktop it also showed `chart.selected`, `$.report.chart`, and `"bar"` → `"line"` in the first viewport.
- The sticky notice read **“Demo — sample data, nothing is saved”**. At the bottom of the 390 px page its bounds remained `top: 0`, `bottom: 75.56`; Reset and Start for real remained visible.
- Reset recreated the completed comparison. A seeded normal key `real:review4 = intact` remained intact, and a seeded `demo:review4` key was removed.
- Start for real returned to `/`, removed demo-prefixed keys, retained the normal marker, hid the banner, and showed two empty run-file inputs.
- Editing `"line"` to `"area"` updated the playground output. The existing browser suite also confirmed the Redaction and Replay examples.
- The complete live flow recorded 91 requests: zero off-origin and zero non-GET. No normal or demo flow emitted a telemetry/API request.

Demo behavior passes. F-4-1 concerns inaccurate README wording about where the in-memory sample resides, not leakage into real data.

## 4. Claims gate

I cloned the candidate into `/tmp/stc-review4.0ki0HV/clone`, ran `npm ci` with zero vulnerabilities, and invoked every manifest command exactly as written.

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
| `local-tarball-install` | `npm run build && npm run test:artifacts -- --testNamePattern @claim:local-tarball-install` | PASS |
| `node-20` | `npm run test:artifacts -- --testNamePattern @claim:node-20` | PASS |
| `file-size-limit` | `npm run test:e2e -- --grep @claim:file-size-limit` | PASS |

No listed claim test failed. F-4-1 is the remaining wording-to-implementation mismatch: the related isolation claim passes, but its test does not establish the README's stated storage mechanism.

## 5. Offline, privacy, and storage evidence

- A fresh live context installed and gained control from the service worker, went offline, reloaded `/demo`, and retained the complete `$.report.chart` result.
- The live demo request log contained only same-origin GET navigation and static-asset requests.
- Reset and exit preserved the seeded normal marker and cleared demo-prefixed local storage. The two sample run files remained in page memory only.
- CSP is delivered as a response header and limits scripts, styles, fonts, connections, and workers to self; `frame-ancestors 'none'` is header-only. HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, and `X-Frame-Options: DENY` are present.

## 6. Earlier finding verification

Every prior review, polish record, and the prior handoff was read. Each finding was checked in current source and on the live deployment.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the mobile demo notice and both controls remain sticky throughout the viewer. |
| F-1-2 | Fixed: the editable playground runs comparison, redaction, and replay and updates output after edits. |
| F-1-3 | Fixed: registry-install copy is absent; the tested local-tarball flow remains. |
| F-1-4 | Fixed: “safe to inspect” is absent; copy gives scoped review/redaction guidance. |
| F-1-5 | Fixed: `json-roundtrip` is listed and passed. |
| F-1-6 | Fixed: hostile run-file text is covered by the listed non-execution claim. |
| F-1-7 | Fixed: the six-function/type surface passed ESM, CommonJS, and declaration checks. |
| F-1-8 | Fixed: the v1 marker is listed and tested for acceptance and rejection. |
| F-1-9 | Fixed: recording and JSON round-trip behavior have separate passing claims. |
| F-1-10 | Fixed: merchant-of-record copy is absent. |
| F-1-11 | Fixed: live root → Privacy → Back focused each destination h1 and announced the route. |
| F-1-12 | Fixed: raw `/demo` has route-specific title, description, canonical, OG, and Twitter metadata. |
| F-1-13 | Fixed: the designed 404 has canonical and social metadata. |
| F-1-14 | Fixed: Demo, Viewer, API, and Privacy remain visible at 390 px. |
| F-1-15 | Fixed: **Built by Param Factory · v0.1.0** remains visible at 390 px. |
| F-1-16 | Fixed: README opening sentences are 7, 12, 13, and 14 words. |
| F-1-17 | **Regressed/blocking:** “run file bay” and “divergent transition” remain in runtime copy. |
| F-1-18 | Fixed: retention copy states that each run file keeps recent transitions. |
| F-1-19 | Fixed: the image caption explains that the viewer marks the first changed field. |
| F-1-20 | Fixed: the package heading names recording, replay, and comparison. |
| F-1-21 | Fixed: the page gives a concrete free release and unavailable registration state. |
| F-1-22 | Fixed: Copy code is explicit; the obsolete Save action is absent. |
| F-2-1 | Fixed: `site-build-output` is listed and passed. |
| F-2-2 | Fixed: publishing-readiness and factory-deployment promises are absent. |
| F-3-1 | Fixed: no checkout CTA or billing request remains; the live crawler found zero checkout links. |

## 7. Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200. `/review-4-missing` returned the designed page with HTTP 404 and **Return home**.
- Every route has `lang="en"`, one h1, one main landmark, a route-specific title no longer than 60 characters, a meta description, canonical URL, SVG favicon, 180 px touch icon, Open Graph fields, and Twitter fields. No image lacks alt text.
- Root title is **State Transition Capsule — Find the first changed field**. Demo, legal, and 404 routes use the required route-first pattern.
- The live crawler found 12 unique links and no dead link. GitHub source returned 200; mail links are explicit. Fragment targets exist.
- Forward and back navigation restored the expected URL and focused the destination h1. A polite live region is present.
- Headers and footers are consistent and include Privacy, Terms, the product one-liner, Param Factory credit, and version.
- Playwright Axe found zero violations on live root and demo at 390 px. The clean suite covers desktop and mobile Axe, keyboard use, 44 px targets, focus visibility, contrast, reduced motion, and overflow.
- `verify-url.sh` passed live root and demo with zero console errors, one h1, one main, `lang=en`, and no missing alt text.
- The first-load application module is 17.50 kB raw / 6.37 kB gzip. The clean build produced `dist/package/` and `dist/site/`.
- Nineteen public build files matched the live deployment byte-for-byte. The deployment headers and designed 404 matched `staticwebapp.config.json`.
- The warm enamel palette, charcoal comparison console, stamped labels, locally served Bricolage/Plex pairing, original instrument art, and ruled trace form a distinct instrument-panel identity consistent with `.factory/design.md`.

## 8. Missed leverage

No additional feature finding is warranted. The brief's recording, redaction, retention, JSON import/export, pure replay, and first-change comparison are present in the package and editable playground. Sync would conflict with the local-first evidence workflow. An AI step would add nondeterminism to a task whose value is exact replay and comparison; no AI provider key or decorative AI feature is present.

## 9. Repository verification

- All 20 claim commands: PASS independently in the clean clone.
- `npm test`: PASS — 14 unit/manifest, 11 artifact, 50 browser tests, 2 expected development skips, and 2 production-offline tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test:links:live`: PASS — 5 routes, 12 unique links, zero checkout links, designed missing route 404.
- No product code was modified during this review.

## What would make this perfect

Use the established run-file terms in every runtime state, correct the README's in-memory demo description, replace raw import failures with short errors that include one recovery action, and fix the initial-state result grammar. Add those strings and states to the copy/browser tests, then rerun every claim and this full checklist. The acceptance point remains zero findings.
