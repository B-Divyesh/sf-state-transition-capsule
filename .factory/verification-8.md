# Independent verification 8 — PASS

**Work order:** `state-transition-capsule-verify-8`  
**Candidate:** `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89` (`fix: remove unavailable Studio checkout`)  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 1 September 2026 UTC from a clean checkout at `/work/repo`.

## Verdict

**PASS.** The candidate meets the researched brief and acceptance contract. The prior production-only checkout failure is resolved by this candidate: the release clearly says registration is unavailable, exposes no checkout link, and retains a fully usable free local viewer. No blocker, high, medium, or low severity product defect was found.

## First read and one-click demo

Cold-opening the live landing page answers all three required questions plainly on its first screen:

- **What it does:** “Find the state change that broke the second run.”
- **Who it is for:** developers debugging repeat-run failures.
- **What to click first:** **Try it with sample data**, with the adjacent explanation “Loads two sample runs in a separate demo.”

The action opens `/demo` in one click. It shows the persistent **“Demo — sample data, nothing is saved”** banner, immediately compares realistic good/failed runs, and reports the first difference at `$.report.chart` after `chart.selected` (`"bar"` → `"line"`). `Reset demo` restores the example and `Start for real` returns to `/`. This was visually and functionally checked at 1440 px and 390 px without horizontal overflow.

## Mandatory claims gate

`.factory/claims.json` exists and contains 20 unique claims. After `npm ci`, every declared `test` command was invoked individually and exactly as written before broader QA. **20/20 passed.** The passed IDs were:

`first-divergence`, `demo-isolation`, `local-processing`, `offline-reload`, `redaction`, `pure-replay`, `bounded-retention`, `package-formats`, `site-build-output`, `tab-local-storage`, `no-telemetry-runtime`, `registration-unavailable`, `recording`, `json-roundtrip`, `viewer-does-not-execute-capsules`, `public-api-surface`, `capsule-format-v1`, `local-tarball-install`, `node-20`, and `file-size-limit`.

This includes the exact production build plus offline browser check, the fresh-local-tarball installation/import consumer, format/declaration checks, redaction/replay/retention unit checks, and demo browser checks. Landing, demo, README, Privacy, and Terms claims were cross-checked against the manifest. The candidate’s availability copy is covered by `registration-unavailable`; it verifies no checkout link or billing request and completes the sample comparison without an account.

## Clean local gates and library consumer

- `npm ci`: PASS — 100 packages installed, audit reported 0 vulnerabilities.
- `npm test`: PASS — 14 unit/manifest tests, 11 artifact tests, 50 browser tests passed with 2 intentional production-only skips, then 2/2 production offline tests passed.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS — emits `dist/package` and `dist/site`.

The artifact suite independently packs the built library, installs it into a fresh offline consumer, and imports the public API. It also loads both ESM and CommonJS artifacts, checks TypeScript declarations, Node `>=20`, zero runtime dependencies, and the six documented exports. The claim commands separately exercised valid comparison, malformed JSON, unsupported media marker, retention boundary, 5 MiB + 1 byte rejection, redaction, pure reducer replay, hostile script-like capsule data, tab-only storage, reset isolation, and recovery by loading the sample after error.

## Live product QA

- The normal two-run flow reports the exact first changed field. The editable playground updates output after JSON edits, shows redaction, and runs replay.
- Malformed JSON leaves comparison disabled with a useful error; an oversized file is rejected at the documented local 5 MiB limit; loading the example remains available to recover.
- Keyboard-only checks pass: first Tab focuses the visible **Skip to main content** link with a solid outline; Space loads the example and Enter compares it. The full browser suite checks all visible controls at least 44 × 44 CSS px.
- The reduced-motion rule reduces animation/transition duration and disables smooth scrolling. Desktop and mobile screenshots showed no clipped controls or horizontal overflow.
- Worker `verify-url.sh` passed live `/`, `/demo`, `/privacy/`, and `/terms/`: 200 responses, route titles, `lang=en`, exactly one `h1`, one `main`, complete image alt text, labelled buttons, and no console errors (cold loads: 922, 830, 649, and 786 ms respectively).
- Independent Playwright Axe 4.10.2 found zero serious or critical violations on live `/demo` at 390 px. The full suite checks `/` and `/demo` in both configured browser projects plus legal and 404 route structure.

## Privacy, security, caching, and offline

Fresh live desktop and mobile browser contexts recorded only same-origin `GET` requests for the document and static assets throughout the demo flow. There were no telemetry, API, run-file upload, CDN, remote font, console, or page-error requests. The CSP is response-delivered and restricts resources to self (`connect-src 'self'`, `frame-ancestors 'none'`); the response also has HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and a restrictive Permissions-Policy.

In a fresh live context, the service worker reached `activated` and controlled the page. With the browser offline, `/demo` reloaded with HTTP 200 from the worker cache and still displayed `$.report.chart`; no console errors occurred. Hashed JS/CSS assets use `public, max-age=31536000, immutable`; the service worker uses `no-cache`; HTML revalidates at 30 seconds.

This is a static local-first viewer and npm package. The candidate contains no product server-side endpoint, sign-in, payment link, or product-unlock call, so an allowance/429 observation and Entra check are not applicable. The observed request log confirms no request to the Sociobot billing API.

## Performance and deployment identity

A fresh Lighthouse mobile run on the live root scored **96 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**: FCP 0.9 s, LCP 1.7 s, TBT 210 ms, CLS 0, total transfer 165 KiB. The fresh production build reports 17.50 kB raw application JS (6.37 kB gzip), 19.03 kB CSS (5.20 kB gzip), 72.0 kB self-hosted fonts, and a 79.2 kB hero WebP—within the stated budgets.

`dist/site/index.html` SHA-256 exactly equals the live root HTML. Candidate and live bytes also match for `/demo`, Privacy, Terms, 404, the service worker, all referenced JS/CSS, hero and OG images, favicon, robots, and sitemap. The live deployment therefore matches candidate `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89`.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Blocker | None observed |
| High | None observed |
| Medium | None observed |
| Low | None observed |
