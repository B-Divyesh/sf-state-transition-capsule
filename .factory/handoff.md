# State Transition Capsule — polish round 4 handoff

## Result

**PASS.** Repair commit `5764ef3fb800e250ee9a067d7cd8f48cf93a77ee` fixes every finding in reviews 1–4 and the prior polish records. It is deployed to <https://state-transition-capsule.sociobot.in/> as Static Web Apps deployment `ba865240-009a-4c43-882e-ce164d31bf72`.

## What changed

- Runtime viewer language now consistently says **run file** and describes the first transition that differs in plain words.
- README and demo documentation now accurately say that bundled samples stay in memory. Demo entry, reset, and exit clear stale `demo:` keys from local and session storage.
- File-import failures now give short, actionable JSON/schema/read recovery messages instead of raw parser dumps.
- The initial-state result now reads “The runs start from different states.”
- Added browser coverage for terminology, both recovery messages and their word counts, initial-state grammar, and demo-memory isolation through entry, reset, and exit.
- Updated the catalog description to a 74-character verb-first sentence.

## Verification

- Fresh clone: `/tmp/stc-polish4-final.YWUGST/clone` at release-record commit `1422574` (product repair `5764ef3`); `npm ci` completed with 0 vulnerabilities.
- All 20 `.factory/claims.json` commands passed independently from that clean clone.
- Local: `npm test`, `npm run typecheck`, `npm run lint`, and `npm pack --json` passed. The browser suite ran 56 desktop/mobile tests; the production offline suite passed for desktop and mobile.
- Live cold root and demo: `verify-url.sh` passed with HTTP 200, correct titles, `lang=en`, one h1, one main, complete image alt text, and no console errors. Evidence: `.factory/evidence/polish-4/root/verify.json` and `.factory/evidence/polish-4/demo/verify.json`.
- Live browser check passed the repaired terminology, malformed/schema error text, in-memory demo storage check, editable playground, initial-state wording, legal routes, designed 404, mobile banner, no overflow, and Playwright Axe with 0 serious/critical findings. Evidence: `.factory/evidence/polish-4/live-check.json`.
- Live offline reload passed with service-worker control and `$.report.chart` visible: `.factory/evidence/polish-4/live-offline.json`.
- `npm run test:links:live` passed: 5 routes, 12 unique links, 0 checkout links, and a designed HTTP 404.
- Full finding-to-change-to-evidence map: `.factory/polish-4.md`.

## Run and publish

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack
```

`npm pack` produces the ready-to-publish local package tarball. Publishing is intentionally left to the factory registry owner.

## Known gaps and next steps

None. The npm registry publish itself remains a factory-owned release action; do not publish from this repository.
