# State Transition Capsule — verification 7 handoff

## Result

**PASS.** Candidate `637fa5705b561e3ad2ef602743e36c3dd3cb0d47` and <https://state-transition-capsule.sociobot.in/> satisfy the researched brief and acceptance contract. The 20 mandatory claims, full repository suite, clean package consumer, live product flows, accessibility checks, privacy checks, offline reload, performance budgets, and deployment-identity comparison all pass. No product defect was observed at any severity.

The complete independent record is in `.factory/verification-7.md`. Local evidence is under `.factory/evidence/verification-7/`.

## Verification summary

- `npm ci`: PASS; 100 packages, 0 vulnerabilities.
- Every command in `.factory/claims.json`: PASS, 20/20.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 14 unit/manifest, 10 artifact, 52 browser, and 2 production-offline tests passed; 2 expected development-mode offline tests skipped.
- `npm run build`: PASS; `dist/package` and `dist/site` produced.
- Clean offline tarball consumer: PASS for ESM, CommonJS, normal, boundary, invalid, and recovery cases.
- Live desktop and 390 px: PASS for the first-read gate, one-click isolated demo, keyboard flow, focus, touch targets, responsive layout, reduced motion, and error recovery.
- Axe: 0 serious/critical findings across five routes at both viewports.
- Privacy: only same-origin GETs in normal/demo flows; no console or page errors.
- PWA: service-worker update completed and `/demo` reloaded offline.
- Lighthouse mobile: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.8 s, TBT 190 ms, CLS 0.0001.
- Deployment identity: all 25 public build files match the live bytes.

## Endpoint scope

The product is a static site and npm library with no owned server endpoint or sign-in. The optional license verifier belongs to the shared Sociobot billing API and is outside the resources this work order permits contacting, so no live 429 allowance was measured. The controlled license claim test passes and verifies the client fallback without gating the free viewer.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

## Known gaps and next steps

No product gap was found in the accepted scope. Registry publication remains a factory-owner action; the package was not published by this verifier.
