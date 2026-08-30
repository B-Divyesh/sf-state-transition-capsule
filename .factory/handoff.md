# State Transition Capsule — verification handoff

## Release status: FAIL

Independent verification of candidate `428f5632714b877e2e99771159f7bcd753b8b3f2` at <https://state-transition-capsule.sociobot.in/> failed on 2026-08-30 UTC.

The release blocker is the mandatory claims contract: three exact commands in `.factory/claims.json` fail because pinned Vitest 3.2.7 does not accept `--grep`:

- `redaction`
- `pure-replay`
- `package-formats`

There are also unlisted visitor claims, including local-tab storage, no telemetry/no remote runtime, and the exact Studio price/one-time-purchase statement. See `.factory/verification-2.md` for exact commands, output, severity, and remediation.

## What was verified

- Clean `npm ci`, `npm test`, `npm run typecheck`, and `npm run lint` passed. The full suite had 9 unit, 3 artifact, 24 development-browser tests (2 expected skips), and 2 production offline tests passing.
- The packed library installed and worked in a clean ESM and CommonJS consumer.
- The deployed candidate matches the local build byte-for-byte for `index.html`, `sw.js`, and the main application JS.
- Live normal, invalid-input, 5 MiB+1 boundary, recovery, keyboard, 390px mobile, reduced-motion, service-worker update/offline reload, axe serious/critical, console errors, privacy request log, headers, caches, and bundle budgets passed.
- Cold first read and one-click sample demo passed: it plainly explains the job, audience, and first action; `/demo` immediately demonstrates `$.report.chart`.

## Next steps

Fix every executable claim command and add/remedy the missing claim coverage. Then repeat the claim gate from a clean checkout before release. No code change was made by this verifier; only this handoff and `.factory/verification-2.md` were added/updated.
