# State Transition Capsule — polish round 3 handoff

## Result

**PASS.** The operator-gated Studio checkout is no longer presented as a working purchase. The released site shows a calm registration-unavailable state, makes no billing request, and keeps the complete free comparison flow available without an account.

## What changed

- Removed the dead checkout URL, `$39` price claim, license restore form, billing verification code, paid retention control, and external API allowance from CSP.
- Rewrote the first-screen fact line, availability panel, README, Privacy, and Terms to match observable behavior.
- Standardized visible result wording on **first changed field** and **failed run file**.
- Replaced the commercial claim with `@claim:registration-unavailable` and added `@claim:file-size-limit` for the existing quantitative 5 MB error.
- Added `npm run test:links:live`, which crawls published links without purchasing, rejects any checkout link, and verifies the designed 404.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, claims, changelog, and round-3 evidence.

## Exact verification

- Repair commit: `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89`, pushed to `origin/main`.
- Clean clone: `/tmp/stc-polish3-clean.jve18G/clone`; `npm ci` completed with 0 vulnerabilities.
- All 20 commands in `.factory/claims.json` passed individually.
- `npm test`: 14 unit/manifest, 11 artifact, 50 browser, and 2 production offline tests passed. Two development-mode offline cases were intentionally skipped before their production run.
- `npm run typecheck` and `npm run lint` passed.
- `npm pack --json`: 9,433 bytes packed, 46,274 bytes unpacked, 8 files.
- Live root and demo `verify-url.sh`: HTTP 200, zero console errors, `lang=en`, one h1, one main, no missing alt text, and no unlabeled button.
- Live Axe smoke checks: zero serious or critical findings at 1440 × 900 and 390 × 844.
- Live link crawl: 12 unique links, 0 checkout links, all fetched destinations successful, unknown route HTTP 404 with the designed page.
- Live privacy check: zero off-origin requests during root and demo flows; no billing request; demo reset left normal storage intact and removed demo keys.
- Live offline check: activated service worker controlled `/demo`; an offline reload retained the sample result.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, TBT 60 ms, CLS 0.00008.

## Deployment

- Command: `/opt/fleet/lib/deploy-static.sh state-transition-capsule dist/site`
- Product resource: `sf-state-transition-capsule` only.
- Deployment id: `3c092f09-4ef6-444b-a0cc-bcea3229cdec`.
- Live URL: <https://state-transition-capsule.sociobot.in/>
- Live root and demo bytes exactly match the tested build.

## Known gaps and next steps

No release finding remains. Studio registration is intentionally unavailable because product registration is operator-gated. A future authorized release must register the product and prove the hosted checkout before restoring any purchase action or price claim. The npm package is ready to pack but was not published, as required by the library publishing contract.

Detailed finding evidence is in `.factory/polish-3.md`. Local and live screenshots are under `.factory/evidence/polish-3/`.
