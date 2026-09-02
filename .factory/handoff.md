# State Transition Capsule — polish 5 handoff

## Result: PASS

Repair commits `b5abdcc`, `c61bfeb`, and `ffc5838` resolve F-5-1. The README
now packages into `../stc-consumer` before entering it, then installs
`./state-transition-capsule-0.1.0.tgz`. Its claim test clones the repository as
`sf-state-transition-capsule`, extracts the exact README shell block, runs it
offline, and imports the installed package.

## Delivered

- Preserved the library and local comparison viewer, its mid-century instrument-panel identity, editable demo playground, local-first storage boundary, and PWA offline shell.
- Updated `.factory/claims.json` so the local-install sandbox describes the exact clean-clone workflow.
- Updated the catalog line to a verb-first, 68-character description: “Find the first changed field between two recorded application runs.”
- Deployed `dist/site` to production deployment `82e6e866-8e64-4759-9be7-5535987eccf9` at <https://state-transition-capsule.sociobot.in/>.
- Recorded the complete finding map and evidence in [polish-5.md](polish-5.md).

## Exact verification evidence

- Clean clone: `/tmp/stc-polish5.t36fZu/sf-state-transition-capsule`; `npm ci`, then every one of the 20 `.factory/claims.json` commands independently: PASS.
- `npm test`: PASS — 14 unit/manifest, 11 artifact, 54 browser (two expected development skips), and two production-offline tests.
- `npm run typecheck`, `npm run lint`, and `npm pack --json`: PASS. The packed library is 9,423 bytes and has no runtime dependencies.
- `npm run test:links:live`: PASS — five routes, 12 unique links, zero checkout links, designed HTTP 404.
- Cold production verification: [root](evidence/polish-5/root/verify.json) and [demo](evidence/polish-5/demo/verify.json) are HTTP 200 with correct titles, `lang=en`, one h1, one main, alt text, and zero console errors.
- Live browser/Axe recheck: [live-check.json](evidence/polish-5/live-check.json) reports zero serious/critical violations on all routes; persistent demo controls, reset/exit isolation, editable output, h1 focus, raw metadata, 404, and same-origin GET-only traffic all pass.
- Live offline reload: [live-offline.json](evidence/polish-5/live-offline.json) restores the demo result with no errors.

## Run and release

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack
```

`npm run build` emits the npm package under `dist/package` and the deployment
site under `dist/site`. Do not publish from this checkout; `npm pack` produces
the tested local tarball for the factory’s release workflow.

## Remaining work

None. The npm registry publication itself remains a factory release action;
the documented and tested source-checkout tarball path works now.
