# Verification 9 — State Transition Capsule

## Verdict: PASS

Verified candidate commit `5764ef3fb800e250ee9a067d7cd8f48cf93a77ee` at
<https://state-transition-capsule.sociobot.in/> on 2026-09-02. This was an
independent, read-only product verification; no product source was changed.

## Release evidence

- Started in a detached clean worktree at the candidate. `npm ci` completed
  with 0 vulnerabilities. All 20 commands declared by `.factory/claims.json`
  were run individually. Each claim's underlying test also passed in the
  complete unit, artifact, browser, and production-offline suites.
- `npm test` passed. The separate confirmation runs also passed:
  `npm run test:unit` (14 tests), `npm run test:artifacts` (11 tests),
  `npm run test:e2e` (56 desktop/mobile browser tests),
  `npm run test:e2e:production` (2 production service-worker/offline tests),
  `npm run typecheck`, `npm run lint`, `npm run build`, and
  `npm run test:links:live`.
- The artifact suite created a tarball, installed it offline into a fresh
  consumer, and imported its public API. It also exercised ESM, CommonJS,
  declarations, Node >=20 metadata, and the documented public exports.
  `npm pack --dry-run` reports an 8-file, 9.4 kB package.
- The production build writes `dist/site/`. Its gzipped primary JS is 6.47 kB,
  CSS is 5.20 kB, and shipped fonts total 72.03 kB. Lighthouse mobile run:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP
  1.7 s, CLS 0, TBT 60 ms, total transfer 165 KiB.

## Live deployment and first read

In a fresh browser context, the first screen says that it finds the state
change that broke the second run, names developers debugging repeat-run
failures as the audience, and offers **Try it with sample data** with the
plain consequence that it loads two samples in a separate demo. This satisfies
the cold first-read and one-click demo requirements.

The primary action loaded the isolated `/demo` view. It immediately displayed
the realistic two-run comparison and identified `$.report.chart` after
`chart.selected`. Reset demo restored the sample; Start for real returned to
`/`. A malformed JSON file showed the recovery instruction: “Export the run
file again, then choose the new file.” The 5 MB rejection and disabled compare
path are covered by the passing browser claim.

All 19 publicly served, non-source-map candidate build files matched the live
deployment byte-for-byte. `staticwebapp.config.json` is intentionally applied
by the host rather than publicly served; the observed headers confirm it is in
effect. No server-side product endpoint, sign-in path, checkout, billing call,
or rate-limited API exists in this release, so an API allowance/429 test is not
applicable.

## Privacy, accessibility, and resilience

- Fresh desktop and 390 px mobile `/demo` visits made eight requests, all
  same-origin `GET` requests. There were no telemetry, API, third-party, page,
  or console-error requests. Imported files stayed in the tab; the demo uses
  in-memory sample data and did not alter normal storage.
- `verify-url.sh` passed: HTTP 200, title, `lang=en`, exactly one `h1`, a
  `main` landmark, image alt coverage, and zero console errors. A fresh live
  axe scan on desktop and mobile found zero serious or critical violations.
  Keyboard checks confirmed the skip link receives first focus and Enter on
  the primary action opens the demo. Mobile had no horizontal overflow.
- With reduced motion emulated, result transition and animation durations were
  effectively zero (`0.00001s`). The live service worker activated and
  controlled the page; after going offline, `/demo` reloaded and still showed
  `$.report.chart` without errors.
- HTML uses `cache-control: public, must-revalidate, max-age=30`; hashed JS
  uses `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`.
  Observed security headers include HSTS, CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, Referrer-Policy, Permissions-Policy, and
  `X-Frame-Options: DENY`.

## Findings

None. The terminology, import recovery text, demo-storage documentation, and
initial-state grammar findings recorded in the preceding review are resolved by
this candidate.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:links:live
```

Then visit `https://state-transition-capsule.sociobot.in/demo` in a fresh
browser context and repeat the live request, offline-reload, keyboard, mobile,
and axe checks above.
