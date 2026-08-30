# State Transition Capsule

Capture the state around domain events, remove secrets at the source, replay pure transitions, and locate the first field where a failing run left a known-good run.

It is for application developers debugging workflows that work once and drift after persisted client or server state changes. Capsules are portable JSON, the viewer runs entirely in the browser, and no recorded event is executed by the viewer.

Live site: <https://state-transition-capsule.sociobot.in>

Try the isolated sample without setup: <https://state-transition-capsule.sociobot.in/demo>. It loads two report runs and identifies the first changed field.

## Install

```sh
npm install state-transition-capsule
```

## Record a run

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

Redaction occurs before state or events enter the capsule. Inputs are cloned and never mutated.

## Compare two runs

```ts
import { compareCapsules, parseCapsule } from "state-transition-capsule";

const baseline = parseCapsule(baselineJson);
const failing = parseCapsule(failingJson);
const report = compareCapsules(baseline, failing);

console.log(report.firstDivergence?.path); // e.g. "$.report.chart"
```

## Replay a pure reducer

```ts
import { replayCapsule } from "state-transition-capsule";

const report = replayCapsule(capsule, (state, event) => {
  if (event.type === "increment") return { count: state.count + 1 };
  return state;
});

if (!report.ok) console.error(report.firstDivergence);
```

Replay calls only the reducer you supply in your own process. The local viewer never loads code from a capsule and never performs effects.

## Develop and verify

Requires Node.js 20+.

```sh
npm ci
npm run dev          # local documentation/viewer
npm test             # unit and browser tests
npm run build        # package + site into dist/
npm pack             # ready-to-publish tarball
```

`npm run build:site` writes the static deployment to `dist/site/`. The `/demo` route uses bundled sample data and a separate `demo:` storage namespace. No analytics, remote fonts, runtime CDNs, accounts, or uploads are used. Imported capsules stay in the current browser tab unless the user explicitly enables local retention.

## Format and API

The small public surface is `createRecorder`, `compareCapsules`, `replayCapsule`, `parseCapsule`, `stringifyCapsule`, and `validateCapsule`, plus exported TypeScript types. Capsules use the versioned media marker `state-transition-capsule/v1`.

The free package and viewer include recording, JSON export/import, redaction, comparison, and deterministic replay. Capsule Studio is a one-time purchase for local history and saved comparison labels. It never gates export, privacy, accessibility, or safety.

## Privacy and security

Capsules may contain sensitive data. Prefer broad redaction rules and inspect exported JSON before sharing. Redaction is irreversible replacement, not encryption. The viewer operates locally and does not upload capsule contents. See the site’s Privacy and Terms pages.

## License

MIT. See [LICENSE](LICENSE).
