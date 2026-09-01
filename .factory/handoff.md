# State Transition Capsule — review 3 handoff

## Result

**FAIL.** This review changed no product code. It added the required independent review record at `.factory/review-3.md` and found one blocking production defect: the visible **Buy Studio in hosted checkout** link returns HTTP 404 with `{"error":"enabled factory product","status":404}`.

## What was verified

- Fresh live browser contexts at 390 × 844 and 1440 × 900 passed the cold first-read gate.
- The one-click `/demo` flow immediately showed the realistic `$.report.chart` divergence. Its banner, reset action, and normal-storage isolation passed at mobile and desktop sizes.
- A fresh clone at `/tmp/stc-review3-clone.sUQHsu` ran all 20 `.factory/claims.json` commands successfully, then passed `npm test`, `npm run typecheck`, and `npm run lint`.
- Root, demo, legal, 404, owned assets, robots, sitemap, and GitHub links were crawled successfully. The hosted checkout was the one failed link.
- Prior findings F-1-1 through F-1-22 and F-2-1 through F-2-2 were rechecked live and in current source/tests; none regressed.

## Remaining work

Configure or replace `https://api.sociobot.in/api/v1/products/state-transition-capsule/checkout` so the Studio CTA reaches a real checkout. Add a non-purchasing deployment link-integrity test that accepts only a successful checkout response or expected redirect. Rerun review 3 after deployment.

## Review locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
```

The detailed evidence and exact reproduction are in `.factory/review-3.md`.
