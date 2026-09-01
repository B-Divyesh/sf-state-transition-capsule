# Polish 2 — adversarial-review repair evidence

Candidate repaired: `5099aa3310dad5639c0d89d135928ea727a202cb`  
Review baseline: `5ad3ca006861b6cb1d56a854af1688c5c2268765`  
Repair commits: `28eaf31`, `ab51f86`  
Deployed URL: <https://state-transition-capsule.sociobot.in/>  
Deployment id: `098e50bc-4905-4836-b91f-f8c6b8a44c9b`

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the demo notice sticky with Reset and Start for real visible over the mobile comparison viewer. | `keeps the demo disclosure and controls visible through the mobile comparison viewer`; [mobile workbench](evidence/polish-2/live-demo-mobile.png); live `/demo` at 390×844 and `scrollY=1253`. |
| F-1-2 | Kept the editable JSON playground wired to the shipped recorder, parser, comparison, redaction, and replay functions. | `runs editable package playground examples and updates output from edited JSON`; [desktop demo](evidence/polish-2/live-demo-desktop.png); live `/demo` changed `line` to `area`. |
| F-1-3 | Kept registry install copy removed and documented the verified source tarball flow. | `@claim:local-tarball-install`; clean offline install in a fresh consumer. |
| F-1-4 | Kept the broad safety claim replaced by JSON review and redaction guidance. | `.factory/copy-audit.md`; `@claim:json-roundtrip`; live root copy check. |
| F-1-5 | Kept JSON portability inventoried and tested end to end. | `@claim:json-roundtrip`; fresh browser-context import produces `$.report.chart`. |
| F-1-6 | Kept the viewer text-as-data promise inventoried and tested with hostile strings. | `@claim:viewer-does-not-execute-capsules`; 0 external requests and no script marker. |
| F-1-7 | Kept all six public functions and declarations covered in ESM and CommonJS. | `@claim:public-api-surface`; fresh TypeScript consumer type-check. |
| F-1-8 | Kept the v1 media marker explicitly covered. | `@claim:capsule-format-v1`; acceptance and unsupported-marker rejection pass. |
| F-1-9 | Kept recording and JSON import/export split into listed claims. | `@claim:recording`, `@claim:json-roundtrip`; all 20 manifest commands pass. |
| F-1-10 | Kept the unverified merchant statement removed. | Copy scan of landing, Privacy, and Terms; live route check. |
| F-1-11 | Kept destination-h1 focus and polite route announcements for forward/back navigation. | `moves focus to each destination heading after forward and back navigation`; repeated on live root → Privacy → Back. |
| F-1-12 | Kept a real `/demo/index.html` with route-specific raw metadata. | `emits a dedicated raw demo document with demo social metadata`; live raw `/demo` title, canonical, OG, and Twitter fields. |
| F-1-13 | Kept complete metadata on the designed 404. | `404 publishes route-specific social metadata`; live unknown route returns 404 and “Page not found — State Transition Capsule”. |
| F-1-14 | Kept Demo, Viewer, API, and Privacy visible in the 390 px header. | `all visible links and controls meet the 44px target without overflow`; live mobile cold check. |
| F-1-15 | Kept the builder and version line visible in the mobile footer. | Same mobile target/overflow test; live text “Built by Param Factory · v0.1.0”. |
| F-1-16 | Kept the README opening split into short plain sentences. | `.factory/copy-audit.md`; longest opening sentence is 14 words. |
| F-1-17 | Kept one vocabulary: run file, failed run file, first changed field, comparison viewer. | `.factory/copy-audit.md`; live root and demo read-through. |
| F-1-18 | Kept retention wording concrete about newest transitions. | `@claim:bounded-retention`; live How it works copy. |
| F-1-19 | Kept the hero caption explanatory. | [desktop root](evidence/polish-2/live-root-desktop.png); live caption says the viewer marks the first changed field. |
| F-1-20 | Kept the API heading concrete and operation-led. | [desktop root](evidence/polish-2/live-root-desktop.png); live Package contents section. |
| F-1-21 | Kept the free/Studio split concrete and scoped. | `@claim:license-restore`, `@claim:studio-price`; live Studio section. |
| F-1-22 | Kept result-naming controls: Copy code and Save case. | `copy code control includes its visible label in its accessible name`; `@claim:license-restore`. |
| F-2-1 | Added an exact manifest entry and tagged regression for `npm run build:site` writing `dist/site`. The test removes the directory, builds in production mode, and checks all route artifacts plus deployment config. | `@claim:site-build-output`; clean-clone selector and full artifact suite pass. |
| F-2-2 | Removed “ready to publish” and factory-workflow outcome claims. Kept only the tested local tarball and site-output wording. | README scan; `@claim:local-tarball-install`; `.factory/copy-audit.md`. |

## Complete verification

- Clean clone `/tmp/stc-polish2-final.fKFE94`: all 20 claim commands PASS individually.
- Full clean-clone suite: 13 unit/manifest, 10 artifact, 50 browser, and 2 production offline tests PASS; typecheck and lint PASS.
- Browser suite includes Axe at desktop/mobile, keyboard operation, 44 px targets, no overflow, privacy request logs, hostile-input non-execution, real routing/focus, metadata, demo isolation, and offline reload.
- Live `verify-url.sh` reports are [root](evidence/polish-2/root/verify.json) and [demo](evidence/polish-2/demo/verify.json); both report 0 console errors.
- Live cold browser check recorded 0 off-origin/non-GET runtime requests and 0 console/page errors.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.8 s, CLS 0, TBT 30 ms.

No finding from either review remains open.
