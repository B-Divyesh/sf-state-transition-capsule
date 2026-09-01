# State Transition Capsule

Record state before and after application events. Redact secrets, replay transitions, and find the first changed field between runs.

For application developers debugging a second run that fails after persisted state changes. The browser viewer compares JSON run files locally and does not execute their contents.

Live viewer: <https://state-transition-capsule.sociobot.in> · isolated sample: <https://state-transition-capsule.sociobot.in/demo>

## Try the sample

Open `/demo` or add `?demo=1`. It loads two report run files in the separate `demo:` browser-storage namespace. The banner offers **Reset demo** and **Start for real**. The sample identifies `$.report.chart` as the first changed field.

## Install from this source checkout

Build a local tarball from this checkout, then install that exact file in a fresh project:

```sh
npm ci
npm run build
npm pack
mkdir ../stc-consumer && cd ../stc-consumer
npm init -y
npm install ../state-transition-capsule/state-transition-capsule-0.1.0.tgz
```

The package has no runtime dependencies and supports ESM, CommonJS, and TypeScript declarations.

## Record a run file

```ts
import { createRecorder, stringifyCapsule } from "state-transition-capsule";

const recorder = createRecorder({
  name: "finance report / run 2",
  initialState: { report: null, auth: { token: "secret" } },
  redact: ["auth.token", "**.password"],
  retention: { maxTransitions: 100, includeEvents: true }
});

recorder.record(
  { type: "report.requested", query: "quarterly revenue" },
  { report: { chart: "bar" }, auth: { token: "secret" } }
);

const json = stringifyCapsule(recorder.capsule());
```

Configured fields are redacted before state, event, and metadata values enter a run file. Inputs are cloned and never mutated.

## Compare two run files

```ts
import { compareCapsules, parseCapsule } from "state-transition-capsule";

const knownGood = parseCapsule(knownGoodJson);
const failedRun = parseCapsule(failedRunJson);
const report = compareCapsules(knownGood, failedRun);

console.log(report.firstDivergence?.path); // "$.report.chart"
```

Run files serialize as JSON, parse on another machine, and retain the same comparison result. The viewer handles their text as data; it does not run scripts or make external changes.

## Replay a reducer

```ts
import { replayCapsule } from "state-transition-capsule";

const report = replayCapsule(capsule, (state, event) => {
  if (event.type === "increment") return { count: state.count + 1 };
  return state;
});

if (!report.ok) console.error(report.firstDivergence);
```

Replay calls only the reducer supplied by your application process.

## Format and API

The public API exports `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus TypeScript types. Run files use the versioned media marker `state-transition-capsule/v1`.

The free package records run files, exports and imports JSON, redacts values, compares state, and replays supplied reducers. This release offers no Studio registration or checkout link. The browser viewer works without an account.

## Privacy

Run files may contain sensitive data. Prefer broad redaction rules and inspect exported JSON before sharing it. Redaction replaces values; it is not encryption. The viewer processes run files locally and does not upload their contents. Standard and demo visits make no telemetry, API, or third-party runtime request. The viewer works offline after the first visit.

Read the site [Privacy policy](https://state-transition-capsule.sociobot.in/privacy/) and [Terms](https://state-transition-capsule.sociobot.in/terms/).

## Develop, test, and deploy

Requires Node.js 20+.

```sh
npm ci
npm run dev          # documentation site and comparison viewer
npm test             # unit, claim, build, browser, and offline checks
npm run build        # package plus static site in dist/
npm pack             # create the tested local tarball
```

`npm run build:site` writes the static deployment to `dist/site/`.

## License

MIT. See [LICENSE](LICENSE).
