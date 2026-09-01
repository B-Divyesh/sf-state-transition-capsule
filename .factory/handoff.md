# State Transition Capsule — repair handoff

## Release status: PASS — deployed

This repair addresses independent verifier report commit
`f79d3cfeb3f69c6d73df88899069c1905c5da181` for candidate
`bbcee08062851b6391184a52c8e253d5cd939c8e`. Product changes through
`797e9d9` are pushed to `main` and deployed at
<https://state-transition-capsule.sociobot.in/>.

## Reproduced findings and repairs

1. **Serious accessible-name mismatch:** before editing, Axe 4.10.2 with
   `label-content-name-mismatch` reported one serious violation on
   `.install-command` on `/` and `/demo` in desktop and 390×844 contexts.
   The visible label was `npm i state-transition-capsule Copy`, while the
   forced name was `Copy npm install command`. The forced `aria-label` was
   removed, so the control now derives the exact visible accessible name.
   Copy feedback changes both visible text and name to
   `npm i state-transition-capsule Copied`. The copied value remains
   `npm install state-transition-capsule`.
2. **Undersized mobile targets:** the original 390px measurements reproduced
   the report: brand 48×32, header Demo 40×44, Studio Terms 37×16, Studio
   Privacy 45×16, and footer Terms 42×44. Shared header, footer, brand, and
   fine-print link styles now give every visible link, button, and explicit
   file label a minimum 44×44 target. The live minimum is 44×44 on desktop
   and 45×44 at 390px.
3. **Supporting text below 16px:** the action note reproduced at 13px, hero
   facts at 12px, and Studio fine print/footer at 13px. Each now computes to
   16px. At 390×844 all three facts still fit in the first viewport, ending at
   804px, with no horizontal overflow.
4. **Missing legal social metadata:** Privacy and Terms originally exposed no
   Open Graph or Twitter fields. Both now include route-specific title,
   description, URL, the original 1200×630 image, and large-image card data.

A fresh Lighthouse check also exposed the mobile wordmark's visible `ST/C`
text missing from its accessible name. Every route now uses
`ST/C State Transition Capsule home`, and the first-view IBM Plex Mono 400
font is preloaded as the second permitted font preload to keep landing-page
layout shift within budget.

## Exact regressions

[`tests/browser/site.spec.ts`](../tests/browser/site.spec.ts) now runs these
checks in both desktop Chromium and a 390×844 Chromium project:

- Default Axe plus the explicit experimental
  `label-content-name-mismatch` rule on `/` and `/demo`.
- Exact pre-copy and post-copy accessible names, exact clipboard contents,
  and the wordmark name.
- Width and height of every visible link, button, and explicit file label on
  demo, legal, and 404 routes; each dimension must be at least 44px.
- A computed 16px floor for the action note, all hero facts, Studio fine
  print, and footer.
- Route-specific Open Graph and Twitter metadata on Privacy and Terms.

[`tests/build-artifacts.test.ts`](../tests/build-artifacts.test.ts) verifies
that the two declared first-view font preloads exist in the production build.

## Clean verification

All checks passed from the repaired checkout on 1 September 2026:

```sh
npm ci                              # 100 packages; 0 vulnerabilities
npm run typecheck                   # pass
npm run lint                        # pass
npm audit --audit-level=high        # 0 vulnerabilities
npm test                            # 11 unit/manifest; 5 artifact;
                                    # 36 browser pass, 2 production-only skip;
                                    # 2 production offline pass
npm run build                       # dist/package and dist/site
npm pack --json                     # 9,219 bytes; 45,552 unpacked; 8 files
```

Every one of the 12 commands in [`.factory/claims.json`](claims.json) was run
exactly against the final source. All 12 passed in both configured browser
projects where applicable, including the isolated service-worker context for
`offline-reload`.

A fresh temporary consumer installed the tarball and exercised ESM and
CommonJS. ESM verified recording, redaction, serialization/parsing,
validation, `$.report.chart` as the first divergence, and pure replay.
CommonJS independently completed pure replay. The package has no runtime or
bundled dependencies and ships ESM, CommonJS, and declarations.

Production-browser checks on desktop and 390px found:

- zero default serious/critical Axe findings and zero explicit
  `label-content-name-mismatch` findings on `/` and `/demo`;
- no horizontal overflow, no console/page errors, and no non-GET or
  cross-origin request during the normal comparison flow;
- compare result rendered in 66.3ms desktop and 61.2ms mobile;
- reduced-motion matched, used automatic scrolling, and left zero running
  animations;
- keyboard, invalid JSON, 5 MiB rejection, recovery, demo isolation, local
  storage, privacy, license mocking, and copy flows passed in `npm test`.

The factory URL verifier passed the final live `/demo` in 748ms: HTTP 200,
`Demo — State Transition Capsule`, `lang=en`, one `h1`, one `main`, complete
image alt text, named buttons, and zero console/page errors.

Final live mobile Lighthouse 12.8.2 on `/`:

- Performance **100**, accessibility **100**, best practices **100**, SEO
  **100**.
- FCP **0.9s**, LCP **1.6s**, TBT **10ms**, CLS **0.000096**.
- Total transferred bytes **169,105**; label/content-name audit passed.

The production build remains within budget: main JS 17.55 KB raw / 6.58 KB
gzip, CSS 18.57 KB raw / 5.17 KB gzip, self-hosted fonts 72.03 KB, and hero
WebP 79.22 KB.

## Deployment and live identity

`dist/site` was uploaded directly to the existing permitted
`sf-state-transition-capsule` Static Web App. The deployment did not inspect
or mutate DNS, billing, another app, database, key vault, or any other cloud
resource.

All **24/24** served artifacts match the final local build byte for byte.
Representative SHA-256 values:

- `index.html`:
  `418b9a125b90abd775450f3a210ba90446dfed1530ac4dfe6630acf61a799ab4`
- `sw.js`:
  `0b858261a7ea355304162fa2fd4337d4c8ab4debebf148aee5b8d4456e088f52`

Live responses retain CSP with `frame-ancestors 'none'`, Permissions-Policy,
strict referrer policy, `nosniff`, `X-Frame-Options: DENY`, 30-second HTML
revalidation, immutable hashed-asset caching, and `no-cache` for `sw.js`. A
missing route returns the designed 404 with HTTP 404.

A fresh live 390×844 context installed and activated the final worker,
completed `registration.update()`, and reloaded `/demo` offline with
`$.report.chart` visible and no console/page errors.

## Known limits and next step

No release-blocking gap is known. The external billing API was not contacted,
as the work order permits access only to the product's own static resource;
mocked integration coverage verifies the license flow. The npm package was
packed but not published because registry publication belongs to the factory.
