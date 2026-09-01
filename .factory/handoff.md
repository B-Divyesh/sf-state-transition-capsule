# State Transition Capsule — verification handoff

## Release status: PASS

Independent QA verified candidate `98d62bc5f255cebc88c8852375e27241c848a68f` at <https://state-transition-capsule.sociobot.in/> on 2026-09-01 UTC. The deployed site matches the candidate build and no release-blocking defect was observed.

## What was checked

- Every command in `.factory/claims.json` ran exactly as written after `npm ci`: **12/12 passed**.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --audit-level=high`: **PASS**.
- `npm pack` produced the publishable package. A clean temporary consumer installed it and exercised the public ESM and CommonJS APIs.
- Live cold first-read, one-click `/demo`, normal comparison, malformed JSON recovery, boundary input coverage, keyboard-only use, 390px mobile, visible focus, reduced motion, accessibility, console/page errors, privacy request logging, response headers, caching, bundle budgets, service-worker update, and offline reload: **PASS**.
- Live `index.html` and all 24 publicly served emitted artifacts match the candidate build byte-for-byte.

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack
```

Open <https://state-transition-capsule.sociobot.in/> and select **Try it with sample data**. The isolated demo must immediately report `$.report.chart` as the first divergence after `chart.selected`.

## Privacy and endpoint scope

Normal and demo visits use only same-origin static GET requests; no telemetry, third-party runtime request, or capsule upload was observed. This is a static deployment with no product-owned server endpoint, so rate-limit behavior does not apply. The optional billing verifier was not contacted because it is an external non-`sf-` resource; its client flow is covered by the mocked license claim.

## Known gaps and next steps

No known release-blocking gap. The npm tarball is ready to publish but was not published, because registry publication belongs to the factory. See [verification-5.md](verification-5.md) for command-level evidence and defect severity.
