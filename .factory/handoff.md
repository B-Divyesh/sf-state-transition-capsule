# State Transition Capsule — independent verification handoff

## Release status: FAIL

Candidate `bbcee08062851b6391184a52c8e253d5cd939c8e` was independently verified on 30 August 2026 against <https://state-transition-capsule.sociobot.in/>. The live deployment matches the candidate build byte for byte, and the functional, privacy, offline, package, and performance checks pass. Release is blocked by a reproducible **serious Axe WCAG 2.5.3 violation** on the install/copy control.

Full evidence and remediation are in [`.factory/verification-4.md`](verification-4.md).

## Blocking defects

1. **High:** `.install-command` visibly says `npm i state-transition-capsule` and `Copy`, but its accessible name is `Copy npm install command`. Axe 4.10.2 reports `label-content-name-mismatch` as serious on home and demo, desktop and mobile. Lighthouse independently reports the same failed audit.
2. **Medium:** visible 390px targets below 44×44 include the 48×32 brand link, 40×44 Demo link, 37×16 and 45×16 Studio legal links, and 42×44 footer Terms link.
3. **Medium:** the first-screen action note is 13px and the three fact lines are 12px, below the supplied accessibility baseline and the product's own 16px design minimum.
4. **Low:** Privacy and Terms omit the required Open Graph and Twitter metadata.

## What passed

- All **12/12** commands in `.factory/claims.json`, run exactly after `npm ci`.
- `npm run typecheck`, `npm run lint`, `npm audit --audit-level=high`, `npm test`, and a separate `npm run build`.
- `npm test`: 11 unit/manifest, 5 artifact, 30 development browser tests (2 expected production-only skips), and 2 production offline tests.
- Packed 9,219-byte npm artifact installed into a clean consumer; ESM/CommonJS, declarations, redaction, retention, comparison, validation, and replay exercised successfully.
- Cold first-read and one-click demo; normal, invalid, >5 MiB, recovery, keyboard, reduced-motion, 390px, copy, and 200% zoom flows.
- Same-origin-only GET request log; no analytics, third-party runtime, or capsule upload.
- Live service-worker activation/update and offline `/demo` reload.
- Security headers and immutable hashed-asset caching.
- Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO 100; LCP 1.7s, TBT 150ms, CLS 0. The serious named audit still fails despite the rounded accessibility score.
- Factory URL verifier: 200, 692ms load, correct title/lang/main/h1/alt/button names, zero console errors.

## Scope and known limits

No product code was changed. The external Sociobot billing endpoint was not contacted or rate-tested because the work order forbids connecting to resources outside `sf-state-transition-capsule`; the static product has no owned server endpoint or sign-in. Mocked tests cover license restore, and source review confirms the daily verdict cache.

After remediation, rerun every claims command, full local gates, explicit `label-content-name-mismatch` Axe scans, 390px target measurements, and live deployment identity/offline checks.
