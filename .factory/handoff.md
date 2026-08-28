# State Transition Capsule — build handoff

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

## Verification completed

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
