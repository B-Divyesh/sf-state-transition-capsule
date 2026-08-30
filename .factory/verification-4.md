# Independent verification 4 — FAIL

**Work order:** `state-transition-capsule-verify-4`  
**Candidate:** `bbcee08062851b6391184a52c8e253d5cd939c8e`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 30 August 2026 UTC from the clean checkout at `/work/repo`.

## Verdict

**FAIL — a serious live Axe finding violates the non-negotiable accessibility gate.** The package, local viewer, claims, offline behavior, privacy behavior, deployment identity, and performance checks otherwise pass. No product code was modified during verification.

## Release-blocking finding

### High — the install/copy control's visible label is absent from its accessible name

On both `/` and `/demo`, at desktop and 390px mobile widths, explicitly enabling Axe's `label-content-name-mismatch` rule reports one **serious** violation on `.install-command`:

```html
<button data-copy="npm install state-transition-capsule"
        aria-label="Copy npm install command">
  <span>npm i state-transition-capsule</span><span>Copy</span>
</button>
```

The visible text is `npm i state-transition-capsule` and `Copy`, but the accessible name is `Copy npm install command`. Because the visible command text is not contained verbatim in the accessible name, speech-input users cannot reliably invoke the control by saying its visible label. Axe classifies this as serious under WCAG 2.5.3.

Fresh evidence:

- Playwright Axe 4.10.2 with `withRules(["label-content-name-mismatch"])`: one serious violation on `/` and `/demo` in both desktop and 390px contexts.
- Lighthouse 12.8.2 independently reports the same failed audit and element. Its rounded accessibility category score is still 100, so the category number does not negate the failed serious audit.
- The repository's default Axe test does not enable this experimental rule, which is why `npm test` remains green.

The supplied acceptance contract requires all serious/critical Axe findings to be fixed before handoff. Make the accessible name contain the visible command and action text, then add this rule to the regression suite.

## Other findings

### Medium — visible mobile targets are smaller than the required 44×44 CSS pixels

At 390×844, fresh bounding-box measurements found these visible interactive targets below the supplied 44×44 minimum:

- Home brand link: **48×32**.
- Header `Demo` link: **40×44**.
- Studio fine-print `Terms` link: **37×16**.
- Studio fine-print `Privacy` link: **45×16**.
- Footer `Terms` link: **42×44**.

The clipped 1×1 file inputs were excluded because their associated visible `Choose JSON` labels are 44px-high targets. Lighthouse's spacing-aware `target-size` audit passes, but the work order's stricter baseline explicitly requires each touch target to be at least 44px in both dimensions.

### Medium — first-screen supporting copy is below the product's minimum text size

At 390px, the action explanation is **13px** and all three first-screen fact lines are **12px**. The supplied accessibility baseline requires body text of at least 16px on web and 17pt on mobile, while `.factory/design.md` says body text is never below 16px. Other explanatory copy such as `.fine-print` and the footer is also 13px. The copy remains visible, but it does not meet the stated legibility contract.

### Low — legal routes omit required social metadata

`/privacy/` and `/terms/` have route-specific titles, descriptions, and canonicals, but no Open Graph title/description/image or Twitter card metadata. The supplied site-structure contract requires Open Graph and Twitter metadata with the product's 1200×630 image. Home and demo include them; the legal routes do not.

## Mandatory claims gate

`.factory/claims.json` exists. After `npm ci`, every listed command was run exactly as written before broader QA. Result: **12/12 passed**.

| Claim | Result | Fresh evidence |
| --- | --- | --- |
| `first-divergence` | PASS | 2 Playwright projects; demo found `$.report.chart` after `chart.selected`. |
| `demo-isolation` | PASS | 2 projects; normal marker survived demo reset and no `demo:` keys remained. |
| `local-processing` | PASS | 2 projects; complete demo comparison used same-origin GETs only. |
| `offline-reload` | PASS | Exact build plus 2 production service-worker projects. |
| `redaction` | PASS | Tagged Vitest proved exact/wildcard state, event, and metadata redaction without input mutation. |
| `pure-replay` | PASS | Tagged Vitest proved matching replay and first divergence through the supplied reducer. |
| `bounded-retention` | PASS | Tagged Vitest kept transitions 2 and 3 and folded transition 1 into the boundary state. |
| `package-formats` | PASS | Exact build plus tagged ESM/CommonJS/declarations/no-dependency artifact test. |
| `license-restore` | PASS | 2 mocked-verifier browser projects; free comparison remained available. |
| `tab-local-storage` | PASS | 2 projects; unlicensed imports left no storage and disappeared on reload. |
| `no-telemetry-runtime` | PASS | 2 projects; standard and demo flows made no API or third-party runtime request. |
| `studio-price` | PASS | 2 projects; `$39` one-time price, checkout URL, and Terms disclosure matched. |

The landing page, legal pages, README, and copy audit were cross-checked against the manifest. The earlier bounded-retention and refund wording gaps are repaired. No additional release-blocking unlisted claim was found.

## First-read and demo gate

The cold live page passes this gate on desktop and 390×844 mobile:

- **What it does:** “Find the state change that broke the second run.”
- **For whom:** developers debugging repeat-run failures.
- **What to click first:** **Try it with sample data**, beside “Loads two sample runs in a separate demo.”

The headline, audience sentence, action, explanation, and all three facts fit in the initial 844px mobile viewport. One click opens `/demo`, shows `Demo — sample data, nothing is saved`, preloads both realistic report runs, and immediately displays the first divergence `$.report.chart` (`"bar"` → `"line"`) after `chart.selected`.

## Clean local gates and package consumer

- Initial `HEAD == origin/main == bbcee08062851b6391184a52c8e253d5cd939c8e`; the tracked tree was clean.
- `npm ci`: PASS — 100 packages, 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `npm test`: PASS — 11 unit/manifest tests; exact production build; 5 artifact tests; 30 development browser tests with 2 expected production-only skips; 2 production service-worker tests.
- Separate `npm run build`: PASS; emitted `dist/package` and `dist/site`.
- `npm pack --dry-run --json`: 9,219 bytes packed, 45,552 bytes unpacked, 8 files, no bundled or runtime dependencies.

A fresh temporary consumer installed the packed tarball. Its ESM path exercised recording, exact and wildcard redaction, serialization/parsing, first divergence, retention at the minimum useful boundary, malformed JSON, invalid retention, non-finite state, validation, state diffs, and pure replay. CommonJS loaded the same public API and replayed a counter capsule successfully. The exact first divergent path was `$.report.chart`.

## Independent product exercise

- Normal viewer flow: loaded both bundled runs, compared them, and rendered the changed path and values.
- Invalid JSON: announced `broken.json: The selected file is not valid JSON.` through the polite status region and kept comparison disabled.
- Boundary: rejected a 5 MiB + 1 byte file with `larger than the 5 MB local safety limit` and a recovery instruction.
- Recovery: after each error, loading the sample and comparing successfully found `$.report.chart`.
- Keyboard-only: Tab first reached the skip link; 11 unique tab stops reached `Load two-run example`; Space loaded it; subsequent Tab reached `Compare runs`; Enter produced the result. The skip link had a 3px orange outline, and the workbench control had a 3px cream outline plus orange outer ring.
- Copy control: with clipboard permission, clicking copied exactly `npm install state-transition-capsule` and changed feedback to `Copied`.
- 390×844: no horizontal overflow on home or demo; the comparison result remained usable.
- 200% CSS zoom at a 1280px viewport produced no horizontal document overflow or lost main/footer content.
- Reduced motion: the media query matched, scroll behavior was `auto`, and no animation remained running.
- Internal route/fragment crawl: every product-owned link returned 200 and every fragment target existed. A random missing route returned the designed 404 with HTTP 404.

## Accessibility, privacy, and browser errors

- `/opt/fleet/lib/verify-url.sh <live-demo> <temp-evidence-dir>`: PASS in **692ms** — title, `lang=en`, one `h1`, one `main`, image alt text, named buttons, and zero console errors.
- Standard Playwright Axe scans on `/`, `/demo`, `/privacy/`, and `/terms/`: no default serious/critical findings. The explicitly enabled serious WCAG 2.5.3 finding above controls the verdict.
- `/`, `/demo`, `/privacy/`, and `/terms/` each returned 200 with route title, `lang=en`, exactly one `h1`, one `main`, no missing image alt, and no console/page errors.
- A browser request log covering normal comparison, demo, and legal routes observed only same-origin GET requests. There were no external, non-GET, telemetry, font-CDN, or capsule-upload requests.
- The source review found no raw Azure/OpenAI key or runtime model call. This product does not need an AI feature for its deterministic comparison job.

## Headers, caching, offline behavior, and deployment identity

Browser response headers include CSP with `frame-ancestors 'none'`, HSTS, Permissions-Policy, strict referrer policy, `nosniff`, and `X-Frame-Options: DENY`. HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS uses `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.

A fresh live 390×844 context installed and activated the worker, reloaded under worker control, completed `registration.update()` with the worker still activated, then reloaded `/demo` offline. The title and `$.report.chart` result remained available with zero console/page errors.

The reproducible candidate build matches the live deployment byte for byte. Representative SHA-256 values:

- `index.html`: `fa634c05a5e5773a7401c679de793958b1696fb1c7696c6fa08b0ca011cbf250`
- `sw.js`: `61c19f287427a826af57a10d337d663ab0e159faf9d798f28caaf3cf37d2132b`
- `assets/home-5qljGDne.js`: `07f1f154332ce47e34908722487bb4644ee550e483846eaf1f786d7158b916c0`
- `assets/styles-DMNSYhkY.css`: `69669437d0ffc8693420b8e5a72a4fec937ab5a215a54d795a7d176cd777ed46`
- `instrument-trace.webp`: `e0047158c91be290f80ace8b346077de488b05d4183fc00c5b40044293f72e43`

All checked HTML, JS, CSS, artwork, legal documents, 404, and service-worker bytes matched. Candidate commit `bbcee08` changes only the handoff after source commit `c327b05`; the byte matches establish live candidate identity.

## Performance and bundle budgets

Fresh mobile Lighthouse 12.8.2 results:

- Performance **98**, accessibility **100** (with the serious failed audit described above), best practices **100**, SEO **100**.
- FCP **1.1s**, LCP **1.7s**, TBT **150ms**, CLS **0**, Speed Index **1.1s**.
- Total transfer **169,042 bytes** across 9 requests; no third-party bytes.
- Script transfer **7,155 bytes**, CSS **5,378 bytes**, fonts **72,274 bytes**, hero image **79,323 bytes**.
- A direct compare interaction rendered its completed result within two paints in **44.1ms**, below the 200ms interaction-class budget. Lighthouse did not report field INP in this synthetic run.

The exact build reports 17.55 KB raw / 6.58 KB gzip for the main JS, 18.37 KB raw / 5.14 KB gzip CSS, 72.03 KB self-hosted fonts, and a 79.22 KB hero WebP. The OG image is a real 1200×630 WebP. All payload and loading budgets pass.

## Endpoint and sign-in scope

This is a static site and npm library with no product-owned server endpoint or sign-in. The checkout and license verifier point to the external factory billing API. Per the explicit prohibition against connecting to resources outside `sf-state-transition-capsule`, that external service was not contacted or rate-tested, so no billing allowance/429 value was observed. Repository tests verify the client behavior with a mocked response; source review confirms the intended once-per-day verdict cache. Entra sign-in is not applicable.

## Required remediation

1. Make the install/copy button's accessible name contain its exact visible command/action text and add the explicit Axe rule to CI.
2. Expand every visible mobile link target to at least 44×44 CSS pixels.
3. Raise first-screen explanatory/fact text and other body copy to the documented minimum size.
4. Add Open Graph and Twitter metadata to Privacy and Terms.
5. Re-run every claim command, the full suite, explicit Axe rule, mobile target measurements, and live verification before release.
