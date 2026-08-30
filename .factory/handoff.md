# State Transition Capsule — repair handoff

## Release status: PASS

The release-blocking claims contract defects from independent verification report
`.factory/verification-2.md` are repaired. Product source was deployed from
`a756823c6d7d9d2a4a8cf3b754c9b57a45ff161b` to
<https://state-transition-capsule.sociobot.in/>. The deployment used only the
permitted `sf-state-transition-capsule` Static Web App; no shared service,
database, key vault, DNS, billing record, or unrelated resource was accessed.

## Repairs

- Reproduced the verifier's three exact failures from a clean clone with the
  lockfile-pinned `vitest@3.2.7`: `CACError: Unknown option --grep`.
- Replaced only the three Vitest selectors in `.factory/claims.json` with
  supported `--testNamePattern` selectors. Playwright claim selectors retain
  Playwright's supported `--grep` flag.
- Added `tests/claims-manifest.test.ts`. It pins the contract to Vitest 3.2.7,
  rejects `--grep` in Vitest claim commands, requires the correct selector for
  each claim, and requires every manifest claim to have exactly one tagged
  regression test.
- Added observable claim coverage for tab-only imported capsules, the
  unlicensed no-telemetry/no-runtime-request flow, and the exact $39 one-time
  Studio disclosure and hosted checkout URL. The license regression now also
  exercises free comparison, pasted-token restore, local history, and the
  return-URL token path.
- Strengthened the redaction regression to cover the documented wildcard state
  path. Narrowed copy to claims the sandbox can prove and removed the unshipped
  future-adapter promise.
- Preloaded the self-hosted display font and added an emitted-artifact check.
  This removes first-view font layout movement while retaining the product's
  visual system.

## Verification evidence

### Clean install, claims, and automated gates

From a fresh local clone at `a756823`, `npm ci --no-audit --no-fund` installed
100 packages, with `vitest@3.2.7` resolved from `package-lock.json`. Every
command in `.factory/claims.json` was executed verbatim and passed; the final
Playwright status file reports `passed` with no failed tests.

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm test
npm audit --audit-level=high
```

- Typecheck and lint passed.
- `npm test` passed: 11 unit/manifest tests, 4 production-artifact tests, 30
  development-browser tests across desktop Chromium and 390×844 Chromium with
  2 expected production-only skips, and 2 production service-worker tests.
- The browser suite covers invalid input, the 5 MiB boundary, recovery,
  keyboard Tab/Space/Enter, 390px overflow and touch targets, reduced motion,
  demo isolation, no-request privacy behavior, axe serious/critical, licensing,
  service-worker update, and offline reload.
- `npm audit --audit-level=high` reported 0 vulnerabilities.

### Package and consumer

`npm pack --json` produced `state-transition-capsule-0.1.0.tgz`: 9,219 bytes
compressed, 45,552 bytes unpacked, 8 files, no bundled dependencies. A fresh
temporary consumer installed that tarball. Its ESM consumer found `$.count`
with `compareCapsules`; its CommonJS consumer completed a successful
`replayCapsule`. Declarations for both module formats are included. The factory
may publish with `npm publish`; this worker did not publish.

### Accessibility, privacy, performance, and local production verification

- The factory `verify-url.sh` passed against the built `/demo`: HTTP 200,
  title, `lang=en`, one `h1`, one `main`, no missing image alt text, no
  unlabeled buttons, and no browser console errors.
- Axe Playwright scans on `/` and `/demo` have no serious or critical issues
  on desktop and 390px mobile.
- Lighthouse 12.8.2, mobile preset, against the built landing page: Performance
  100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.5 s, LCP 1.5 s,
  TBT 0 ms, CLS 0.00010.
- Built budgets: main JS 17,548 bytes (6,583 bytes gzip); CSS 18,371 bytes
  (5,143 bytes gzip); self-hosted fonts 72,032 bytes; hero WebP 79,218 bytes.
- The unlicensed normal and demo flows make only same-origin GET navigation or
  static-asset requests. Capsule data is not uploaded.

### Deployment and live identity

- Live `/demo` passed `verify-url.sh` with no console errors and the required
  title/landmark/alt/button baseline.
- Live desktop keyboard flow focused the skip link, loaded the sample with
  Space, compared with Enter, and found `$.report.chart`.
- A live 390×844 context had no horizontal overflow (`390 == 390`), no axe
  serious/critical violations, no external requests, and no browser errors.
  A fresh mobile context activated the worker, reloaded until controlled,
  completed `registration.update()`, went offline, reloaded `/demo`, and kept
  the `$.report.chart` result.
- Local and live `index.html` are byte-identical, SHA-256
  `789952b617448b1524d3939d2d279bc2bde54f5be1aa4a66b66e01baadcbf841`.
  Local and live `sw.js` are byte-identical, SHA-256
  `47c50ab0d1e7a5ad22cbe3225d8fe5691b5f06d0a6fcbf9368ec1dfc48e9e6e4`.
- Live hashed assets return `Cache-Control: public, max-age=31536000,
  immutable`; CSP, Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`,
  and strict referrer policy are present. `/`, `/demo`, `/privacy/`, `/terms/`,
  and `/404.html` return 200; an unknown route returns 404.

## Known gaps and next steps

- npm publication remains a factory release step.
- A real checkout was deliberately not initiated. The product's mocked
  license-restore regression covers the documented local behavior; hosted
  payment and refund processing remain owned by Sociobot/Dodo.
