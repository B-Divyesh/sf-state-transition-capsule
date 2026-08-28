# Independent verification — FAIL

**Work order:** `state-transition-capsule-verify-1`  
**Candidate:** `31778f5caa48ae2d86b93e3ad559885b7bc84bcc` (`chore: harden validation and document verification`)  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 2026-08-28 UTC from a fresh clone of `https://github.com/B-Divyesh/sf-state-transition-capsule.git`.

## Verdict

**FAIL — release blocking PWA failure.** The service worker cannot install, so the promised local offline viewer cannot reload offline. This violates the supplied PWA/offline acceptance requirement and the product's local-first constraint, despite the core library and normal online viewer working correctly.

## Release-blocking defect

### High — service worker precache is broken; offline reload fails

`dist/site/sw.js` precaches `assets/privacy-CVplLqVl.js` and `assets/terms-CVplLqVl.js`, but the build emits only their `.map` files, not either JavaScript file. Both resources are also HTTP 404 on the live candidate. `cache.addAll()` consequently rejects, preventing `skipWaiting()` and activation.

Fresh 390px Chromium evidence against the live URL:

- `navigator.serviceWorker.ready` timed out after 5 seconds and `navigator.serviceWorker.controller` was `false`.
- After an initial online load, forcing the context offline then reloading failed with `net::ERR_INTERNET_DISCONNECTED` before the workbench could load.
- The current browser test only switches offline *after* loading against the Vite dev server; it does not verify production service-worker install or an offline reload.

This also means a service-worker update cannot be meaningfully verified: no worker reaches the active/controller state.

## Other findings

### Medium — hashed static assets do not receive immutable caching

Live HTML, JavaScript, CSS, and `sw.js` each return `cache-control: public, must-revalidate, max-age=30`. The hashed JS/CSS assets should be long-lived immutable resources under the supplied performance contract. This is not the cause of the failed install but needlessly prevents normal static-asset caching.

### Low — response-policy hardening is incomplete

The live response provides HSTS, `nosniff`, and `strict-origin-when-cross-origin`, but no `Content-Security-Policy`, `Permissions-Policy`, or frame-ancestors control. This is defense-in-depth rather than the reason for the FAIL; no runtime DOM injection issue was observed in the tested flows.

## What passed

### Clean install, tests, build, package

- Fresh remote checkout resolved exactly to `31778f5caa48ae2d86b93e3ad559885b7bc84bcc`; `npm ci` completed with `0 vulnerabilities`.
- `npm test` passed: 9 Vitest unit tests, exact `npm run build`, and 12 Playwright desktop/390px tests.
- `npx tsc --noEmit` passed. No repository lint script exists.
- `npm pack --json` produced a ready-to-publish 8,790-byte tarball (44,487 bytes unpacked), containing README, MIT LICENSE, CHANGELOG, CJS/ESM entry points, and declarations.
- A clean consumer installed that tarball and exercised both ESM and CommonJS public APIs. Recording/redaction, JSON serialization/parsing, first divergence (`$.count`/`$.x`), and supplied pure-reducer replay all passed.

### Product exercise

- Normal two-run example located its intended first persisted divergence at `$.report.chart` after `chart.selected`.
- Invalid JSON reports `The selected file is not valid JSON.` and recovery via a valid example succeeds.
- A 5 MiB + 1 byte input reports the explicit local safety-limit error; the workbench remains usable.
- The normal unlicensed browser load made requests only to `state-transition-capsule.sociobot.in`; no analytics, remote fonts, runtime CDN, or capsule upload was observed. The only configured outbound runtime endpoint is the documented Sociobot license verification endpoint, used only when a license is supplied.
- 390px mobile had no horizontal overflow (`scrollWidth = innerWidth = 390`); the used workbench controls were at least 44px high. Desktop and mobile browser flows had no console errors or page errors.

### Accessibility and performance

- Axe on the live site found no serious or critical violations; repository axe tests also passed on desktop and 390px.
- Live semantics: `lang=en`, one title, one `h1`, and one `main`. Keyboard Tab shows the skip link and brand with a visible `3px` orange focus outline; Enter completed load and compare. Reduced-motion evaluation produced a `0.01ms` transition duration.
- Lighthouse mobile against the live site (second run with Chromium's shared-memory flag): performance **99**, accessibility **100**; FCP **1.7 s**, LCP **1.7 s**, TBT **0 ms**, CLS **0.033**.
- Built initial app JS is 16.7 KB, CSS 17.3 KB, self-hosted fonts total 72.0 KB, and the hero WebP is 79.2 KB: all within the stated budgets.

### Live candidate identity

The live document's normalized SHA-256 is identical to the fresh candidate build (`01a6da3746a6d0d9e13bb3237ad74ac23f10c1c306af672cf4ab2ee8cc4a1179`). Its HTML references the same `home-BwPLhH4d.js`, `styles-02wNo6c1.css`, and `styles-C0qwxIaB.js` assets. The deployment is therefore the tested candidate, not a deployment-only mismatch.

## Required remediation and re-verification

1. Generate the precache from emitted, non-sourcemap assets only (or otherwise remove nonexistent chunk paths), version the cache, and ensure installation errors are surfaced during CI.
2. Add a production-build Playwright test that waits for `navigator.serviceWorker.ready`, confirms a controller after reload, then performs an offline reload and comparison.
3. Configure immutable caching for hashed assets and add CSP/permissions/frame policy headers at deployment.
4. Re-run this verification after deployment; do not release the candidate as a PWA until offline reload passes.
