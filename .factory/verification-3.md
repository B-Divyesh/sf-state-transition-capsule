# Independent verification 3 — FAIL

**Work order:** `state-transition-capsule-verify-3`  
**Candidate:** `ccc428c6aa8d63d73cd30a17ce74972e59355ada`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 2026-08-30 UTC from the clean checkout at `/work/repo`.

## Verdict

**FAIL — visitor-facing promises remain outside the mandatory claims manifest.** All 11 commands that are present in `.factory/claims.json` pass, and the implementation works end to end, but the supplied claims contract also requires every promise on the landing page and README to be listed and sandbox-tested. At least two concrete promises are not. A separate required-site-metadata defect is also present.

No product code was modified during verification.

## Release-blocking finding

### High — advertised retention and refund behavior are unlisted claims

The landing page promises:

- `Set a transition limit for bounded evidence.` (`site/index.html:135`)
- `A refunded license is revoked automatically.` (`site/index.html:177`, repeated in `site/terms/index.html:30`)

Neither promise has an entry in `.factory/claims.json`, so neither has the required unique `@claim:<id>` sandbox test. Retention does have an ordinary unit test (`folds old transitions into the retention boundary`), which supports the implementation, but the test is not in the claims manifest and has no claim tag. Automatic refund revocation has no repository sandbox proof.

The claims contract says any visitor-facing claim without a manifest entry is a release-blocking finding. Add a tagged, observable claim test for bounded retention. Remove or narrow the automatic-refund statement unless it can be proven in the permitted sandbox.

## Other finding

### Medium — required 180px Apple touch icon is absent

The home, Privacy, Terms, and 404 pages all declare:

```html
<link rel="apple-touch-icon" href="/favicon.svg" />
```

Only the SVG favicon is shipped. The site-structure contract requires an SVG favicon plus a distinct 180px Apple touch icon. Add an original 180×180 raster touch icon and point every route at it.

## Mandatory claims gate

I ran every command exactly as listed after `npm ci`. Result: **11/11 passed**.

| Claim | Result | Evidence |
| --- | --- | --- |
| `first-divergence` | PASS | 2 Playwright projects passed; `/demo` reported `$.report.chart` after `chart.selected`. |
| `demo-isolation` | PASS | 2 projects passed; independent live reset preserved a normal-data marker and left no `demo:` keys. |
| `local-processing` | PASS | 2 projects passed. |
| `offline-reload` | PASS | Exact build plus 2 production projects passed. |
| `redaction` | PASS | Tagged Vitest passed. |
| `pure-replay` | PASS | Tagged Vitest passed. |
| `package-formats` | PASS | Exact build plus tagged artifact test passed. |
| `license-restore` | PASS | 2 mocked-license Playwright projects passed. |
| `tab-local-storage` | PASS | 2 Playwright projects passed. |
| `no-telemetry-runtime` | PASS | 2 Playwright projects passed. |
| `studio-price` | PASS | 2 Playwright projects passed. |

## First-read and demo result

The cold live first screen passes the plain-words/demo gate on desktop and 390×844 mobile:

- **What it does:** “Find the state change that broke the second run.”
- **For whom:** “For developers debugging repeat-run failures…”
- **What to do first:** **Try it with sample data**, beside “Loads two sample runs in a separate demo.”

The one-click action opens `/demo`; the workbench is already populated and identifies `$.report.chart`, changing from `"bar"` to `"line"` after `chart.selected`. On mobile, the headline, audience sentence, action, explanation, and three facts all fit in the initial 844px viewport.

## Clean repository, build, and package evidence

- Initial checkout was clean and `HEAD == origin/main == ccc428c6aa8d63d73cd30a17ce74972e59355ada`.
- `npm ci`: 100 packages installed, 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- `npm test`: PASS — 11 unit/manifest tests; exact production build; 4 artifact tests; 30 development browser tests with 2 expected production-only skips; 2 production service-worker tests.
- `npm run build` produced `dist/package` and `dist/site`.
- `npm pack --json`: 9,219-byte tarball, 45,552 bytes unpacked, 8 files, no bundled dependencies.
- A fresh temporary consumer installed the tarball. ESM recording/redaction/serialization/comparison found `$.count`; CommonJS pure replay returned `ok: true`.

## Independent live exercise

- Normal demo: first divergence was `$.report.chart`; reset recreated the sample.
- Invalid input: `broken.json: The selected file is not valid JSON.` Compare stayed disabled; loading the sample recovered successfully.
- Boundary input: a 5 MiB + 1 byte file produced `larger than the 5 MB local safety limit`; the sample path recovered successfully.
- Demo isolation: reset preserved `stc:saved-runs = real-data-marker`, left no `demo:` keys, and **Start for real** returned to `/` without the banner.
- Keyboard-only: Tab first reached the skip link; Enter opened the demo action; Space loaded the two-run example; Enter compared. Focus outlines were 3px with a 3px offset on the skip link and workbench controls.
- 390×844: `scrollWidth == innerWidth == 390`; tested controls were 44–50.8px high. The full demo had no visible overlap or clipping.
- At 200% text size on a 1280px viewport, there was no horizontal overflow and no clipped text/control element detected.
- Reduced motion matched the media query; maximum transition and animation duration was `0.01ms`, with automatic scrolling disabled.

## Accessibility, privacy, routes, and headers

- `/opt/fleet/lib/verify-url.sh <live-demo> <evidence-dir>`: PASS — title, `lang=en`, one `h1`, one `main`, image alt text, named buttons, and no console errors.
- Independent axe scans on `/` and `/demo`, desktop and mobile: **0 total violations**, hence 0 serious/critical.
- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` each returned 200 and had a route title, `lang=en`, exactly one `h1`, exactly one `main`, and no missing image alt. An unknown route returned HTTP 404 with the designed page.
- Internal links crawled from all routes returned 200. External GitHub and billing links were inventoried but not followed because the work order forbids connecting to resources outside the product slug.
- During the independent standard/demo flow, Playwright observed 34 requests: every request was a same-origin GET to `state-transition-capsule.sociobot.in`; no capsule upload, telemetry, API, or third-party request occurred. Console/page errors: 0.
- Browser response headers included CSP with `frame-ancestors 'none'`, Permissions-Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, and strict referrer policy.
- Hashed JS/CSS returned `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` returned `no-cache`; HTML returned `max-age=30, must-revalidate`.

## Offline and update behavior

A fresh live 390×844 context installed and activated `https://state-transition-capsule.sociobot.in/sw.js`, reloaded under worker control, and completed `registration.update()` while remaining activated. After the context was forced offline, `/demo` reloaded with title `Demo — State Transition Capsule` and retained the `$.report.chart` result. No service-worker console/page errors occurred.

## Candidate/deployment identity

The reproducible candidate build matches the live deployment byte for byte:

- `index.html`: `789952b617448b1524d3939d2d279bc2bde54f5be1aa4a66b66e01baadcbf841`
- `sw.js`: `47c50ab0d1e7a5ad22cbe3225d8fe5691b5f06d0a6fcbf9368ec1dfc48e9e6e4`
- `assets/home-5qljGDne.js`: `07f1f154332ce47e34908722487bb4644ee550e483846eaf1f786d7158b916c0`
- `assets/styles-DMNSYhkY.css`: `69669437d0ffc8693420b8e5a72a4fec937ab5a215a54d795a7d176cd777ed46`

Commit `ccc428c` changes only `.factory/handoff.md` after deployed source commit `a756823`; the matching built bytes therefore establish that the deployed product code is the candidate's product code.

## Performance and bundle budgets

A fresh 390×844 Chromium profile with 4× CPU throttling, 150ms latency, and 1.6 Mbps download measured FCP **852ms**, LCP **852ms**, CLS **0**, and maximum observed interaction event duration **88ms**. These pass the supplied FCP/LCP, CLS, and INP-class thresholds. A Lighthouse score was not generated because Lighthouse is not installed and fetching it would violate the no-unrelated-resource restriction.

- Initial home JS: 17,548 bytes raw / 6,642 bytes gzip; small support chunk 755 / 457 bytes.
- CSS: 18,371 bytes raw / 5,151 bytes gzip.
- Self-hosted fonts: 72,032 bytes total.
- Hero WebP: 79,218 bytes; OG image is exactly 1200×630.

All are within the supplied static-product budgets.

## Endpoint and sign-in scope

This is a static site and npm library with no product-owned server endpoint or sign-in. The hosted checkout and license verifier point to `api.sociobot.in`. I did not contact or rate-test that external factory service because the work order explicitly forbids connecting to any resource not named `sf-state-transition-capsule`. Therefore no external billing allowance/429 value was observed. Repository tests cover the client behavior with a mocked verification response.

## Required remediation

1. Add manifest entries and uniquely tagged sandbox tests for each retained visitor-facing promise, especially bounded retention. Remove or narrow the automatic-refund claim unless it can be proven within the permitted sandbox.
2. Add and reference a real 180×180 Apple touch icon on every route.
3. Re-run every claims command and independent verification. Do not release this candidate until the claims inventory is complete.
