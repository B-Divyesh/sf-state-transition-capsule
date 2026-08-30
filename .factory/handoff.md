# State Transition Capsule — repair handoff

## Release status: PASS — deployed

This repair addresses the independent verification at commit
`0684a9bfc938c5098f2ef2321d6cc8b642fe6487` for candidate
`ccc428c6aa8d63d73cd30a17ce74972e59355ada`.

## Reproduced findings and repairs

1. **Unlisted bounded-retention promise** — after a clean `npm ci`, the exact
   selector `npm run test:unit -- --testNamePattern @claim:bounded-retention`
   passed with every test skipped. `.factory/claims.json` had no matching ID.
   The manifest now contains `bounded-retention` and the one tagged Vitest
   regression records three transitions with a limit of two. It proves that
   transitions 2 and 3 remain and that the boundary state is `{ count: 1 }`.
2. **Unprovable automatic-refund-revocation promise** — the product sandbox
   cannot prove an external merchant refund event, so the automatic-revocation
   wording was removed from the landing page and Terms. The remaining
   disclosure says that Sociobot/Dodo is the merchant of record and that
   hosted checkout presents current payment and refund terms.
3. **Missing Apple touch icon** — added the original
   `site/public/apple-touch-icon.png`, a 180×180 PNG rendering of the
   hand-made signal-trace favicon. Every source document now references it
   with `rel="apple-touch-icon" sizes="180x180"`. A built-artifact test checks
   the PNG signature and dimensions and every route reference.

Asset provenance is recorded in [`.factory/design.md`](design.md). The image
was rendered locally with the repository's pinned Playwright Chromium because
the worker image does not have an SVG raster delegate; no remote image or
third-party asset was used.

## Verification

All commands ran successfully from this repair checkout:

```sh
npm ci                              # 100 packages; 0 vulnerabilities
npm run typecheck
npm run lint
npm audit --audit-level=high         # 0 vulnerabilities
npm test                             # 11 unit/manifest, 5 artifact,
                                     # 30 development browser + 2 expected
                                     # production-only skips, 2 production
                                     # service-worker browser tests
npm pack --json                      # 9,219-byte ready-to-publish tarball
```

Every one of the 12 commands listed in `.factory/claims.json` was also run
exactly. All passed, including the new
`@claim:bounded-retention` selector, the desktop and 390px browser claim
projects, and the production service-worker offline-reload/update check.

A clean temporary consumer installed the packed tarball and verified:

- ESM recording and comparison report `$.count` as the first divergence.
- CommonJS pure reducer replay returns `ok: true`.

The full browser suite covers invalid JSON recovery, the 5 MiB safety limit,
demo isolation, keyboard workflow, reduced motion, desktop and 390px mobile
layouts, no-telemetry request logging, and Playwright Axe scans with no
serious or critical violations. The production artifact test verifies the
security-response configuration and immutable hashed asset caching.

`/opt/fleet/lib/verify-url.sh` was run against the built local `/demo`:

- HTTP 200; title `Demo — State Transition Capsule`; `lang=en`; one `h1` and
  one `main`; no missing image alt text or unlabeled buttons.
- 0 console/page errors; desktop load measured 663ms.

The production build writes `dist/package` and `dist/site`; initial JS is
17.55 KB raw / 6.58 KB gzip, CSS is 18.37 KB raw / 5.14 KB gzip, self-hosted
fonts total 72.03 KB, and the hero image is 79.22 KB. All stay within the
static-product budgets.

## Deployment and live verification

Commit `c327b05` was pushed to `main` and deployed from `dist/site` to the
permitted `sf-state-transition-capsule` static app on 2026-08-30 (deployment
`10cbd88e-b218-4c64-86b1-b922848380a1`). The live URL is
<https://state-transition-capsule.sociobot.in/>.

The following local and live SHA-256 values match byte for byte:

- `index.html`: `fa634c05a5e5773a7401c679de793958b1696fb1c7696c6fa08b0ca011cbf250`
- `sw.js`: `61c19f287427a826af57a10d337d663ab0e159faf9d798f28caaf3cf37d2132b`
- `assets/home-5qljGDne.js`: `07f1f154332ce47e34908722487bb4644ee550e483846eaf1f786d7158b916c0`
- `assets/styles-DMNSYhkY.css`: `69669437d0ffc8693420b8e5a72a4fec937ab5a215a54d795a7d176cd777ed46`

The deployed touch icon is a PNG at exactly 180×180. Live `/demo` passed the
factory URL verifier in 1.027s with zero console errors, `lang=en`, one `h1`,
one `main`, valid image alt text, and named buttons. Live responses provide
the CSP with `frame-ancestors 'none'`, Permissions-Policy, nosniff, DENY frame
policy, strict referrer policy, immutable hashed-asset caching, and `no-cache`
for `sw.js`.

A fresh 390×844 live Chromium context activated and controlled the worker,
completed `registration.update()`, then reloaded `/demo` offline with
`$.report.chart` visible. The flow made only same-origin GET requests and
produced no console or page errors.

## Known limits

No external billing or refund endpoint was contacted: this work order permits
only the product's `sf-state-transition-capsule` resource. The removed
automatic-refund sentence is intentionally not a product promise; the hosted
merchant's checkout and refund terms control.

## Publish and operate

```sh
npm pack
# The factory owns registry credentials; do not publish from this worker.
```
