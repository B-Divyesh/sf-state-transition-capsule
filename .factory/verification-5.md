# Independent verification 5 — PASS

**Work order:** `state-transition-capsule-verify-5`  
**Candidate:** `98d62bc5f255cebc88c8852375e27241c848a68f`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 2026-09-01 UTC from a clean checkout at `/work/repo`.

## Verdict

**PASS.** The deployed static site and npm package satisfy the reviewed acceptance contract. No blocker, high, medium, or low severity defect was observed in this verification.

## First read and demo gate

A cold desktop and 390×844 visit passes the plain-words gate:

- **Does:** “Find the state change that broke the second run.”
- **For:** developers debugging repeat-run failures.
- **First action:** **Try it with sample data**, with “Loads two sample runs in a separate demo.”

The one-click action opens `/demo`, shows **“Demo — sample data, nothing is saved”**, and immediately presents the bundled two-run report example. It reports the first changed persisted path as `$.report.chart`, after `chart.selected` (`"bar"` to `"line"`). The demo reset control preserved an independent real-storage marker in the claim suite; the live normal path did not save imported capsules without Studio.

## Mandatory claims gate

`.factory/claims.json` exists. After `npm ci`, every command was run exactly as published, before broader QA. **12/12 passed.**

| Claim | Exact command result |
| --- | --- |
| `first-divergence` | PASS — `npm run test:e2e -- --grep @claim:first-divergence`; 2 browser projects |
| `demo-isolation` | PASS — `npm run test:e2e -- --grep @claim:demo-isolation`; 2 browser projects |
| `local-processing` | PASS — `npm run test:e2e -- --grep @claim:local-processing`; 2 browser projects |
| `offline-reload` | PASS — exact build, then production browser test; 2 browser projects |
| `redaction` | PASS — exact tagged Vitest selector |
| `pure-replay` | PASS — exact tagged Vitest selector |
| `bounded-retention` | PASS — exact tagged Vitest selector |
| `package-formats` | PASS — exact build, then tagged artifact test |
| `license-restore` | PASS — mocked documented verifier response; free comparison remained available |
| `tab-local-storage` | PASS — unlicensed import is tab-only |
| `no-telemetry-runtime` | PASS — standard and demo flows used no telemetry/API/third-party runtime request |
| `studio-price` | PASS — `$39` one-time price, checkout URL, and Terms text matched |

The landing page, README, Privacy, and Terms copy was checked against the manifest. The stated redaction, replay, retention, format, privacy, storage, offline, license, and price claims have matching observable tests.

## Clean local verification

- `npm ci`: PASS; 100 packages installed; audit reported 0 vulnerabilities.
- `npm test`: PASS — 11 unit/manifest tests, exact production build, 5 artifact tests, 38 browser tests, and 2 production service-worker tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; produced `dist/package` and `dist/site`.
- `npm pack --pack-destination /tmp`: PASS; `state-transition-capsule-0.1.0.tgz`, 9.2 kB compressed, 45.6 kB unpacked, 8 files.

A fresh temporary consumer installed that tarball. The public ESM API created two recordings, found `$.state` as the first divergence, and completed pure replay. The CommonJS API created and retained one transition. The packed manifest has no runtime dependencies and includes ESM, CommonJS, and declaration files.

## Independent product and browser checks

- **Normal, invalid, recovery:** the live workbench loaded the sample and found `$.report.chart`. `broken.json` produced `The selected file is not valid JSON.` with Compare disabled. Loading the sample then comparing recovered successfully with no console or page error.
- **Boundary:** the repository browser suite rejected a 5 MiB + 1 byte capsule with the documented local safety-limit error and kept Compare disabled.
- **Keyboard and mobile:** the suite completed the flow using Tab, Space, and Enter. Direct live keyboard checks showed a `3px` orange `:focus-visible` outline with `3px` offset. At 390×844, `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404 had no horizontal overflow; suite checks confirmed all visible controls meet the 44px target rule.
- **Accessibility:** Playwright Axe 4.10.2 reported zero serious or critical violations on live `/` and `/demo` at desktop and 390px. Live routes have `lang=en`, a nonempty route title, one `main`, one `h1`, and no missing image alt text. The repository has no `verify-url.sh`; equivalent live title/lang/landmark/alt/console checks were run directly.
- **Motion and errors:** the product suite covers reduced motion and keyboard operation. Live desktop and mobile normal/demo flows recorded zero console errors and zero page errors.
- **PWA:** in a new live browser context, the service worker reached `activated` and controlled the page. `registration.update()` remained activated. After setting that context offline, `/demo` reloaded and still displayed `$.report.chart`; no console/page errors occurred.

## Privacy, headers, budgets, and live identity

The complete live normal and demo flow recorded only same-origin `GET` requests for the document and static assets. It made no telemetry, capsule upload, API, CDN, or remote-font request. No license action was taken. The only configured non-product request is the documented Sociobot billing verification endpoint, which is deliberately initiated only by a license action; it was not contacted because this work order prohibits connections to non-`sf-` resources.

There is no product-owned server endpoint in this static deployment, so no request allowance or `429`/`Retry-After` behavior applies. The mocked license claim verifies the documented client integration without contacting the external billing resource.

Live headers confirm HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, Permissions-Policy, and a CSP with `frame-ancestors 'none'`. `/sw.js` is `no-cache`; hashed JS/CSS have `public, max-age=31536000, immutable`; HTML revalidates after 30 seconds. `/no-such-route` returns the designed 404 with HTTP 404. The main JavaScript is 17.55 kB raw / 6.58 kB gzip, CSS 18.57 kB raw / 5.17 kB gzip, self-hosted fonts total 72.03 kB, and the hero WebP is 79.22 kB; each is within the stated budgets.

The live root `index.html` is byte-identical to this candidate build, SHA-256 `418b9a125b90abd775450f3a210ba90446dfed1530ac4dfe6630acf61a799ab4`. All 24 publicly served files emitted by `dist/site` matched the live response byte-for-byte. `staticwebapp.config.json` is a deployment configuration file rather than a public artifact; the live headers, immutable asset policy, service-worker caching policy, and 404 behavior confirm its relevant effects.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Blocker | None observed |
| High | None observed |
| Medium | None observed |
| Low | None observed |

