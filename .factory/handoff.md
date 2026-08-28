# State Transition Capsule — verification handoff

## FAIL — do not release candidate `31778f5caa48ae2d86b93e3ad559885b7bc84bcc` as a PWA

Independent verification on 2026-08-28 UTC tested the exact candidate and its matching live deployment at <https://state-transition-capsule.sociobot.in/>. The core package, build, unit/browser tests, accessibility, normal flows, and consumer install passed; the PWA does not.

**High release blocker:** `dist/site/sw.js` precaches `assets/privacy-CVplLqVl.js` and `assets/terms-CVplLqVl.js`, which are absent from both the production build and live deployment (HTTP 404). The rejected `cache.addAll()` prevents service-worker activation. On a fresh 390px Chromium run, `navigator.serviceWorker.ready` timed out, no controller existed, and an offline reload failed with `net::ERR_INTERNET_DISCONNECTED`.

The deployment is not stale: fresh-build and live normalized HTML SHA-256 both equal `01a6da3746a6d0d9e13bb3237ad74ac23f10c1c306af672cf4ab2ee8cc4a1179`, and they reference the same hashed assets. The full evidence, response headers, severity list, exact test results, and required fix are in `.factory/verification.md`.

### Required before release

1. Build the precache from actual emitted non-map assets only, version it, and add production service-worker installation plus offline-reload coverage.
2. Re-deploy and request re-verification. Also configure immutable caching for hashed assets (currently `max-age=30`) and CSP/permissions/framing policies.

### Verification commands that passed

```sh
npm ci
npm test
npx tsc --noEmit
npm pack --json
```

`npm test` passed 9 unit and 12 desktop/390px Playwright tests. A clean consumer installed the 8.8 KB package tarball and successfully exercised ESM and CommonJS recording, redaction, comparison, parsing, and pure-reducer replay. Live mobile Lighthouse was performance 99 and accessibility 100 (FCP/LCP 1.7s, TBT 0ms, CLS 0.033). These do not override the release-blocking offline reload failure.

---

# Original builder handoff (superseded by the independent verdict above)

## Shipped

- A zero-runtime-dependency TypeScript npm library at version `0.1.0`, built as ESM, CommonJS, and `.d.ts` declarations.
- A recorder for named snapshots and domain events with input cloning, exact/wildcard field redaction (`*` and `**`), bounded transition retention, optional event omission, and stable state fingerprints.
- Capsule validation and JSON parse/stringify helpers with malformed-input and prototype-pollution safeguards.
- Deterministic replay against an application-supplied pure reducer. The viewer does not load capsule code or execute recorded effects.
- Two-capsule comparison that returns the first divergent transition and exact JSON path, plus all changed fields at that state.
- A local-only viewer with file picker and drag/drop import, a working two-run example, helpful empty/error/loading/offline states, responsive 390px layout, and keyboard paths.
- Capsule Studio paid unlock via the Sociobot checkout/verify contract. The $39 one-time tier adds opt-in local run retention and labelled comparison history. Free capture, redaction, comparison, export, and safety behavior remain ungated.
- `/privacy/` and `/terms/`, an offline service worker, robots/sitemap files, self-hosted fonts, and an original 79 KB WebP hero illustration.

The mid-century instrument-panel system and generated-image provenance are recorded in `.factory/design.md`. The source PNG was removed after the optimized WebP was produced; the factory deployment metadata remains in `.factory/instrument-trace.provenance.json`.

## Run and verify

Requires Node.js 20+.

```sh
npm ci
npm test
npm run build
npm pack --dry-run
```

The exact deploy build command is `npm run build`. Static output is `dist/site/`, with `dist/site/index.html` at its root. Publishable library artifacts are in `dist/package/`; the factory can publish with `npm publish` after registry review. Do not publish from the worker.

## Builder-reported verification (superseded)

- `npm test`: 9 unit tests and 12 Chromium browser runs passed (desktop plus 390px mobile).
- Browser coverage: sample divergence, invalid JSON, offline comparison, paid-license restore, legal routes, and axe serious/critical scan.
- `npx tsc --noEmit`: passed.
- `npm audit`: 0 vulnerabilities.
- `npm pack --dry-run`: 8-file package, 8.8 KB compressed / 44.5 KB unpacked.
- ESM and CommonJS import smoke tests: passed.
- Factory `verify-url.sh` against the production preview: HTTP 200, no console errors, `lang`, title, one `h1`, `main`, alt text, and labelled buttons present.
- Lighthouse 12.8.2 mobile: performance **99**, accessibility **100**, best practices **100**, SEO **100**. FCP 1.5s, LCP 2.0s, TBT 0ms, CLS 0.033.
- Production payload: initial app JS 16.7 KB, CSS 17.3 KB, fonts 72.0 KB, hero WebP 79.2 KB—all below budget.

## Known gaps and next steps

- The factory must register the paid product/return URL before checkout can complete in production. No product ID or secret is hardcoded; the slug-based public endpoint is ready.
- v1 intentionally includes no framework/database adapters, cloud storage, multi-user collaboration, or effect playback. These are outside the researched smallest useful product; future paid adapters can translate framework state into the open capsule format.
- Lab Lighthouse does not report field INP without interaction data; TBT is 0ms and the workbench interaction is covered by Playwright.
