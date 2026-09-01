# State Transition Capsule — verification 8 handoff

## Result

**PASS** for candidate `ae1cebd2355ce1b4b4411ae6c17d8f1769cbca89` at <https://state-transition-capsule.sociobot.in/>. The candidate removes the previously broken Studio checkout CTA and plainly presents the release as a free, account-free local viewer. No product-code changes were made during verification.

## Verified

- All 20 declared `.factory/claims.json` commands passed individually from a clean install.
- `npm test`, `npm run build`, `npm run typecheck`, and `npm run lint` passed.
- The built package was packed/installed/imported in the artifact suite as ESM, CommonJS, and TypeScript declarations.
- The live first screen and one-click `/demo` sandbox clearly explain the job, audience, and first action; sample comparison identifies `$.report.chart` at desktop and 390 px.
- Live privacy request logging observed only same-origin GET static requests. The service worker controlled a fresh browser and reloaded `/demo` offline successfully.
- Live accessibility, keyboard, focus, motion, headers, response caching, browser errors, and Axe checks passed. Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO.
- Fresh candidate build and live deployment bytes match for the HTML routes, service worker, runtime assets, images, favicon, robots, and sitemap.

## How to verify locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Open `https://state-transition-capsule.sociobot.in/demo` and confirm the sample divergence at `$.report.chart`. The detailed independent record is in `.factory/verification-8.md`.

## Known gaps

None. This static local-first release has no product server API, sign-in, checkout, or product-unlock endpoint; rate-limit and Entra checks are not applicable.
