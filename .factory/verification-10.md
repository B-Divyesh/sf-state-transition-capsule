# Verification 10 — State Transition Capsule

## Verdict: PASS

Verified candidate commit `98c72c2fcb97355bf7c6b1834a8fea70f952787a` at
<https://state-transition-capsule.sociobot.in/> on 2026-09-02. This was an
independent verification. Product source was not changed.

## Required claims

`.factory/claims.json` is present and declares 20 claims. From this clean
candidate checkout, after `npm ci`, I ran every declared `test` command in
manifest order through the demo entry point where applicable. All passed:

- `first-divergence`, `demo-isolation`, `local-processing`, `offline-reload`,
  `redaction`, `pure-replay`, `bounded-retention`, and `package-formats`.
- `site-build-output`, `tab-local-storage`, `no-telemetry-runtime`,
  `registration-unavailable`, `recording`, `json-roundtrip`, and
  `viewer-does-not-execute-capsules`.
- `public-api-surface`, `capsule-format-v1`, `local-tarball-install`,
  `node-20`, and `file-size-limit`.

The claim runner reached its final check without an error. The independent
full `npm test` run also passed: 14 unit/manifest tests, 11 build-artifact
tests, 56 development browser tests, and the two production offline tests.

## Local package and build checks

- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm pack --json`:
  PASS.
- The packed package contains eight files, is 9,423 bytes, has no runtime
  dependencies, and ships ESM, CommonJS, and declarations.
- In a new temporary consumer, I packed this candidate, installed the tarball
  with `npm install --offline`, then exercised `createRecorder`,
  `stringifyCapsule`, `parseCapsule`, `validateCapsule`, `compareCapsules`, and
  `replayCapsule` through ESM. CommonJS exports were separately loaded and
  checked. Both passed.
- The static build emits `dist/site/`. Its initial JavaScript is 6.91 kB gzip
  (6.47 kB main plus 0.44 kB shared), CSS is 5.20 kB gzip, and local fonts
  total 72.03 kB. These are within the stated static budgets.

## Cold live first read and end-to-end behaviour

In a new browser context, the first screen says: “Find the state change that
broke the second run.” It says this is “For developers debugging repeat-run
failures,” and the first action is **Try it with sample data**, with the plain
consequence “Loads two sample runs in a separate demo.” It therefore answers
what the product does, who it is for, and what to click first in plain words.

Clicking it opened `/demo` and immediately compared the bundled runs. It
reported the first difference after `chart.selected` at `$.report.chart`:
`"bar"` versus `"line"`. The persistent banner says “Demo — sample data,
nothing is saved,” and Reset demo and Start for real both work.

Additional live exercises passed:

- A bad JSON file reports: “Export the run file again, then choose the new
  file.” A 5 MB plus one byte input reports the local safety limit and leaves
  Compare disabled. Two subsequently imported valid capsule files compare to
  `$.report.chart`.
- A seeded normal local-storage marker survived demo entry, reset, and exit;
  no `demo:` keys remained after reset or exit.
- A service-worker-controlled `/demo` reloaded while offline and still showed
  `$.report.chart`, without page or console errors.
- Keyboard-only use begins at the visible Skip to main content link; Tab reaches
  the sample action and Enter opens the demo. At 390 px the page has a
  390 px scroll width (no horizontal overflow) and the demo controls remain
  available. Reduced-motion computed transition and animation durations are
  `0.00001s`.

## Privacy, accessibility, deployment, and performance

- Fresh root and demo traffic consisted only of same-origin `GET` document,
  asset, font, image, and service-worker requests. There were no telemetry,
  API, third-party, checkout, sign-in, page, or normal-route console errors.
  This confirms the local-processing and no-telemetry promises from fresh live
  evidence.
- Live axe scans found zero serious or critical violations on `/`, `/demo`,
  `/privacy/`, `/terms/`, and the designed 404 page. The four normal routes
  are HTTP 200 with `lang=en`, one `h1`, one `main`, appropriate route titles,
  and no console errors. The designed missing route correctly returns HTTP 404;
  its navigation status is the browser's expected failed-resource console
  message, not application JavaScript error.
- Headers on the live root include CSP (`frame-ancestors 'none'`), HSTS,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  Referrer-Policy, and Permissions-Policy. HTML uses
  `public, must-revalidate, max-age=30`; hashed assets are immutable for one
  year; `sw.js` is `no-cache`.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 489 ms, CLS 0.000082, TBT 0 ms, transfer 168,904 bytes.
- `npm run test:links:live` passed: five routes, 12 unique links, no checkout
  links, and an HTTP 404 for a missing route.
- After rebuilding the candidate, all 19 public non-source-map build files
  matched the deployed files byte-for-byte. The host-applied
  `staticwebapp.config.json` was excluded from that download comparison; its
  expected headers were observed live.

This release has no product server-side endpoint, billing/unlock call, or
sign-in flow. A documented per-client API allowance / 429 check and the Entra
tenant check are therefore not applicable.

## Defects by severity

None.

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

Then visit <https://state-transition-capsule.sociobot.in/demo> in a fresh
browser context and repeat the demo, request-boundary, offline, and keyboard
checks above.
