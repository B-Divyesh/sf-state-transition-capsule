# Polish 3 — adversarial-review repair evidence

**Review baseline:** `b79a672262ebdbe403c6a1bf1d12bd72832701b5`  
**Repair commit:** `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89`  
**Deployment id:** `3c092f09-4ef6-444b-a0cc-bcea3229cdec`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Live screenshots:** `.factory/evidence/polish-3/live/root/screenshot-mobile.png`, `.factory/evidence/polish-3/live/demo/screenshot-mobile.png`

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the sticky demo notice, Reset demo, and Start for real controls at 390 px. | `keeps the demo disclosure and controls visible through the mobile comparison viewer`; live `/demo` banner stayed at `top: 0`; demo screenshot. |
| F-1-2 | Retained the editable package playground for comparison, redaction, and replay. | `runs editable package playground examples and updates output from edited JSON`; live `/demo` changed `line` to `area`. |
| F-1-3 | Retained the tested source-tarball path and no registry-install promise. | `@claim:local-tarball-install`; clean fresh-project offline install passed. |
| F-1-4 | Retained scoped JSON review and redaction guidance instead of a broad safety claim. | `.factory/copy-audit.md`; `@claim:redaction`; live root screenshot. |
| F-1-5 | Retained the JSON round-trip claim and fresh-context import comparison. | `@claim:json-roundtrip`; exact live demo result `$.report.chart`. |
| F-1-6 | Retained data-only viewer handling for hostile strings. | `@claim:viewer-does-not-execute-capsules`; no external request or script marker. |
| F-1-7 | Retained all six documented functions and declarations in both module formats. | `@claim:public-api-surface`; clean TypeScript consumer passed. |
| F-1-8 | Retained the v1 format marker acceptance and rejection checks. | `@claim:capsule-format-v1`. |
| F-1-9 | Retained separate recording and JSON transfer coverage. | `@claim:recording` and `@claim:json-roundtrip`. |
| F-1-10 | Kept the unverified merchant statement absent and removed all billing runtime copy. | `keeps operator-gated commerce out of every deployed document`; live link crawl found no billing URL. |
| F-1-11 | Retained destination-h1 focus and polite route announcements. | `moves focus to each destination heading after forward and back navigation`; repeated live root → Privacy → Back. |
| F-1-12 | Retained the dedicated raw `/demo/index.html` metadata. | `emits a dedicated raw demo document with demo social metadata`; live `/demo` title is `Demo — State Transition Capsule`. |
| F-1-13 | Retained canonical, Open Graph, and Twitter fields on the designed 404. | `404 publishes route-specific social metadata`; live missing route returned HTTP 404. |
| F-1-14 | Retained Demo, Viewer, API, and Privacy in the mobile header. | `all visible links and controls meet the 44px target without overflow`; live root screenshot. |
| F-1-15 | Retained the builder and version line in the mobile footer. | Same mobile layout test; live root screenshot shows `Built by Param Factory · v0.1.0`. |
| F-1-16 | Kept the README opening below the 22-word sentence cap. | `.factory/copy-audit.md`; longest opening sentence is 14 words. |
| F-1-17 | Standardized first-screen and result copy on run file, failed run file, and first changed field. | `.factory/copy-audit.md`; live `/demo` result now says `First changed field located`. |
| F-1-18 | Retained concrete wording for the newest retained transitions. | `@claim:bounded-retention`; live How it works section. |
| F-1-19 | Retained the explanatory instrument caption. | Live root screenshot; caption explains that the viewer marks the first changed field. |
| F-1-20 | Retained the operation-led six-function package heading. | Live root screenshot; `@claim:public-api-surface`. |
| F-1-21 | Replaced the former free/paid split with the exact shipped state: free viewer, no account, Studio registration unavailable. | `@claim:registration-unavailable`; live root availability panel. |
| F-1-22 | Retained **Copy code** and removed the no-longer-applicable paid Save action with the paid UI. | `copy code control includes its visible label in its accessible name`; live link/control crawl. |
| F-2-1 | Retained the tagged static output contract. | `@claim:site-build-output`; clean build contains home, demo, legal, 404, and deployment config. |
| F-2-2 | Retained only tested local tarball and output wording. | `keeps the review-2 build and tarball wording tied to tested claims`; README scan. |
| F-3-1 | Removed the dead checkout link, price claim, restore form, billing fetch, and paid retention control. Added a calm unavailable panel and a non-purchasing live crawler. | `@claim:registration-unavailable`; `keeps operator-gated commerce out of every deployed document`; `npm run test:links:live` reports 0 checkout links and HTTP 404 for the designed missing route; live screenshots. |
| Controller C-3-1 | Treated registration as operator-gated and narrowed the claim to the visible unavailable state plus a working account-free comparison. | Same claim test; CSP now limits `connect-src` to self; cold live request logs contain no off-origin request. |

## Verification

- Fresh clone: `/tmp/stc-polish3-clean.jve18G/clone` at `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89`; `npm ci` reported 0 vulnerabilities.
- Claims: all 20 commands from `.factory/claims.json` passed individually.
- Full suite: 14 unit/manifest tests, 11 artifact tests, 50 browser tests, and 2 production offline tests passed. The 2 development skips are the production-only offline cases.
- Package: `npm pack --json` produced a 9,433-byte tarball with 8 expected files.
- Accessibility: Playwright Axe found 0 serious/critical findings on root and demo at desktop and 390 px. Live `verify-url.sh` found 0 console errors, one h1, one main, `lang=en`, and no missing alt text.
- Privacy and offline: live cold flows made 0 off-origin requests; demo reset preserved a normal-storage marker and left no `demo:` key; live `/demo` reloaded offline with `$.report.chart` visible.
- Routing and links: live `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` passed; an unknown route returned the designed HTTP 404; 12 unique links were crawled with no dead checkout.
- Production identity: live root SHA-256 `e4c29bb149e106a079422ff2a25aeac31512c1a068eb34721301a7779a8c4e0c` and demo SHA-256 `8b173cd8b4eedd07611a8a15d9202d4d100ecabc1207616ae116d9a3e6bd83a6` exactly match `dist/site`.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, TBT 60 ms, CLS 0.00008.

Every finding from reviews 1–3 is resolved in the live release.
