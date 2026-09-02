# State Transition Capsule — verification 10 handoff

## Result: PASS

Independent QA passed for candidate
`98c72c2fcb97355bf7c6b1834a8fea70f952787a` at
<https://state-transition-capsule.sociobot.in/> on 2026-09-02. The deployment
matches all 19 public candidate build files byte-for-byte.

## Verification summary

- All 20 mandatory claims in `.factory/claims.json` passed from a clean
  checkout, including demo isolation, local processing, offline reload,
  retention, redaction, package formats, local tarball installation, and the
  5 MB input boundary.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`,
  `npm pack --json`, and `npm run test:links:live` passed.
- The packed library installed offline in a fresh consumer and its documented
  public ESM and CommonJS API worked.
- Fresh live traffic was same-origin GET-only, with no telemetry, API,
  third-party, checkout, sign-in, page, or normal-route console errors.
- Live browser QA passed desktop, 390 px mobile, keyboard, visible skip/focus
  route, reduced motion, invalid JSON recovery, 5 MB plus one byte rejection,
  demo storage isolation, and service-worker offline reload.
- Live axe found zero serious/critical findings on the normal and 404 routes.
  Fresh mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best
  Practices, and 100 SEO (489 ms LCP; 168,904 bytes transfer).

There are no known defects or remaining product tasks. The detailed evidence,
exact commands, first-read result, headers, cache policy, and applicability
notes are in [verification-10.md](verification-10.md). Do not publish the npm
package from this checkout; `npm pack` creates the verified release tarball.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack --json
npm run test:links:live
```
