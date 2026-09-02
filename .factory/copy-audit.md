# Copy audit — 2 September 2026, polish round 5

Counts use whitespace-separated words. Code, URLs, navigation labels, and required legal text are excluded. Every landing-page sentence is at or below 22 words. No banned plain-words term appears.

## Landing-page sentences

```text
 9  Find the state change that broke the second run.
16  For developers debugging repeat-run failures, it compares two run files and names the first changed field.
 8  Loads two sample runs in a separate demo.
 6  Run files stay in this tab.
 6  Works offline after the first visit.
 5  Free viewer · no account required.
11  The viewer compares two runs and marks the first changed field.
12  Load a known-good run file and a failed run file.
 7  Files stay in this tab by default.
15  Import JSON run files or load the example to see the first changed field.
 3  Edit the JSON.
16  The browser records two run files, exports and imports them, then compares them locally.
12  Change a value such as "line", then pause briefly to update the output.
15  Run files contain the state and events you declare.
11  Review JSON on another machine, and redact sensitive fields before recording.
 7  Wrap the point where durable state changes.
11  Set how many recent transitions each run file keeps.
10  Replace exact or wildcard paths before anything reaches the run file.
11  Align snapshots in order and stop at the first changed field.
13  Build this source checkout with npm pack to create a local package tarball.
 5  Compare runs without an account.
12  The open package records run files, and the browser viewer compares them locally.
 2  No sign-up.
 3  No payment step.
 4  No run file upload.
 9  New Studio licenses are not offered in this release.
 5  No checkout link is shown.
 5  Compare recorded state changes locally.
```

## README opening

```text
 7  Record state before and after application events.
12  Redact secrets, replay transitions, and find the first changed field between runs.
13  For application developers debugging a second run that fails after persisted state changes.
14  The browser viewer compares JSON run files locally and does not execute their contents.
```

## README sample wording

```text
 5  Open /demo or add ?demo=1.
13  It loads two report run files in memory and does not save them.
 9  The banner offers Reset demo and Start for real.
 9  The sample identifies $.report.chart as the first changed field.
```

## README build wording

```text
16  Build a local tarball from this checkout, then install that exact file in a fresh project.
 9  npm run build:site writes the static deployment to dist/site/.
```

The in-memory sample sentence maps to `@claim:demo-isolation`; its browser flow checks entry, reset, and exit against local storage, session storage, and IndexedDB. The removed publishing-readiness and factory-workflow statements make no untested release promise. The remaining output sentence maps to `@claim:site-build-output`.

The source-install code block is executed verbatim by `@claim:local-tarball-install`. It creates `../stc-consumer`, packs the tarball there, then installs `./state-transition-capsule-0.1.0.tgz`; no checkout directory name is assumed.

## README availability and privacy wording

```text
17  The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers.
 9  This release offers no Studio registration or checkout link.
 7  The browser viewer works without an account.
 6  Run files may contain sensitive data.
11  Prefer broad redaction rules and inspect exported JSON before sharing it.
 7  Redaction replaces values; it is not encryption.
12  The viewer processes run files locally and does not upload their contents.
12  Standard and demo visits make no telemetry, API, or third-party runtime request.
 7  The viewer works offline after the first visit.
```

## Terminology

| Concept | One term used |
| --- | --- |
| JSON artifact from a recorded run | run file |
| Successful input | known-good run file |
| Later failure input | failed run file |
| Earliest unequal result | first changed field |
| Browser comparison interface | comparison viewer |
| Operator-gated paid tier | Studio |
| Isolated bundled sample | demo |

## First-screen read-aloud

“Find the state change that broke the second run. For developers debugging repeat-run failures, it compares two run files and names the first changed field. Try it with sample data.”

This states the task, audience, result, and first action in one screen.

## Runtime and error copy

```text
 7         [name] loaded as the known-good/failed run file.
15         [file] is not valid JSON. Export the run file again, then choose the new file.
17         [file] is missing the run-file format and required fields. Export it again, then choose the new file.
10         [file] could not be read. Choose the run file again.
 7         The runs start from different states.
10         Changed fields in the first transition that differs between runs.
```

All runtime sentences are at or below 22 words. The browser test `uses established run-file terms in viewer messages and result descriptions` rejects `bay`, `capsule`, and `divergent` in comparison-viewer text. The import-error test asserts the recovery actions and both word counts.
