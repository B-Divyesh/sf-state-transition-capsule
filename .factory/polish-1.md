# Polish 1 — adversarial-review repair evidence

**Candidate repaired:** `8e407b8924e725a2f25aac893df19c4d438aa971`  
**Repair commit:** `7b3b718fb1985b68aca5c1f478c13d27bbd02076`  
**Deployed URL:** <https://state-transition-capsule.sociobot.in/>  
**Live screenshots:** `/tmp/tmp.wRvAjUxDe8/screenshot-desktop.png`, `/tmp/tmp.wRvAjUxDe8/screenshot-mobile.png`

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the demo banner sticky at 390px, retained both controls, and applied a workbench scroll offset. | `keeps the demo disclosure and controls visible through the mobile comparison viewer`; live `/demo`, mobile screenshot. |
| F-1-2 | Added editable JSON playground that calls `createRecorder`, `stringifyCapsule`, `parseCapsule`, `compareCapsules`, and `replayCapsule`; it has Compare, Redaction, and Replay examples. | `runs editable package playground examples and updates output from edited JSON`; live `/demo`. |
| F-1-3 | Removed the unverified registry install command. README and site now describe the tested source-checkout tarball flow. | `@claim:local-tarball-install`; fresh consumer installs an offline tarball and imports it. |
| F-1-4 | Rewrote the broad safety promise as reviewable JSON plus a redaction instruction. | Landing copy audit; `@claim:json-roundtrip`. |
| F-1-5 | Registered JSON transfer as `json-roundtrip` and added a fresh-context browser import/comparison test. | `@claim:json-roundtrip`. |
| F-1-6 | Registered and tested the viewer’s data-only behavior with script-like payload strings, network recording, and a side-effect marker. | `@claim:viewer-does-not-execute-capsules`. |
| F-1-7 | Registered the documented six-function API and type declarations; the test loads ESM and CJS and type-checks a consumer. | `@claim:public-api-surface`. |
| F-1-8 | Registered the v1 media marker and tests serialization, parse acceptance, and unsupported-version rejection. | `@claim:capsule-format-v1`. |
| F-1-9 | Registered recording separately and made the free-feature sentence point only to fully claimed behavior. | `@claim:recording`, `@claim:json-roundtrip`, `@claim:redaction`, `@claim:pure-replay`. |
| F-1-10 | Removed the unverified merchant-of-record statement from landing, Privacy, and Terms copy. | `rg` copy audit; live `/`, `/privacy/`, `/terms/`. |
| F-1-11 | Added route announcers and same-site forward/back heading focus without stealing initial Tab focus. | `moves focus to each destination heading after forward and back navigation`; live mobile focus check. |
| F-1-12 | Build now emits a dedicated `/demo/index.html` with raw Demo title, canonical, OG, and Twitter metadata; static routing serves it. | `emits a dedicated raw demo document with demo social metadata`; live `/demo` raw response. |
| F-1-13 | Added canonical, Open Graph, and Twitter metadata to the designed 404 document. | `404 publishes route-specific social metadata`; live unknown-route `404`. |
| F-1-14 | Mobile header keeps Demo, Viewer, API, and Privacy in a compact wrapping navigation row. | `all visible links and controls meet the 44px target without overflow`; live 390px root check. |
| F-1-15 | Footer build line remains visible and wraps on mobile. | Same mobile layout test; live 390px footer check. |
| F-1-16 | Rewrote the README opening into short, plain sentences. | `.factory/copy-audit.md`. |
| F-1-17 | Standardized visitor copy on run file, failed run file, first changed field, and comparison viewer. | `.factory/copy-audit.md`; live root. |
| F-1-18 | Replaced “bounded evidence” with an explanation of retained transitions. | `.factory/copy-audit.md`; live root. |
| F-1-19 | Replaced the hero slogan with an explanation of the comparison image. | `.factory/copy-audit.md`; live root screenshot. |
| F-1-20 | Replaced the abstract API heading with the six available operations. | `.factory/copy-audit.md`; live root. |
| F-1-21 | Replaced “complete” marketing copy with a concrete free/Studio split. | `.factory/copy-audit.md`; live root. |
| F-1-22 | Removed the vague install Copy action and renamed the history action to **Save case**. | `copy code control includes its visible label in its accessible name`; `@claim:license-restore`. |

## Verification

- Fresh local clone: `npm ci` passed with 0 vulnerabilities, then every one of the 19 commands in `.factory/claims.json` passed verbatim.
- Full local suite: `npm test` passed: 13 unit/manifest tests, build, 9 artifact tests, 50 browser tests with 2 intentional development skips, and 2 production offline tests.
- Accessibility: browser Axe integration found no serious or critical violations on `/` and `/demo` at desktop and mobile. `/opt/fleet/lib/verify-url.sh` passed live `/demo`: title, `lang`, one `h1`, main landmark, alt text, and zero console errors.
- Live routes: `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` return 200; an unknown route returns the designed 404 with status 404.
- Live performance: Lighthouse mobile scored Performance **100** and Accessibility **100** at the production root (`LCP 0.2 s`, `CLS 0`, `TBT 0 ms`), report `/tmp/stc-lighthouse.json`.
