# Polish round 5 — State Transition Capsule

**Review baseline:** `830805fa84808786bbe9a3d3ebec55479cd65eab`  
**Repair commits:** `b5abdcc`, `c61bfeb`, `ffc5838`  
**Deployment:** `82e6e866-8e64-4759-9be7-5535987eccf9`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>

## Repair

F-5-1 is repaired. The README now creates a fresh consumer directory, packs
the tarball into it before changing directories, and installs the local
tarball with `npm install ./state-transition-capsule-0.1.0.tgz`. The path is
independent of the source-checkout name.

`@claim:local-tarball-install` now clones the repository as
`sf-state-transition-capsule`, extracts the exact README shell block, executes
it with network disabled, and imports the installed package. This prevents a
future documentation-only regression.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the sticky demo disclosure, Reset demo, and Start for real controls on mobile. | Browser: `keeps the demo disclosure and controls visible through the mobile comparison viewer`; live `/demo`; [mobile screenshot](evidence/polish-5/demo/screenshot-mobile.png). |
| F-1-2 | Retained the editable package playground with comparison, redaction, replay, and changing output. | Browser: `runs editable package playground examples and updates output from edited JSON`; live `/demo`; [live check](evidence/polish-5/live-check.json). |
| F-1-3 | Kept the unverified registry install command removed; the source-tarball path is now executable. | `@claim:local-tarball-install`; clean clone `sf-state-transition-capsule`; README exact-block test. |
| F-1-4 | Kept scoped JSON-review and redaction guidance instead of a broad safety claim. | `@claim:json-roundtrip`; live `/`; [root screenshot](evidence/polish-5/root/screenshot-mobile.png). |
| F-1-5 | Retained listed JSON import/export and cross-context comparison coverage. | `@claim:json-roundtrip`; live `/demo` reports `$.report.chart`. |
| F-1-6 | Retained data-only handling for script-like run-file text. | `@claim:viewer-does-not-execute-capsules`; clean browser suite. |
| F-1-7 | Retained all six documented functions and declarations in ESM and CommonJS. | `@claim:public-api-surface`; clean artifact suite. |
| F-1-8 | Retained explicit v1 media-marker acceptance and rejection coverage. | `@claim:capsule-format-v1`; clean unit suite. |
| F-1-9 | Retained separate recording and JSON-transfer claims for the free package. | `@claim:recording`, `@claim:json-roundtrip`; clean clone claim run. |
| F-1-10 | Kept merchant copy, checkout links, and billing requests out of the release. | Browser: `keeps operator-gated commerce out of every deployed document`; live link crawl. |
| F-1-11 | Retained destination-heading focus and polite announcements on forward and back navigation. | Browser: `moves focus to each destination heading after forward and back navigation`; [live check](evidence/polish-5/live-check.json). |
| F-1-12 | Retained the dedicated raw `/demo` document with route-specific metadata. | Browser: `emits a dedicated raw demo document with demo social metadata`; live `/demo`; [live check](evidence/polish-5/live-check.json). |
| F-1-13 | Retained complete metadata and a return-home action on the designed 404. | Browser: `404 publishes route-specific social metadata`; live unknown-route check returns 404 in [live check](evidence/polish-5/live-check.json). |
| F-1-14 | Retained Demo, Viewer, API, and Privacy in the 390 px header. | Browser: `all visible links and controls meet the 44px target without overflow`; live `/`; [root screenshot](evidence/polish-5/root/screenshot-mobile.png). |
| F-1-15 | Retained the Param Factory and version line on mobile. | Same 44 px/overflow browser test; live `/`; [root screenshot](evidence/polish-5/root/screenshot-mobile.png). |
| F-1-16 | Retained short, plain README opening sentences. | [copy audit](copy-audit.md); current opening remains 7, 12, 13, and 14 words. |
| F-1-17 | Retained the one vocabulary in static and runtime viewer text. | Browser: `uses established run-file terms in viewer messages and result descriptions`; live `/demo`. |
| F-1-18 | Retained concrete retention wording about recent transitions. | `@claim:bounded-retention`; live `/`. |
| F-1-19 | Retained the explanatory instrument caption. | Browser: `local routes load without console errors and keep required landmarks`; live `/`; [root screenshot](evidence/polish-5/root/screenshot-mobile.png). |
| F-1-20 | Retained the operation-led package heading. | `@claim:public-api-surface`; live `/`. |
| F-1-21 | Retained the honest free-release and registration-unavailable state. | `@claim:registration-unavailable`; live `/`. |
| F-1-22 | Retained the explicit Copy code control and no obsolete paid action. | Browser: `copy code control includes its visible label in its accessible name`; live `/demo`. |
| F-2-1 | Retained the claimed static-site output contract. | `@claim:site-build-output`; clean build emits `dist/site/`. |
| F-2-2 | Retained only tested tarball and site-output wording. | Claim-manifest regression; [copy audit](copy-audit.md). |
| F-3-1 | Kept the dead checkout removed. | `@claim:registration-unavailable`; `npm run test:links:live` found zero checkout links. |
| F-4-1 | Retained accurate in-memory demo wording and demo-key cleanup. | `@claim:demo-isolation`; [live check](evidence/polish-5/live-check.json). |
| F-4-2 | Retained short import errors with recovery actions. | Browser: `gives short recovery actions for malformed and incomplete run files`. |
| F-4-3 | Retained the complete initial-state message. | Browser: `describes unequal initial states with complete grammar`. |
| F-5-1 | Made the README tarball workflow checkout-name independent and made its claim execute the exact block from `sf-state-transition-capsule`. | `@claim:local-tarball-install`; full clean-clone claim run; `npm test`. |

## Verification and live recheck

- In clean clone `/tmp/stc-polish5.t36fZu/sf-state-transition-capsule`, `npm ci` succeeded and every one of the 20 commands in `.factory/claims.json` passed independently.
- `npm test` passed: 14 unit/manifest tests, 11 artifact tests, 54 browser tests with two expected development skips, and two production-offline tests. `npm run typecheck`, `npm run lint`, and `npm pack --json` also passed.
- The README regression test built, packed, installed, and imported the package from a clone named `sf-state-transition-capsule` with `npm_config_offline=true`.
- `verify-url.sh` passed cold root and demo loads: HTTP 200, correct titles, `lang=en`, one h1, one main, no missing alt text, and zero console errors. See [root verification](evidence/polish-5/root/verify.json) and [demo verification](evidence/polish-5/demo/verify.json).
- Live Playwright/Axe checked `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`: zero serious or critical violations. It also checked the demo boundary, 390 px controls, editable playground, storage isolation, reset/exit, heading focus, raw demo metadata, designed 404, and same-origin GET-only traffic. See [live check](evidence/polish-5/live-check.json).
- A fresh live service-worker context reloaded `/demo` offline with `$.report.chart` still present and no errors. See [offline evidence](evidence/polish-5/live-offline.json).
- `npm run test:links:live` passed against production: five routes, 12 unique links, zero checkout links, and designed HTTP 404.

No review finding remains open.
