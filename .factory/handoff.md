# State Transition Capsule — polish 2 retry handoff

## Result

PASS. All findings in `.factory/review-1.md`, `.factory/review-2.md`, and the controller's mobile contrast review are resolved. The repaired static site is deployed at <https://state-transition-capsule.sociobot.in/>.

Repair commits: `28eaf31`, `ab51f86`, and `afda5ce`. Final deployment id: `5eedb156-9c6f-4fff-8a96-aa473424a462`.

## What changed

- Added the exact `site-build-output` claim and one tagged test. It removes `dist/site`, runs `npm run build:site` in production mode, and checks the home, demo, legal, 404, and deployment-config outputs.
- Removed the unproved “ready to publish” and factory-workflow statements. README now describes only the tested local tarball and build output.
- Updated the catalog line to: “Find the first changed state field between two recorded runs.” It starts with a verb and is 61 characters before the line break.
- Corrected the README copy audit and retained every round-1 demo, route, mobile, accessibility, privacy, package, and wording repair.
- Fixed a test-only environment leak found during clean-clone verification: the nested site build now forces production mode, so it cannot remove service-worker registration before offline tests.
- Darkened signal orange from `#B84329` to `#A93A22`. The demo and Studio CTAs measure 6.03:1 normally/focused and 7.76:1 hovered/pressed at 390×844.
- Added an exact mobile regression for both CTA colors and all four states, plus a targeted Axe `color-contrast` scan that requires zero violations and zero incomplete results.
- Added a manifest regression that ties both review-2 README fixes to `site-build-output` and `local-tarball-install`, and rejects the removed publishing-readiness wording.

The complete finding-to-evidence map is in `.factory/polish-2.md`. Live screenshots are in `.factory/evidence/polish-2/`.

## Verification

Fresh clone: `/tmp/stc-polish2-retry.12t9J0/clone` at `afda5ce`.

- `npm ci`: 100 packages installed, 0 vulnerabilities.
- Every command in the 20-entry `.factory/claims.json`: PASS individually.
- `npm test`: PASS — 14 unit/manifest tests, 10 artifact tests, 52 browser tests, and 2 production-offline tests. The 2 development-mode offline skips are intentional because that test requires the built production service worker.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- Playwright Axe checks: 0 serious or critical violations on `/` and `/demo` at desktop and 390 px. The targeted mobile CTA scan has 0 contrast violations and 0 incomplete results.
- `/opt/fleet/lib/verify-url.sh`: PASS on live `/` and `/demo`; both have a title, `lang=en`, one h1, one main, complete image alt text, labelled buttons, and 0 console errors. Evidence: [root](evidence/polish-2-retry/root/verify.json), [demo](evidence/polish-2-retry/demo/verify.json).
- Cold live browser check: first-screen copy, one-click `/demo`, direct `?demo=1`, reset/exit, isolation marker, editable output, route focus, mobile navigation/footer, 44 px targets, and the sticky demo boundary all PASS. Requests observed: 0 off-origin or non-GET; console/page errors: 0.
- Live routes: `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, and `sitemap.xml` return 200. An unknown path returns the designed 404 with route metadata.
- Live offline check: `/demo` reloaded offline with `$.report.chart` visible and 0 console/page errors.
- Deployment integrity: all 18 service-worker-listed files match the local `dist/site` bytes.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.68 s, CLS 0.0001, TBT 58 ms. Report: `/tmp/stc-polish2-retry-lighthouse.json`.
- Production assets: main JS 21.14 kB raw / 7.63 kB gzip; CSS 20.26 kB raw / 5.47 kB gzip; locally served fonts total 72.03 kB.
- `npm pack --json --dry-run`: `state-transition-capsule-0.1.0.tgz`, 9,384 bytes compressed, 46,112 bytes unpacked, 8 files. The claim suite also installs this tarball offline in a fresh consumer.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run dev
```

`npm run build` produces the npm package under `dist/package/` and the static site under `dist/site/`.

## Known gaps and next steps

None for the reviewed scope. Registry publication remains a factory-owner action; the product does not claim that the package is published.
