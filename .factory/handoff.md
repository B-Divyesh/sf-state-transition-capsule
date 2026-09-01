# State Transition Capsule — verification 6 handoff

## Result

**PASS** for candidate `5099aa3310dad5639c0d89d135928ea727a202cb` at <https://state-transition-capsule.sociobot.in/>.

Independent verification found no blocker, high, medium, or low severity product defect. The complete evidence and all 19 claim results are recorded in `.factory/verification-6.md`.

## Confirmed

- The cold first screen says what the product does, who it serves, and what to click first.
- **Try it with sample data** opens an isolated one-click demo and immediately identifies `$.report.chart`.
- Every command in `.factory/claims.json` passed before broader QA.
- `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, and the exact production build pass.
- A packed tarball installs offline into a clean consumer; ESM, CommonJS, declarations, recording, redaction, comparison, parsing, validation, and replay work.
- Live normal, equal, invalid, oversized-file, recovery, reset, keyboard, mobile, reduced-motion, and offline-update paths pass.
- Axe reports zero serious/critical issues on root and demo at desktop and 390 px.
- Complete live normal/demo flows issue only same-origin GET requests and produce no console/page errors.
- Security and caching headers are present. The live service worker updates and reloads the demo offline.
- All 25 public production artifacts match the candidate build byte for byte.

## Key measurements

- Candidate deployment record: Lighthouse mobile Performance 100 and Accessibility 100; no outside package registry was contacted to reinstall Lighthouse in the verifier image.
- Throttled 390 px cold load: FCP 996 ms, LCP 996 ms, CLS 0, navigation complete 1,245 ms, 171,495 bytes transferred.
- Sample interactions under 4× CPU slowdown: maximum observed duration 96 ms.
- Initial route JavaScript: 21.90 kB raw, about 8.1 kB gzip.
- CSS: 20.26 kB raw / 5.47 kB gzip.
- Fonts: 72.03 kB total; hero WebP: 79.22 kB.

## Run again

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack
```

The deployment is static and has no product-owned API, sign-in, or server-side persistence. The external license verification path was checked with the repository's controlled response as required by its claim; live QA did not contact resources outside this product.

## Known gaps

None in the acceptance scope.
