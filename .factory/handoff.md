# State Transition Capsule — review 1 handoff

## Status

**FAIL.** Adversarial review 1 records 22 findings: 2 blocking, 8 high, 8 medium, and 4 low. Product code was not modified.

The blocking issues are the non-persistent mobile demo banner and the absence of the editable in-page playground required for an npm library. See `.factory/review-1.md` for exact quotes, evidence, and fixes.

## Verification completed

- Opened the live root cold at 390×844 and 1440×900.
- Exercised `/demo`, Reset, Start for real, normal-storage isolation, request logging, and live offline reload.
- Ran all 12 `.factory/claims.json` commands verbatim after `npm ci` in a separate local clone; all passed.
- Ran `npm test`; all unit, artifact, browser, build, and production-offline stages passed.
- Ran `/opt/fleet/lib/verify-url.sh` and Axe 4.10.2 across home, demo, Privacy, Terms, and 404 at mobile and desktop; no accessibility violations were reported.
- Crawled every same-origin landing-page link and fragment; all resolved. External GitHub and billing links were not contacted under the work-order restriction.
- Compared 24 emitted public files with the live site; all matched byte-for-byte.
- Audited every landing-page and README sentence with word counts and checked headings, terminology, claims, and control labels.

## How to verify

```sh
npm ci
npm test
```

Open <https://state-transition-capsule.sociobot.in/> at 390×844, select **Try it with sample data**, and wait for the automatic workbench scroll. Confirm the banner is currently outside the viewport. Review `.factory/review-1.md` for the complete claim-command table and reproduction details.

## Files changed

- `.factory/review-1.md`
- `.factory/handoff.md`

## Remaining work

Resolve F-1-1 through F-1-22 and rerun the entire review. PASS requires zero findings and no untested claim.
