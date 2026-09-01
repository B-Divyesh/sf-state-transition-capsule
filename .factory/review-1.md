# Adversarial first-read review 1 — State Transition Capsule

**Work order:** `state-transition-capsule-review-1`

**Candidate:** `8e407b8924e725a2f25aac893df19c4d438aa971`

**Live URL:** <https://state-transition-capsule.sociobot.in/>

**Reviewed:** 1 September 2026 UTC
**Verdict:** **FAIL — 22 findings (2 blocking, 8 high, 8 medium, 4 low).**

PASS requires zero findings. The listed claim commands and the complete repository suite pass, but the mobile demo notice is not persistent, the library demo is not an editable playground, visitor-facing claims remain outside the claims manifest, and copy and route requirements remain open.

## Findings

### Blocking

#### F-1-1 — The demo notice and exit controls disappear on a phone

- **Location and quote:** `/demo`; `site/index.html:41-46`, **“Demo — sample data, nothing is saved”**, **“Reset demo”**, and **“Start for real”**. `site/src/styles.css:255` changes `.demo-banner` from `position: sticky` to `position: static` below 620 px. `site/src/main.ts:408` then scrolls the workbench into view.
- **Observed:** after the one-click entry settled at 390×844, `scrollY` was 1,392 px, the workbench started at `-84.75px`, and the banner started at `-1,324px`. The loaded runs were visible, but the demo disclosure, Reset, and Start for real were not.
- **Why this blocks:** a phone visitor using the demo cannot see that the data is disposable or reach the required reset/exit controls without scrolling back through the page. The required persistent demo boundary is absent at the point of use.
- **Concrete fix:** keep the banner sticky at 390 px, offset the workbench scroll target below it, and add a mobile test that scrolls through the workbench while asserting the disclosure, **Reset demo**, and **Start for real** remain visible and operable.

#### F-1-2 — The npm-library demo is not an editable playground

- **Location and quote:** `/demo`; `site/index.html:83-125` provides two file pickers and a fixed result. `site/index.html:150-161` provides a static code block. There is no editable input that executes the package and updates live output.
- **Why this blocks:** the attached library demo contract requires an in-page playground with editable input → live output using the shipped package. The current sample confirms only one fixed comparison. A visitor cannot alter the sample to exercise recording, redaction, or replay.
- **Concrete fix:** add an editable, seeded JSON or TypeScript playground that runs the built package in the browser and updates the result. Keep the existing realistic example, show redaction and replay as selectable examples, and add a browser test that changes an input path and confirms the output changes.

### High

#### F-1-3 — The page offers an npm install command that this release does not verify

- **Location and quote:** `site/index.html:58-60`, **“npm i state-transition-capsule”**; `README.md:11-15`, **“npm install state-transition-capsule”**.
- **Evidence:** the preceding handoff states that the tarball is ready but was not published. The `package-formats` claim installs nothing from the npm registry; it loads local `dist/package` files. No claims entry covers registry installation.
- **Why this misleads:** the primary product is an npm library, so the visible command implies that a clean user project can install the named release now. That outcome is not established.
- **Concrete fix:** either publish the version before showing the command and add a clean temporary-project install/import claim, or label and link a working local tarball/GitHub installation until publication.

#### F-1-4 — “Safe to inspect” is broad, unlisted, and not guaranteed

- **Location and quote:** `site/index.html:133`, **“That makes failures portable, reviewable, and safe to inspect on a second machine.”**
- **Why this misleads:** redaction is configured by the caller. A capsule can still contain secrets or personal data, as the privacy copy itself warns. None of the 12 claims proves general safety or second-machine portability.
- **Concrete fix:** replace it with **“Each capsule is a JSON file you can review on another machine. Redact sensitive fields before recording.”** Add a clean-machine JSON round-trip test if the portability sentence remains.

#### F-1-5 — JSON portability and import/export are unlisted claims

- **Locations and quotes:** `README.md:5`, **“Capsules are portable JSON”**; `site/index.html:121`, **“Use your exported JSON files…”**; `README.md:84`, **“The free package and viewer include … JSON export/import…”**
- **Why this misleads:** no claims entry promises a serialize → transfer → parse → browser-import round trip. The redaction test happens to call parse/stringify, but its manifest claim and sandbox do not inventory or verify the advertised import/export workflow.
- **Concrete fix:** add a `json-roundtrip` claim and one tagged test that creates and serializes a capsule with the package, opens the result in a fresh browser context, and confirms the same comparison result.

#### F-1-6 — The viewer non-execution promise is not directly listed or tested

- **Locations and quotes:** `README.md:5`, **“no recorded event is executed by the viewer”**; `README.md:64`, **“The local viewer never loads code from a capsule and never performs effects.”**
- **Why this misleads:** `pure-replay` tests a caller-supplied reducer in the library. It does not exercise hostile capsule content in the viewer or assert that the viewer never evaluates it.
- **Concrete fix:** add a `viewer-does-not-execute-capsules` claim with a browser fixture containing script-like strings and event payloads; confirm no script, network request, or side effect occurs. Rewrite **“performs effects”** as **“makes external changes.”**

#### F-1-7 — The exact public API surface is an unlisted claim

- **Location and quote:** `README.md:82`, **“The small public surface is `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus exported TypeScript types.”**
- **Why this misleads:** `package-formats` checks only one ESM export, one CommonJS export, and the presence of a declarations file. It does not assert all six named exports or a usable declaration for each.
- **Concrete fix:** add a `public-api-surface` claim whose fresh-consumer test imports and invokes every documented export in ESM and CommonJS and type-checks a consumer using each declaration.

#### F-1-8 — The versioned media marker is an unlisted format promise

- **Location and quote:** `README.md:82`, **“Capsules use the versioned media marker `state-transition-capsule/v1`.”**
- **Why this misleads:** ordinary tests refer to the marker, but no manifest entry identifies this compatibility promise or selects the test for independent verification.
- **Concrete fix:** add a `capsule-format-v1` claim and tagged parse/serialize tests that accept `state-transition-capsule/v1` and reject unsupported markers.

#### F-1-9 — The advertised free feature set is not completely inventoried

- **Location and quote:** `README.md:84`, **“The free package and viewer include recording, JSON export/import, redaction, comparison, and deterministic replay.”**
- **Why this misleads:** comparison, redaction, and replay have entries; recording and JSON export/import do not. The sentence makes one bundled availability promise that the claims manifest cannot fully account for.
- **Concrete fix:** split this sentence into links to individually listed, tagged claims, adding `recording` and `json-roundtrip` coverage.

#### F-1-10 — The merchant-of-record statement is an unlisted commercial claim

- **Location and quote:** `site/index.html:178`, **“Sociobot/Dodo is the merchant of record.”**
- **Why this misleads:** this is a commercial statement a buyer can rely on. `studio-price` checks the displayed price, checkout URL, and Terms copy, not the merchant relationship.
- **Concrete fix:** add an evidence-backed `merchant-of-record` claim/test within the permitted sandbox, or remove the statement from the landing page until the checkout contract can be verified.

### Medium

#### F-1-11 — Route changes do not move focus to the new page heading

- **Location:** live navigation from `/` to `/privacy/`, and from `/` to `/demo`; there is no route-focus code in `site/src/main.ts` or `site/src/legal.ts`.
- **Observed:** after navigation settled, `document.activeElement.tagName` was `BODY`, not the destination `h1`. Back navigation also restored focus to `BODY`.
- **Why this loses users:** keyboard and screen-reader users receive no programmatic indication that the page changed or where the new content begins.
- **Concrete fix:** focus the destination `h1` after navigation (`tabindex="-1"`) and announce the route title in a polite live region. Add forward/back focus assertions.

#### F-1-12 — `/demo` does not have route-specific social metadata

- **Location:** live `/demo`; `site/index.html:10-22` and `site/src/main.ts:394-396`.
- **Observed:** JavaScript changes the document title and canonical, but `og:title`, `og:description`, `og:url`, and Twitter metadata remain the home-page values. The raw `/demo` response is a rewrite of home metadata, which link-preview crawlers commonly do not execute.
- **Why this matters:** a shared demo URL describes the general landing page rather than the sample demo route.
- **Concrete fix:** emit a dedicated `/demo` document or server metadata with **“Demo — State Transition Capsule”**, a demo-specific description, and `og:url` set to `/demo`; test the response HTML, not only the post-script DOM.

#### F-1-13 — The designed 404 lacks required canonical and social metadata

- **Location:** `site/404.html`; live `/definitely-missing-review-1`.
- **Observed:** the 404 has a route title, description, favicon, one `h1`, and a return link, but no canonical, Open Graph fields, or Twitter card fields.
- **Concrete fix:** add the required route metadata using the product artwork and test the actual 404 response.

#### F-1-14 — The mobile header removes required navigation with no replacement

- **Location:** `site/src/styles.css:233-235`, `.site-header nav a:not(:first-child) { display: none; }`.
- **Observed:** at 390 px the header exposes only **Demo**; Workbench, API, and Privacy are hidden. There is no menu control.
- **Why this loses users:** the standard skeleton requires a consistent header with the product’s main sections and Privacy. A phone visitor must discover duplicate footer links or manually scroll.
- **Concrete fix:** retain the links in a compact wrapping row or add an accessible menu with focus management, Escape handling, and the same destinations.

#### F-1-15 — The mobile footer hides the required build identifier

- **Location:** `site/index.html:203`; `site/src/styles.css:242-244`, `.site-footer > p:last-child { display: none; }`.
- **Observed:** **“Built by Param Factory · v0.1.0”** is absent visually below 900 px.
- **Why this matters:** the supplied skeleton requires the builder and version/build identifier in the footer on every route and viewport.
- **Concrete fix:** keep the line visible and allow the footer to wrap vertically.

#### F-1-16 — The README opening exceeds the hard sentence cap and stacks unexplained terms

- **Location and quote:** `README.md:3`, 27 words: **“Capture the state around domain events, remove secrets at the source, replay pure transitions, and locate the first field where a failing run left a known-good run.”**
- **Why this loses readers:** it exceeds 22 words and combines four tasks with the unexplained terms “domain events” and “pure transitions.”
- **Concrete rewrite:** **“Record state before and after application events. Redact secrets, replay transitions, and find the first changed field between runs.”**

#### F-1-17 — The product uses competing terms for the same result and input

- **Locations and quotes:** `site/index.html:54`, **“first field that changed”**; `site/index.html:68`, **“exact divergence”**; `site/index.html:78`, **“run that drifted”**; `site/index.html:121`, **“first divergent field”**; `site/index.html:138`, **“first changed JSON path.”** The UI also alternates **viewer**, **workbench**, and **bench**.
- **Why this loses readers:** a first-time visitor must infer that “drift,” “divergence,” and “changed path” mean the same outcome, and that viewer/workbench/bench name the same interface.
- **Concrete fix:** use **run file**, **failed run**, **first changed field**, and **comparison viewer** consistently. Update `.factory/copy-audit.md` to match the actual copy.

#### F-1-18 — “Bounded evidence” is unexplained jargon

- **Location and quote:** `site/index.html:136`, **“Set a transition limit for bounded evidence.”**
- **Why this loses readers:** it does not state what is retained or removed.
- **Concrete rewrite:** **“Set how many recent transitions each capsule keeps.”**

### Low

#### F-1-19 — The hero caption is a slogan rather than an explanation

- **Location and quote:** `site/index.html:68`, **“Two recorded runs. One exact divergence.”**
- **Why this adds little:** “exact” is promotional, and the fragment repeats the headline without explaining the image or workflow.
- **Concrete rewrite:** **“The viewer compares two runs and marks the first changed field.”**

#### F-1-20 — The API heading is abstract and metaphorical

- **Location and quote:** `site/index.html:146`, **“A narrow API for evidence you own.”**
- **Why this loses readers:** “narrow” and “evidence you own” do not name the available operations.
- **Concrete rewrite:** **“Six functions to record, replay, and compare state.”**

#### F-1-21 — “Complete” is an unsupported marketing adjective

- **Location and quote:** `site/index.html:171`, **“The open package and viewer handle the complete capture-and-compare workflow.”**
- **Why this misleads:** “complete” has no boundary and obscures which part is free.
- **Concrete rewrite:** **“The open package records capsules, and the viewer compares them. Studio saves labels and history in this browser.”**

#### F-1-22 — Two button labels do not name their result

- **Locations and quotes:** `site/index.html:59`, **“Copy”**; `site/index.html:192`, **“Save.”**
- **Why this loses users:** each verb relies on nearby context rather than naming the result, contrary to the supplied plain-words rule.
- **Concrete fix:** change them to **“Copy install command”** and **“Save case.”** Keep the post-action status messages.

## 1. Cold first read

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 with `scrollY = 0`.

- **What it does:** **“Find the state change that broke the second run.”**
- **For whom:** **“For developers debugging repeat-run failures…”**
- **What to click first:** **“Try it with sample data”**, next to **“Loads two sample runs in a separate demo.”**

All three answers and all three fact lines were visible without scrolling at both sizes. The mobile page had no horizontal overflow. This gate passes.

## 2. Copy audit

Counts use whitespace-separated words; hyphenated terms and URLs count as one word. Code blocks are excluded. Every prose sentence on the root landing page and in README is listed below. UI headings and controls are checked after the tables.

### Landing-page sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| L1 | 9 | Find the state change that broke the second run. | Clear |
| L2 | 17 | For developers debugging repeat-run failures, it compares two state histories and names the first field that changed. | Clear |
| L3 | 8 | Loads two sample runs in a separate demo. | Clear |
| L4 | 7 | Capsules stay in this tab by default. | Listed claim; “capsule” is later inconsistent with “run file” |
| L5 | 6 | Works offline after the first visit. | Listed claim |
| L6 | 8 | Free core tools · Studio costs $39 once. | Listed price claim |
| L7 | 3 | Two recorded runs. | Clear |
| L8 | 3 | One exact divergence. | F-1-19 |
| L9 | 9 | Load a known-good capsule and the run that drifted. | F-1-17 |
| L10 | 7 | Files stay in this tab by default. | Listed claim |
| L11 | 15 | Use your exported JSON files or load the example to see the first divergent field. | F-1-5, F-1-17 |
| L12 | 7 | Capture only the state your bug changed. | Clear instruction |
| L13 | 10 | Capsules capture only the state and domain events you declare. | Technical but scoped to developer audience |
| L14 | 13 | That makes failures portable, reviewable, and safe to inspect on a second machine. | F-1-4 |
| L15 | 7 | Wrap the point where durable state changes. | Clear for the stated audience |
| L16 | 7 | Set a transition limit for bounded evidence. | F-1-18 |
| L17 | 10 | Replace exact or wildcard paths before anything reaches the capsule. | Listed redaction claim |
| L18 | 12 | Align snapshots in order and stop at the first changed JSON path. | F-1-17 |
| L19 | 7 | A narrow API for evidence you own. | F-1-20 |
| L20 | 10 | ESM, CommonJS, TypeScript declarations, and no runtime dependencies ship together. | Listed package claim |
| L21 | 5 | Keep a local case history. | Clear |
| L22 | 10 | The open package and viewer handle the complete capture-and-compare workflow. | F-1-21 |
| L23 | 13 | Studio adds saved comparison labels and local history for teams who revisit incidents. | Listed license claim |
| L24 | 6 | $39 one time · per user. | Listed price claim |
| L25 | 6 | Sociobot/Dodo is the merchant of record. | F-1-10 |
| L26 | 7 | The free comparison bench remains fully available. | Listed license claim; F-1-17 terminology |
| L27 | 5 | Compare recorded state changes locally. | Listed local-processing claim |

### README sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| R1 | 27 | Capture the state around domain events, remove secrets at the source, replay pure transitions, and locate the first field where a failing run left a known-good run. | F-1-16 |
| R2 | 19 | It is for application developers debugging workflows that work once and drift after persisted client or server state changes. | F-1-17 (“drift”) |
| R3 | 20 | Capsules are portable JSON, the viewer runs entirely in the browser, and no recorded event is executed by the viewer. | F-1-5 and F-1-6 |
| R4 | 7 | Try the isolated sample without setup: https://state-transition-capsule.sociobot.in/demo. | Demo entry confirmed |
| R5 | 11 | It loads two report runs and identifies the first changed field. | Listed first-divergence claim |
| R6 | 9 | Redaction occurs before state or events enter the capsule. | Listed redaction claim |
| R7 | 6 | Inputs are cloned and never mutated. | Covered by the redaction claim sandbox and tagged assertion |
| R8 | 11 | Replay calls only the reducer you supply in your own process. | Listed pure-replay claim |
| R9 | 13 | The local viewer never loads code from a capsule and never performs effects. | F-1-6; “performs effects” is jargon |
| R10 | 3 | Requires Node.js 20+. | Clear prerequisite |
| R11 | 9 | `npm run build:site` writes the static deployment to `dist/site/`. | Confirmed by build |
| R12 | 13 | The `/demo` route uses bundled sample data and a separate `demo:` storage namespace. | Listed isolation claim |
| R13 | 13 | The standard and demo viewer make no telemetry, API, or third-party runtime request. | Listed no-telemetry claim |
| R14 | 15 | Imported capsules stay in the current browser tab unless the user explicitly enables local retention. | Listed storage claim |
| R15 | 16 | The small public surface is `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus exported TypeScript types. | F-1-7 |
| R16 | 7 | Capsules use the versioned media marker `state-transition-capsule/v1`. | F-1-8 |
| R17 | 14 | The free package and viewer include recording, JSON export/import, redaction, comparison, and deterministic replay. | F-1-5 and F-1-9 |
| R18 | 17 | Capsule Studio costs $39 per user as a one-time purchase for local history and saved comparison labels. | Listed price/license claims |
| R19 | 7 | The comparison workbench stays available without Studio. | Listed license claim |
| R20 | 5 | Capsules may contain sensitive data. | Useful warning |
| R21 | 10 | Prefer broad redaction rules and inspect exported JSON before sharing. | Useful instruction |
| R22 | 6 | Redaction is irreversible replacement, not encryption. | Useful limitation |
| R23 | 10 | The viewer operates locally and does not upload capsule contents. | Listed local-processing claim |
| R24 | 7 | See the site’s Privacy and Terms pages. | Clear direction |
| R25 | 1 | MIT. | Confirmed by `LICENSE` |
| R26 | 2 | See LICENSE. | Clear direction |

### Headings, terms, and controls

- All headings name their section except **“A narrow API for evidence you own”** (F-1-20). The README heading **“Replay a pure reducer”** is technical but appropriate for the developer audience and followed immediately by code.
- No banned plain-words term appears.
- The terminology table in `.factory/copy-audit.md` does not match the live page’s competing terms; see F-1-17.
- Result-naming actions pass for **Try it with sample data**, **Choose JSON**, **Load two-run example**, **Compare runs**, **Copy code**, **Buy Studio in hosted checkout**, **Restore a license**, **Verify license**, **Reset demo**, and **Start for real**. **Copy** and **Save** fail; see F-1-22.

## 3. Demo and sandbox checks

- One click from the cold page opens `/demo`.
- The stable 390 px view shows two realistic report runs with two transitions each and a completed message naming `$.report.chart`. Desktop also shows the result.
- The sample changes `$.report.chart` from `"bar"` to `"line"` after `chart.selected`.
- Reset recreates both samples and the result.
- A seeded normal key, `stc:saved-runs = real-marker`, remained unchanged through demo entry and Reset.
- No `demo:` keys remained after Reset or Start for real. Start for real returned to `/` with empty input bays.
- The demo flow made only same-origin GET requests. No telemetry, API, third-party, or capsule-upload request occurred.
- The persistent-banner failure is F-1-1. The library-playground failure is F-1-2.

## 4. Claims gate

The repository was cloned locally into `/tmp/stc-review-qaRg0e/clone`; `npm ci` passed with 0 vulnerabilities. Every command in `.factory/claims.json` then ran verbatim.

| Claim | Exact command | Result |
| --- | --- | --- |
| `first-divergence` | `npm run test:e2e -- --grep @claim:first-divergence` | PASS — 2 projects |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 2 projects |
| `local-processing` | `npm run test:e2e -- --grep @claim:local-processing` | PASS — 2 projects |
| `offline-reload` | `npm run build && npm run test:e2e:production -- --grep @claim:offline-reload` | PASS — build and 2 projects |
| `redaction` | `npm run test:unit -- --testNamePattern @claim:redaction` | PASS — 1 selected test |
| `pure-replay` | `npm run test:unit -- --testNamePattern @claim:pure-replay` | PASS — 1 selected test |
| `bounded-retention` | `npm run test:unit -- --testNamePattern @claim:bounded-retention` | PASS — 1 selected test |
| `package-formats` | `npm run build && npm run test:artifacts -- --testNamePattern @claim:package-formats` | PASS — build and 1 selected test |
| `license-restore` | `npm run test:e2e -- --grep @claim:license-restore` | PASS — 2 projects |
| `tab-local-storage` | `npm run test:e2e -- --grep @claim:tab-local-storage` | PASS — 2 projects |
| `no-telemetry-runtime` | `npm run test:e2e -- --grep @claim:no-telemetry-runtime` | PASS — 2 projects |
| `studio-price` | `npm run test:e2e -- --grep @claim:studio-price` | PASS — 2 projects |

No listed claim test failed. Manifest completeness fails through F-1-3 to F-1-10.

## 5. Offline, privacy, and storage evidence

- In a fresh live context, the service worker reached `activated`, controlled the page, and reloaded `/demo` while offline.
- The offline page retained title **“Demo — State Transition Capsule”**, the `$.report.chart` result, and the completed comparison message with zero console/page errors.
- The complete live normal → demo → Reset → Start for real flow generated only same-origin GET requests.
- Source review confirms demo keys use the `demo:` prefix and demo mode disables license restoration. The live storage probe confirmed normal data was untouched.

## 6. History checks

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists. The preceding `.factory/handoff.md` reported no known gap. The available `verification-2.md` through `verification-5.md` were also checked as supporting history:

- the formerly invalid Vitest claim selectors now pass verbatim;
- bounded-retention and price/storage claims are listed and pass;
- the 180×180 touch icon exists and is referenced on every document;
- accessible-name mismatch, 44 px targets, 16 px supporting copy, and legal-page social metadata fixes are present in source and live output;
- all 24 served files from the current build match the live deployment byte-for-byte.

None of those earlier defects regressed. F-1-1 through F-1-22 are newly observed against the current acceptance instructions.

## 7. Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and an unknown route have `lang="en"`, one `main`, one `h1`, nonempty route titles, and no missing image alt text.
- Root, Privacy, and Terms have descriptions, canonicals, favicon/touch icon, and OG/Twitter metadata. Demo and 404 exceptions are F-1-12 and F-1-13.
- An unknown route returns HTTP 404 and the designed in-product page with **Return home**.
- Every same-origin link and fragment on the landing page returned 200 and every fragment target existed. GitHub and the hosted billing links were inventoried but not fetched because this work order prohibits connecting to non-`sf-state-transition-capsule` resources.
- Header/footer markup is shared across routes. Mobile omissions are F-1-14 and F-1-15.
- Back navigation returns to the prior URL and restores scroll, but route focus fails as F-1-11.
- `/opt/fleet/lib/verify-url.sh` passed `/demo` in 602 ms with zero console errors.
- Axe 4.10.2 reported zero violations, including zero serious/critical and zero `label-content-name-mismatch` findings, on all five document routes at 390 px and desktop.
- The mid-century instrument panel design follows `.factory/design.md`: warm enamel colors, local display/data fonts, ruled traces, physical controls, original artwork, and a non-generic workbench. Reduced motion, contrast, touch targets, and mobile overflow checks pass.
- Live response headers include CSP with header-only `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, and `X-Frame-Options: DENY`.

## 8. Missed leverage

No AI feature is expected for deterministic state comparison, and source review found no provider key or runtime model call. Sync would conflict with the local-first scope. The clearly implied missing capability is the editable library playground already recorded as F-1-2; no separate AI or sync finding is added.

## 9. Repository verification

- `npm test`: PASS — 11 unit/manifest tests, build, 5 artifact tests, 36 browser tests, 2 expected skips, and 2 production offline tests.
- `npm run build`: PASS as part of `npm test`; `dist/package/` and `dist/site/` were produced.
- Main site JavaScript is 17.55 kB raw / 6.58 kB gzip, below the 150 kB limit.
- Current build versus live: 24/24 publicly served files matched byte-for-byte; deployment configuration was checked through live headers and 404 behavior.
- Git worktree remained unchanged until this review and handoff were written.

## What would make this perfect

Resolve every finding above, then repeat the review from a clean context. The acceptance point is: the mobile demo notice remains visible beside the populated playground; the published install command works from a clean project; every visitor-facing promise has one tagged sandbox test; terminology and controls use the proposed plain words; each route has complete metadata and heading focus; and the full checklist returns zero findings.
