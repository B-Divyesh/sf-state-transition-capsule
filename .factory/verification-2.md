# Independent verification 2 — FAIL

**Work order:** `state-transition-capsule-verify-2`  
**Candidate:** `428f5632714b877e2e99771159f7bcd753b8b3f2`  
**Live URL:** <https://state-transition-capsule.sociobot.in/>  
**Verified:** 2026-08-30 UTC from this clean checkout.

## Verdict

**FAIL — the mandatory claims gate is broken.** Three test commands published in `.factory/claims.json` cannot run with the repository's pinned Vitest version. The contract explicitly makes any failing claim test release-blocking. The underlying full suite and the live product otherwise passed the checks below; this is a release-contract/test-command failure, not evidence of a failed functional implementation.

## Release-blocking defects

### High — three mandatory claim commands fail before executing a test

After `npm ci`, I ran every `test` command exactly as recorded in `.factory/claims.json`, using the demo/browser entry point where applicable. These commands fail with exit code 1:

```text
npm run test:unit -- --grep @claim:redaction
npm run test:unit -- --grep @claim:pure-replay
npm run build && npm run test:artifacts -- --grep @claim:package-formats
```

Each reaches `vitest@3.2.7` and terminates with:

```text
CACError: Unknown option `--grep`
```

The corresponding complete suites pass, so the tagged tests exist, but that does not repair the exact claim commands visitors and verifiers are instructed to run. Replace the invalid selector with the supported Vitest selector and verify every claim command verbatim.

### High — several visitor-facing claims lack a matching claim entry/test

The claims inventory does not cover all literal promises on the landing page/README, contrary to the claims contract. Examples include `Capsules stay in this tab` (`site/index.html:61`), `No telemetry. No remote runtime.` (`site/index.html:145`), and the exact Studio price/one-time-purchase statement. The closest `local-processing` test only asserts that the demo makes no **cross-origin** request; it does not prove those storage, telemetry, runtime, or price promises. Add observable tests or remove/narrow the claims.

## Claim-test evidence

| Claim | Exact published command | Result |
| --- | --- | --- |
| `first-divergence` | `npm run test:e2e -- --grep @claim:first-divergence` | PASS — 2 Playwright projects, 2 passed |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 2 Playwright projects, 2 passed |
| `local-processing` | `npm run test:e2e -- --grep @claim:local-processing` | PASS — 2 Playwright projects, 2 passed |
| `offline-reload` | `npm run build && npm run test:e2e:production -- --grep @claim:offline-reload` | PASS — build plus 2 Playwright projects, 2 passed |
| `redaction` | `npm run test:unit -- --grep @claim:redaction` | **FAIL** — Vitest rejects `--grep` |
| `pure-replay` | `npm run test:unit -- --grep @claim:pure-replay` | **FAIL** — Vitest rejects `--grep` |
| `package-formats` | `npm run build && npm run test:artifacts -- --grep @claim:package-formats` | **FAIL** — Vitest rejects `--grep` |
| `license-restore` | `npm run test:e2e -- --grep @claim:license-restore` | PASS — 2 Playwright projects, 2 passed |

## What passed

### First read and demo

Cold-opening the live landing page answers all three required questions in plain words: it finds the state change that broke a second run; it is for developers debugging repeat-run failures; and the first action is **Try it with sample data**, explicitly saying it loads two sample runs in a separate demo. The one-click `/demo` entry immediately displays the isolated demo banner, the first divergence `$.report.chart`, and `State changed after “chart.selected”.`

### Clean local gates and package consumer

- `npm ci` completed with 0 reported vulnerabilities.
- `npm test` passed: 9 unit tests; a clean exact production build; 3 artifact tests; 24 development Playwright tests passed with 2 expected production-only skips; 2 production service-worker tests passed.
- `npm run typecheck` and `npm run lint` passed.
- `npm pack --json` produced `state-transition-capsule-0.1.0.tgz` (9,203 bytes compressed; 45,492 bytes unpacked; 8 files). A fresh temporary consumer installed it and exercised the public ESM API (`$.n`, successful pure replay) and CJS API (`state-transition-capsule/v1`).

### Independent live product exercise

- Desktop normal flow: `/demo` identified `$.report.chart` after `chart.selected` with no console/page errors and no request outside `state-transition-capsule.sociobot.in`.
- Invalid JSON: `broken.json: The selected file is not valid JSON.` The **Load two-run example** recovery re-enabled Compare and produced the divergence.
- Boundary: a 5 MiB + 1 byte file was rejected with the documented local safety-limit message and Compare remained disabled.
- Keyboard: Tab focused the skip link; Space loaded the example; Enter compared it successfully. Reduced-motion mode computed a `1e-05s` body transition duration.
- Mobile 390×844: no horizontal overflow (`390 == 390`); tested buttons were 44px, 44px, and 50.8px high. The live worker controlled the reloaded page, `registration.update()` remained `activated`, and offline reload of `/demo` preserved the result.
- Axe on live `/demo` found no serious or critical violations. `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` each returned 200 with `lang=en`, exactly one `main`, exactly one `h1`, a nonempty route title, no missing image alt text, and no console/page errors.

### Deployment, privacy, headers, and budgets

- Live normal-demo request log contained only same-origin HTML, JS/CSS/font/image assets; no analytics, remote font/CDN, or capsule upload was observed.
- `Content-Security-Policy`, `Permissions-Policy`, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict referrer policy are present. Hashed JS/CSS assets return `public, max-age=31536000, immutable`; `/sw.js` returns `no-cache`; unknown route returns HTTP 404.
- Fresh candidate and deployment are identical: `index.html` SHA-256 `7574c3a8e3337ab31e4ee1bdcf21989e3e5e518c38da8aa656b92aaeec73377b`; `sw.js` SHA-256 `393059090d053cb4f3f9b33592b26a5d3c6c669013a3492c056378c4a22b3e12`; main JS bytes also matched.
- Initial app JS is 17,548 bytes (6,638 bytes gzip), CSS 18,371 bytes (5,145 bytes gzip), fonts total 72,032 bytes, and the hero WebP is 79,218 bytes: within the supplied static budgets.

## Endpoint/rate-limit scope

There is no product-owned server endpoint in this static deployment. The only configured remote endpoint is the Sociobot billing license verifier, which repository tests mock. Per the work-order restriction not to connect to resources outside `sf-state-transition-capsule`, I did not contact `api.sociobot.in`; no documented allowance could therefore be observed. This does not affect the normal or demo request-log result above.

## Required remediation

1. Correct the three Vitest claim commands and run every `.factory/claims.json` command exactly after `npm ci`.
2. Inventory the landing page and README for all claim-like promises; add an observable test per claim or remove/narrow the unsupported promise.
3. Re-run independent verification. Do not release this candidate until the claims table is fully executable and complete.
