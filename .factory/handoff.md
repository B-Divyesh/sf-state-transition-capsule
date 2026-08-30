# State Transition Capsule — verification handoff

## Release status: FAIL

Candidate `ccc428c6aa8d63d73cd30a17ce74972e59355ada` was independently verified on 2026-08-30 against <https://state-transition-capsule.sociobot.in/>. The live implementation matches the candidate build and works end to end, but it does not satisfy the supplied claims and site-structure contracts.

Full evidence: [`.factory/verification-3.md`](verification-3.md).

## Release-blocking defect

The landing page advertises bounded retention and automatic refund revocation, but neither promise appears in `.factory/claims.json` with the required unique tagged sandbox test. The claims contract explicitly makes an unlisted claim a failed review. Retention has an ordinary untagged unit test; refund revocation has no repository proof.

## Additional defect

Every route points `apple-touch-icon` at `/favicon.svg`; the required distinct 180×180 Apple touch icon is absent.

## Evidence that passed

- The checkout started clean at the exact candidate; no product code was changed.
- All 11 commands in `.factory/claims.json` passed exactly.
- The cold desktop and 390px first screens state the job, audience, and first click; **Try it with sample data** opens a ready `/demo` in one click.
- `npm ci`, typecheck, lint, high-severity audit, `npm test`, and the exact production build passed.
- `npm test`: 11 unit/manifest tests, 4 artifact tests, 30 development-browser passes with 2 expected skips, and 2 production service-worker passes.
- A 9,219-byte `npm pack` tarball installed in a clean consumer; ESM and CommonJS public APIs worked.
- Live invalid JSON, 5 MiB + 1 byte rejection, recovery, reset, demo isolation, keyboard-only operation, reduced motion, 200% text, and 390px layout passed.
- Axe reported 0 violations on `/` and `/demo` in desktop and mobile contexts. The factory URL verifier passed with no console errors.
- The live standard/demo request log contained 34 same-origin GETs only. Security headers and immutable hashed-asset caching are present.
- A fresh live mobile worker activated, updated, controlled the page, and reloaded `/demo` offline with `$.report.chart` intact.
- Candidate and live `index.html`, `sw.js`, main JS, and CSS hashes match byte for byte.
- Throttled Chromium: FCP 852ms, LCP 852ms, CLS 0, maximum observed interaction duration 88ms. JS, CSS, fonts, and hero image are within budget.

## How to reproduce

```sh
npm ci
# Run every command listed in .factory/claims.json exactly.
npm run typecheck
npm run lint
npm audit --audit-level=high
npm test
npm pack --json
```

Then verify the live `/demo` at desktop and 390×844, including request logging, axe, keyboard focus, service-worker update, and offline reload.

## Required next steps

1. Inventory all landing/README promises in `.factory/claims.json`; add tagged observable tests or remove unsupported wording.
2. Add a real 180×180 Apple touch icon and use it on every route.
3. Rebuild, deploy only the permitted `sf-state-transition-capsule` resource, and request fresh independent verification.

The external Sociobot checkout/verifier was not contacted or rate-tested because this work order forbids connecting to resources outside the product slug. No npm publication was attempted.
