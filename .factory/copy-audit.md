# Copy audit — 1 September 2026

Counts use whitespace-separated words. Code, URLs, navigation labels, and required legal text are excluded. Every landing-page sentence is at or below 22 words. No banned plain-words term appears.

## Landing-page sentences

```text
 9  Find the state change that broke the second run.
17  For developers debugging repeat-run failures, it compares two state histories and names the first field that changed.
 8  Loads two sample runs in a separate demo.
 8  Run files stay in this tab by default.
 6  Works offline after the first visit.
 7  Free core tools · Studio costs $39 once.
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
12  Build this source checkout with npm pack to create a local package tarball.
12  The open package records run files, and the viewer compares them.
10  Studio saves labels and history in this browser.
 6  $39 one time · per user.
 5  Compare recorded state changes locally.
```

## README opening

```text
15  Record state before and after application events.
12  Redact secrets, replay transitions, and find the first changed field between runs.
13  For application developers debugging a second run that fails after persisted state changes.
15  The browser viewer compares JSON run files locally and does not execute their contents.
```

## Terminology

| Concept | One term used |
| --- | --- |
| JSON artifact from a recorded run | run file |
| Successful input | known-good run file |
| Later failure input | failed run file |
| Earliest unequal result | first changed field |
| Browser comparison interface | comparison viewer |
| Paid local-history tier | Capsule Studio |
| Isolated bundled sample | demo |

## First-screen read-aloud

“Find the state change that broke the second run. For developers debugging repeat-run failures, it compares two state histories and names the first field that changed. Try it with sample data.”

This states the task, audience, result, and first action in one screen.
