# Adversarial first-read review 6 — State Transition Capsule

**Work order:** `state-transition-capsule-review-6`  
**Candidate:** `c5dd1280ec1a2262ae4a7a968cc8bd9430f3ffd4`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Reviewed:** 2 September 2026 UTC

## Verdict

**PASS — zero findings.**

The cold first screen, one-click demo, sandbox boundary, all 20 declared claim
tests, live offline reload, route and link checks, metadata, accessibility,
copy, and every earlier repair pass. No untested claim or remaining minor issue
was found.

## Findings

None.

## 1. Cold first read

Fresh Chromium contexts opened the production root at 390 × 844 and
1440 × 900 without prior product storage and at `scrollY = 0`.

- **What it does, in my words:** it compares two recorded application runs and
  identifies the first state field that changed.
- **For whom:** developers investigating a workflow that succeeds once and
   fails on a later run after persisted state changes.
- **What I should click first:** **Try it with sample data**. The adjacent line
  says **“Loads two sample runs in a separate demo.”**

The exact first-screen copy was **“Find the state change that broke the second
run.”** and **“For developers debugging repeat-run failures, it compares two
run files and names the first changed field.”** The primary action and all
three plain facts were visible before scrolling at both sizes. The 390 px page
had no horizontal overflow. This gate passes.

## 2. Copy audit

Counts use whitespace-separated tokens; punctuation marks separated by spaces
count as tokens. Code blocks are excluded. The landing table includes headings,
labels, meaningful states, and prose so that context-free headings and controls
are also checked.

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
| L40 | 13 | Build this source checkout with `npm pack` to create a local package tarball. | Pass; `local-tarball-install` |
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

Demo and runtime copy was also checked. **“Demo — sample data, nothing is
saved”** is seven words. Import failures are 15, 17, and 10 words and state a
recovery action. **“The runs start from different states”** is seven words.
**“Changed fields in the first transition that differs between runs”** is ten
words. No runtime sentence exceeds 22 words.

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
| R10 | 16 | Build a local tarball from this checkout, then install that exact file in a fresh project. | Pass; `local-tarball-install` |
| R11 | 13 | The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations. | Pass; `package-formats` |
| R12 | 14 | Configured fields are redacted before state, event, and metadata values enter a run file. | Pass; `redaction` |
| R13 | 6 | Inputs are cloned and never mutated. | Pass; asserted by `redaction` |
| R14 | 15 | Run files serialize as JSON, parse on another machine, and retain the same comparison result. | Pass; `json-roundtrip` |
| R15 | 16 | The viewer handles their text as data; it does not run scripts or make external changes. | Pass; `viewer-does-not-execute-capsules` |
| R16 | 10 | Replay calls only the reducer supplied by your application process. | Pass; `pure-replay` |
| R17 | 14 | The public API exports `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus TypeScript types. | Pass; `public-api-surface` |
| R18 | 8 | Run files use the versioned media marker `state-transition-capsule/v1`. | Pass; `capsule-format-v1` |
| R19 | 18 | The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers. | Pass; corresponding claims |
| R20 | 9 | This release offers no Studio registration or checkout link. | Pass; `registration-unavailable` |
| R21 | 7 | The browser viewer works without an account. | Pass; `registration-unavailable` |
| R22 | 6 | Run files may contain sensitive data. | Pass; useful warning |
| R23 | 11 | Prefer broad redaction rules and inspect exported JSON before sharing it. | Pass; useful instruction |
| R24 | 7 | Redaction replaces values; it is not encryption. | Pass; `redaction` |
| R25 | 12 | The viewer processes run files locally and does not upload their contents. | Pass; `local-processing` |
| R26 | 12 | Standard and demo visits make no telemetry, API, or third-party runtime request. | Pass; `no-telemetry-runtime` |
| R27 | 8 | The viewer works offline after the first visit. | Pass; `offline-reload` |
| R28 | 7 | Read the site Privacy policy and Terms. | Pass; both links return 200 |
| R29 | 3 | Requires Node.js 20+. | Pass; `node-20` |
| R30 | 9 | `npm run build:site` writes the static deployment to `dist/site/`. | Pass; `site-build-output` |
| R31 | 1 | MIT. | Pass; matches `LICENSE` |
| R32 | 2 | See [LICENSE](LICENSE). | Pass |

No sentence exceeds 22 words. No banned marketing adjective, unexplained
jargon, metaphor, mood heading, or inconsistent core term remains. Headings
name their content without context. Visible actions are **Try it with sample
data**, **Read package setup**, **Choose JSON**, **Load two-run example**,
**Compare runs/again**, **Compare example**, **Show redaction**, **Run replay**,
**Copy code**, **Reset demo**, **Start for real**, and **Return home**. Each
uses a result-naming verb; navigation items are destination labels.

Terminology is consistent: JSON artifact → **run file**; successful input →
**known-good run file**; later failure input → **failed run file**; earliest
unequal result → **first changed field**; browser interface → **comparison
viewer**; isolated sample → **demo**.

## 3. Demo and sandbox behavior

- One click on **Try it with sample data** opened `/demo`.
- The first 390 px demo view showed the populated **Quarterly report / known
  good** and **Quarterly report / second run** inputs and **Compare again**.
  The completed result directly below names `chart.selected`,
  `$.report.chart`, and `"bar"` → `"line"`. Desktop showed the result in its
  initial viewport.
- The sticky banner read **“Demo — sample data, nothing is saved”** and kept
  **Reset demo** and **Start for real** visible even at the document bottom.
  At 390 px its measured bounds remained `top: 0`, `height: 75.5625`.
- **Reset demo** recreated the sample inputs and the same completed result.
- A normal key `real:review6 = intact` survived demo entry, reset, and exit.
  Seeded `demo:` keys in local and session storage were removed on entry. No
  sample value appeared in local storage, session storage, or IndexedDB.
- **Start for real** returned to `/`, removed the banner, and restored empty
  run-file inputs without changing the normal marker.
- The editable playground runs comparison, redaction, and replay through the
  shipped library code; changing its JSON changes the output.
- The entire live flow made same-origin GET requests only, with no API,
  telemetry, third-party, or upload request and no console or page error.
- After service-worker activation, a fresh live `/demo` context went offline
  and reloaded with the banner and `$.report.chart` result intact.

The demo and sandbox gates pass.

## 4. Claims verification

Candidate `c5dd128` was cloned into
`/tmp/stc-review6.sg4kXH/clone`. After `npm ci`, every command from
`.factory/claims.json` ran exactly as declared.

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

All 20 commands passed. The claim-bearing landing and README sentences map to
these entries and their observable assertions. No claim-like sentence is
unlisted and no declared claim is untested.

## 5. Earlier-finding verification

Every earlier `review-*.md`, `polish-*.md`, and the preceding handoff was read.
The fixes below were checked in current source/tests and on the live site rather
than accepted from their status labels.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the mobile demo notice and both controls remain sticky and operable throughout the viewer. |
| F-1-2 | Fixed: the editable playground runs comparison, redaction, and replay and updates after JSON edits. |
| F-1-3 | Fixed: no unverified registry-install command is shown; the source-tarball flow passes. |
| F-1-4 | Fixed: the broad “safe to inspect” promise is absent; copy gives scoped review and redaction guidance. |
| F-1-5 | Fixed: `json-roundtrip` passed through a fresh-context import and comparison. |
| F-1-6 | Fixed: script-like run-file text remains data under the passing non-execution claim. |
| F-1-7 | Fixed: all six documented functions and declarations work in ESM and CommonJS. |
| F-1-8 | Fixed: the v1 marker is listed and tested for acceptance and rejection. |
| F-1-9 | Fixed: recording and JSON transfer have separate passing claims. |
| F-1-10 | Fixed: merchant-of-record copy remains absent. |
| F-1-11 | Fixed: live forward and back navigation focus the destination h1 and update the polite announcement. |
| F-1-12 | Fixed: raw live `/demo` has route-specific title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-13 | Fixed: the designed 404 has complete route metadata and a return-home action. |
| F-1-14 | Fixed: Demo, Viewer, API, and Privacy remain visible at 390 px. |
| F-1-15 | Fixed: **Built by Param Factory · v0.1.0** remains visible in the mobile footer. |
| F-1-16 | Fixed: README opening sentences are 7, 12, 13, and 14 words. |
| F-1-17 | Fixed: static and runtime viewer copy uses run file and “first transition that differs”; retired metaphor/jargon is absent. |
| F-1-18 | Fixed: retention copy states how many recent transitions a run file keeps. |
| F-1-19 | Fixed: the hero caption explains that the viewer marks the first changed field. |
| F-1-20 | Fixed: the package heading names recording, replay, and comparison. |
| F-1-21 | Fixed: the page states the concrete free release and unavailable registration state. |
| F-1-22 | Fixed: **Copy code** is explicit and the obsolete paid action is absent. |
| F-2-1 | Fixed: `site-build-output` is listed and its artifact test passes. |
| F-2-2 | Fixed: publishing-readiness and factory-workflow promises remain absent. |
| F-3-1 | Fixed: no checkout CTA or billing request exists; the live crawl found zero checkout links. |
| F-4-1 | Fixed: README says the samples remain in memory, matching source and live storage behavior. |
| F-4-2 | Fixed: malformed, incomplete, and unreadable-file errors are short and state a next action. |
| F-4-3 | Fixed: the initial-state heading reads **“The runs start from different states.”** |
| F-5-1 | Fixed: the exact README install block packs into the consumer directory and passes from a clone named `sf-state-transition-capsule`. |

The earlier contrast and operator-gated commerce controls also remain fixed.
No earlier finding is half-fixed or regressed.

## 6. Structure, accessibility, privacy, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200. A new
  unknown path returned the designed 404 with HTTP 404 and **Return home**.
- The crawl found five routes, 12 unique links, zero checkout links, and no dead
  link. Both GitHub destinations returned 200; the email link is explicit.
- Every route has `lang="en"`, one h1, one main landmark, a route-specific title
  no longer than 60 characters, a description, canonical, Open Graph and
  Twitter metadata, SVG favicon, and 180 px Apple touch icon. Raw `/demo` HTML
  contains its own metadata. `robots.txt` links the sitemap, which lists all
  four public routes.
- Root → Privacy → Back moved focus to each destination h1 and updated the
  polite route announcer. Deep links and fragments loaded their intended state.
- Headers and footers are consistent across routes and viewports, with Privacy,
  Terms, the Param Factory attribution, and version.
- `/opt/fleet/lib/verify-url.sh` passed root and demo with zero console errors,
  one h1, one main, `lang=en`, complete image alt text, and labelled buttons.
- Live Axe 4.10.2 found zero serious or critical violations on root, demo,
  Privacy, Terms, the 404 document, and a live unknown route at 390 px with
  reduced motion. The full browser suite covers keyboard operation, visible
  focus, 44 px targets, contrast, desktop/mobile overflow, and reduced motion.
- Live response headers include CSP with header-only `frame-ancestors 'none'`,
  HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, and frame denial.
- Root and demo traffic was same-origin GET-only. Fonts, scripts, art, and icons
  are self-hosted. The built home JavaScript is about 18.6 kB raw and 6.9 kB
  gzip across its two JavaScript assets, below the 150 kB limit.
- The warm enamel palette, charcoal diagnostic console, stamped labels,
  self-hosted Bricolage Grotesque/IBM Plex Mono pairing, original instrument
  artwork, ruled traces, and physical controls match `.factory/design.md` and
  are visually distinct from a generic SaaS template.

## 7. Missed leverage

The brief implies recording, redaction, retention, replay without arbitrary
effects, comparison, and JSON transfer. Those paths are present in the package,
playground, and viewer. A remote AI step would not improve this deterministic
local-first diagnosis and would weaken the privacy/offline model. Sync is not
implied. No decorative AI, provider key, or external model call exists.

## 8. Repository verification

- `npm test`: PASS — 14 unit/manifest tests, 11 artifact tests, 54 browser
  tests, two intentional development skips, and two production offline tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm pack --json`: PASS — 9,423-byte tarball with eight expected files.
- `npm run test:links:live`: PASS — five routes, 12 unique links, zero checkout
  links, designed missing-route status 404.
- `npm run build` produced `dist/package/` and `dist/site/`.

## What would make this perfect

Nothing remains within the researched brief or the supplied acceptance
checklists. The product is clear in one screen, immediately tryable, honest
about its unavailable paid tier, local and offline, fully claimed, accessible,
and installable through its documented source-tarball path.
