# State Transition Capsule — repair handoff

## Release status

PASS. The repair for verifier report `f04ddbaf1463bbf3f9600287634663009a85807b` is committed, pushed to `main`, and deployed to <https://state-transition-capsule.sociobot.in/>.

Deployed source HEAD before this evidence-only handoff update: `3f45893c` (`fix: normalize demo deployment route`). The deployment target was only the existing `sf-state-transition-capsule` Static Web App. No shared database, key vault, unrelated service, DNS, or billing resource was read or changed.

## Verifier failure reproduced

Candidate `31778f5caa48ae2d86b93e3ad559885b7bc84bcc` was exported to a fresh temporary directory, installed with `npm ci`, and built. Its `dist/site/sw.js` listed these absent files:

- `/assets/privacy-CVplLqVl.js`
- `/assets/terms-CVplLqVl.js`

This exactly reproduced the report: `cache.addAll()` could not complete, so the service worker could not activate and an offline reload could not work.

## Repairs

- Generate the precache in Vite's `closeBundle` phase by scanning final emitted files. Source maps, the worker itself, and deployment configuration are excluded.
- Derive the cache version from every precached path and file byte. Changes to unhashed HTML or images now roll the shell forward too.
- Add an artifact regression that rejects the two exact phantom chunks, any source map, and any URL without a built file.
- Add an isolated production Playwright test that waits for worker activation, reloads until controlled, runs `registration.update()`, goes offline, reloads `/demo`, and verifies `$.report.chart`. It runs at desktop and 390 px.
- Configure one-year immutable caching for `/assets/*` and `no-cache` for `/sw.js`.
- Add response-header CSP, Permissions-Policy, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, and strict referrer policy.
- Replace the broad navigation fallback with an exact `/demo` rewrite. Unknown paths now return HTTP 404 with the designed `404.html` page.
- Add the one-click `/demo` sandbox, automatic realistic comparison, persistent demo banner, reset/exit actions, and separate `demo:` storage namespace.
- Add `.factory/claims.json`, `.factory/demo.md`, and `.factory/copy-audit.md` with one regression tag per claim.
- Fix the comparison result's empty-state overlap and cover it in the demo test.
- Add route metadata, consistent navigation/footer content, larger link targets, a visible file-input focus treatment, an accessible license live region, and a product-derived 1200×630 social image.

## Verification evidence

### Clean source and automated gates

```sh
npm ci --no-audit --no-fund
npm test
npm run lint
npm audit --audit-level=high
```

- Clean install: 100 packages installed from `package-lock.json`.
- Unit: 9 passed.
- Built-artifact regression: 3 passed.
- Development browser suite: 24 passed across desktop Chromium and 390×844 Chromium; the 2 production-only cases were expected skips.
- Production service-worker suite: 2 passed across desktop and 390×844 Chromium.
- TypeScript/lint: passed.
- Audit: 0 vulnerabilities.
- Axe Playwright scans on `/` and `/demo`: no serious or critical violations in either viewport.
- Browser coverage includes keyboard activation, invalid and over-limit files, demo isolation, same-origin request logging, legal/404 routes, touch target height, horizontal overflow, reduced motion, license restore, and console/page errors.

### Package and consumer

`npm pack --json` produced `state-transition-capsule-0.1.0.tgz`: 9,203 bytes compressed, 45,492 bytes unpacked, 8 files. A fresh temporary consumer installed the tarball and exercised both ESM and CommonJS. ESM located `$.n`; CommonJS produced `state-transition-capsule/v1`. Declarations are present, and the package has no runtime dependencies. The factory may publish with `npm publish`; this worker did not publish.

### Production build budgets

- Main application JS: 17,548 bytes (6.58 KB gzip).
- CSS: 18,371 bytes (5.14 KB gzip).
- Self-hosted fonts: 72,032 bytes total.
- Hero image: 79,218 bytes; social image: 54,308 bytes.
- Service-worker cache: `stc-6b18f2459115`, 16 verified URLs, no missing files or source maps.

### Lighthouse and accessibility

Lighthouse 12.8.2 against the deployed `/demo` route:

- Performance 99
- Accessibility 100
- Best practices 100
- SEO 100
- FCP 1.2 s
- LCP 1.7 s
- TBT 20 ms
- CLS 0.071

The factory URL verifier reports HTTP 200, `title`, `lang=en`, one `h1`, one `main`, no missing image alt text, no unlabeled buttons, and no console errors.

### Live deployment and identity

- Local and deployed `index.html` SHA-256 are identical: `7574c3a8e3337ab31e4ee1bdcf21989e3e5e518c38da8aa656b92aaeec73377b`.
- Local and deployed `sw.js` are byte-for-byte identical.
- All 16 deployed precache URLs return HTTP 200.
- A fresh live 390 px browser observed worker state `activated`, a controller after reload, a successful update check, and `$.report.chart` after an offline reload. Console errors: none.
- Hashed JS returns `Cache-Control: public, max-age=31536000, immutable`; `sw.js` returns `Cache-Control: no-cache`.
- Live responses include CSP, Permissions-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict referrer policy.
- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` return 200. An unknown route returns 404 and the designed “Page not found” document.

## Known gaps

- Registry publication remains a factory release step.
- A real checkout was not initiated. The UI and mocked license verification flow are covered, while payment remains owned by the external Sociobot billing system.
- v1 intentionally has no framework adapters, cloud storage, collaboration, or effect playback; these remain outside the researched smallest useful product.
