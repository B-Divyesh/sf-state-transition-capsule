# Polish round 4 — State Transition Capsule

**Review baseline:** `a0313f0a92dd2f0862244288a56de78f80dcdd0b`  
**Repair commit:** `5764ef3fb800e250ee9a067d7cd8f48cf93a77ee`  
**Deployment:** `ba865240-009a-4c43-882e-ce164d31bf72`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>

## Evidence key

- Root cold check and images: [verify JSON](evidence/polish-4/root/verify.json), [mobile screenshot](evidence/polish-4/root/screenshot-mobile.png).
- Demo cold check and images: [verify JSON](evidence/polish-4/demo/verify.json), [mobile screenshot](evidence/polish-4/demo/screenshot-mobile.png).
- Live functional, metadata, storage, mobile, and Axe check: [live-check.json](evidence/polish-4/live-check.json).
- Live offline reload: [live-offline.json](evidence/polish-4/live-offline.json).

Every listed claim command passed independently in fresh clone `/tmp/stc-polish4-clean.c5tZol/clone`. `npm test`, `npm run typecheck`, `npm run lint`, `npm pack --json`, and `npm run test:links:live` passed. The local browser suite contains 56 desktop/mobile tests; its production-offline suite contains two tests.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the mobile demo disclosure, Reset demo, and Start for real sticky and operable over the viewer. | Test: `keeps the demo disclosure and controls visible through the mobile comparison viewer`; live `/demo`; [demo mobile screenshot](evidence/polish-4/demo/screenshot-mobile.png). |
| F-1-2 | Kept the editable package playground with comparison, redaction, replay, and live JSON output. | Test: `runs editable package playground examples and updates output from edited JSON`; live `/demo`; [live check](evidence/polish-4/live-check.json). |
| F-1-3 | Retained the tested local-tarball install flow and no npm-registry install promise. | Claim: `@claim:local-tarball-install`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-4 | Retained scoped JSON-review and redaction guidance instead of a broad safety promise. | Claim: `@claim:json-roundtrip`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-5 | Retained the listed JSON transfer claim and fresh-context viewer import comparison. | Claim: `@claim:json-roundtrip`; live `/demo`; [live check](evidence/polish-4/live-check.json). |
| F-1-6 | Retained data-only handling for hostile run-file text. | Claim: `@claim:viewer-does-not-execute-capsules`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-7 | Retained all six documented functions and declarations in ESM and CommonJS. | Claim: `@claim:public-api-surface`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-8 | Retained versioned v1 run-file marker acceptance and rejection coverage. | Claim: `@claim:capsule-format-v1`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-9 | Retained separate recording and JSON transfer claims for the advertised free package. | Claims: `@claim:recording`, `@claim:json-roundtrip`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-10 | Kept unverified merchant copy and every billing link/request out of the release. | Test: `keeps operator-gated commerce out of every deployed document`; live crawler `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-11 | Retained focus transfer and polite announcement on same-site forward and back navigation. | Test: `moves focus to each destination heading after forward and back navigation`; live `/privacy/`; [live check](evidence/polish-4/live-check.json). |
| F-1-12 | Retained a raw `/demo/index.html` with Demo-specific title, canonical, Open Graph, and Twitter metadata. | Test: `emits a dedicated raw demo document with demo social metadata`; live `/demo`; [demo check](evidence/polish-4/demo/verify.json). |
| F-1-13 | Retained complete route metadata on the designed 404. | Test: `404 publishes route-specific social metadata`; live `/review-4-polish-missing` returned 404; [live check](evidence/polish-4/live-check.json). |
| F-1-14 | Retained all four header destinations in the mobile layout. | Test: `all visible links and controls meet the 44px target without overflow`; live `/`; [root mobile screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-15 | Retained the Param Factory and build-version line in the mobile footer. | Test: `all visible links and controls meet the 44px target without overflow`; live `/`; [root mobile screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-16 | Retained short, plain README opening sentences. | `.factory/copy-audit.md`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-1-17 | Replaced runtime “run file bay” with “run file” and the divergent-transition caption with a plain description. | Test: `uses established run-file terms in viewer messages and result descriptions`; live `/demo`; [live check](evidence/polish-4/live-check.json). |
| F-1-18 | Retained concrete retention wording about recent transitions. | Claim: `@claim:bounded-retention`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-19 | Retained the explanatory hero caption. | Test: `local routes load without console errors and keep required landmarks`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-20 | Retained the operation-led six-function package heading. | Claim: `@claim:public-api-surface`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-21 | Retained the honest free-release and registration-unavailable state. | Claim: `@claim:registration-unavailable`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-1-22 | Retained the explicit Copy code control and removed obsolete paid actions. | Test: `copy code control includes its visible label in its accessible name`; live `/`; [root screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-2-1 | Retained the claimed static-site output contract. | Claim: `@claim:site-build-output`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| F-2-2 | Retained only tested tarball and site-output wording in README. | Test: `keeps the review-2 build and tarball wording tied to tested claims`; live `/`; [root check](evidence/polish-4/root/verify.json). |
| C-2-1 | Retained the AA-safe orange primary action in every mobile interaction state. | Test: `mobile primary CTA keeps exact AA contrast in every interaction state`; live `/`; [root mobile screenshot](evidence/polish-4/root/screenshot-mobile.png). |
| F-3-1 | Retained removal of dead checkout and billing runtime behavior. | Claim: `@claim:registration-unavailable`; live crawler `/` found zero checkout links; [root check](evidence/polish-4/root/verify.json). |
| C-3-1 | Retained a local-only release with no account or off-origin billing/runtime call. | Claim: `@claim:no-telemetry-runtime`; live `/demo`; [live check](evidence/polish-4/live-check.json). |
| F-4-1 | Corrected README to say that sample run files stay in memory. Demo entry, reset, and exit now clear stale `demo:` keys from local and session storage. | Claim: `@claim:demo-isolation`; live `/demo` storage check found no sample entries, demo keys, or IndexedDB; [live check](evidence/polish-4/live-check.json). |
| F-4-2 | Replaced raw parser dumps with short JSON/schema/read recovery messages. | Test: `gives short recovery actions for malformed and incomplete run files`; live `/demo`; [live check](evidence/polish-4/live-check.json). |
| F-4-3 | Corrected the initial-state comparison heading to “The runs start from different states.” | Test: `describes unequal initial states with complete grammar`; live `/`; [live check](evidence/polish-4/live-check.json). |

## Post-deploy checks

- `verify-url.sh` passed for cold root and demo loads: 200 responses, route titles, `lang=en`, one h1, one main landmark, all image alt attributes, and zero console errors.
- Live Playwright Axe found zero serious or critical violations on `/demo`. Mobile `/demo` retained its banner controls without overflow.
- Live production offline reload restored the completed demo comparison with service-worker control; see [live-offline.json](evidence/polish-4/live-offline.json).
- `npm run test:links:live` found five routes, 12 unique links, zero checkout links, and the designed HTTP 404.
