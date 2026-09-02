# State Transition Capsule — review 4 handoff

## Result

**FAIL** for candidate `a0313f0a92dd2f0862244288a56de78f80dcdd0b` at <https://state-transition-capsule.sociobot.in/>. The full adversarial record is in `.factory/review-4.md`. No product code was modified.

## Verified

- Fresh mobile and desktop contexts passed the cold first-screen check.
- The one-click demo loaded realistic sample runs and found `$.report.chart`; Reset and Start for real preserved normal storage and cleared demo storage.
- All 20 declared claim commands passed independently from a clean clone.
- `npm test`, `npm run typecheck`, `npm run lint`, and `npm run test:links:live` passed.
- Live offline reload, same-origin-only request logging, route metadata, h1 focus, designed 404, Axe, and `verify-url.sh` checks passed.
- Nineteen public files from the clean build matched the live deployment byte-for-byte.

## Open findings

- `F-1-17` (blocking): runtime copy still uses “run file bay” and “divergent transition,” regressing the established terminology.
- `F-4-1` (high): README says sample files use `demo:` storage, but the implementation keeps them only in memory.
- `F-4-2` (medium): malformed and wrong-schema import errors omit a recovery action; the schema error is 51 words.
- `F-4-3` (minor): the initial-state result says “different state” instead of “different states.”

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:links:live
```

Then repeat the live mobile import-error, demo-storage, route-focus, request-log, and offline checks described in `.factory/review-4.md`.
