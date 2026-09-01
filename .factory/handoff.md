# State Transition Capsule — polish 1 handoff

## Delivered

Repair commit `7b3b718fb1985b68aca5c1f478c13d27bbd02076` resolves all 22 findings in adversarial review 1. The deployed static site is <https://state-transition-capsule.sociobot.in/>.

- The one-click `/demo` and `?demo=1` paths use the isolated `demo:` namespace, show a persistent mobile disclosure, and keep Reset demo / Start for real usable.
- The documentation site now includes an editable in-browser library playground with live package output for comparison, redaction, and replay.
- `.factory/claims.json` inventories 19 visitor-facing claims. Every claim has exactly one tagged observable test.
- The registry-install implication was removed. The README documents and the test suite proves a local `npm pack` tarball install in a fresh project.
- Demo and 404 are real route documents with route-specific title, canonical, Open Graph, and Twitter metadata. Same-site navigation and Back focus the destination `h1` and announce the route.
- Landing/README terms and controls use plain, consistent wording. The catalog description is verb-first and 73 characters.

See `.factory/polish-1.md` for the F-1-1 through F-1-22 mapping and exact evidence.

## Verification

From a clean local clone at `/tmp/tmp.UGQkrzdoMU/clone`:

```sh
npm ci
# every command listed in .factory/claims.json, run verbatim
```

All 19 claim commands passed. The fresh install reported 0 vulnerabilities.

In the repair checkout:

```sh
npm test
```

Passed: 13 unit/manifest tests, build, 9 artifact tests, 50 browser tests (2 expected development skips), and 2 production offline tests. `npm run typecheck` also passes.

Live verification after deployment:

- `/opt/fleet/lib/verify-url.sh https://state-transition-capsule.sociobot.in/demo /tmp/tmp.wRvAjUxDe8` passed in 837 ms with zero console errors, correct title/lang/landmarks, one `h1`, and no missing image alt text.
- Production cold checks passed at 390×844 and 1440×900. Evidence screenshots: `/tmp/tmp.wRvAjUxDe8/screenshot-mobile.png` and `/tmp/tmp.wRvAjUxDe8/screenshot-desktop.png`.
- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` return 200. An unknown route returns the designed `404` page with HTTP 404.
- Browser Axe integration reported zero serious/critical issues at mobile and desktop.
- Lighthouse mobile production root: Performance 100, Accessibility 100, LCP 0.2 s, CLS 0, TBT 0 ms. Report: `/tmp/stc-lighthouse.json`.
- Build output: primary site JavaScript is 21.14 kB raw / 7.63 kB gzip; total deployed artifact size reported by the deployment was 365,094 bytes.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm pack
```

`npm run build` creates the npm package under `dist/package/` and the static site under `dist/site/`. Publishing to the npm registry remains factory-owned; the checked tarball is ready for that release step.

## Known gaps

None in the shipped product or review acceptance criteria.
