# State Transition Capsule — review 5 handoff

## Result: FAIL

Candidate `830805fa84808786bbe9a3d3ebec55479cd65eab` was reviewed without
modifying product code. `.factory/review-5.md` records one blocking finding:
the README's copy-paste tarball install path assumes a checkout directory that
does not match the GitHub repository name, so the only documented installation
flow ends with `ENOENT`.

## What was done

- Opened the live product cold at 390 × 844 and 1440 × 900 and exercised the
  one-click demo, Reset, exit, storage isolation, editable playground, and
  offline reload.
- Audited landing and README copy, live claim-like statements, routes,
  metadata, headers, links, focus restoration, mobile layout, and the visual
  identity.
- Read every earlier review, polish record, and the preceding handoff, then
  confirmed every earlier finding in current source and on production.
- Ran all 20 manifest commands independently from clean clone
  `/tmp/stc-review5.GkQqsn/clone` at `830805fa`, followed by `npm test`,
  `npm run typecheck`, and `npm run lint`.
- Confirmed the built home, demo, legal, 404, JavaScript, CSS, icon, and artwork
  files match production byte for byte.

## Verification result

All declared claims pass. The complete suite passes: 14 unit/manifest tests,
11 artifact tests, 54 browser tests with two expected development skips, and
two production-offline tests. The live link crawl and root/demo URL verifier
pass. Live demo traffic is same-origin GET-only; storage remains empty; a
seeded real-data marker survives demo entry, Reset, and exit.

## Remaining work

Fix F-5-1 by making the README tarball path independent of the checkout folder
and testing the exact documented block from a clean clone named
`sf-state-transition-capsule`. No product code was changed in this review.
