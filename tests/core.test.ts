import { describe, expect, it } from "vitest";
import {
  compareCapsules,
  createRecorder,
  diffStates,
  parseCapsule,
  replayCapsule,
  stringifyCapsule,
  validateCapsule
} from "../src";

const clock = (() => {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 7, 28, 12, 0, tick++));
})();

describe("createRecorder", () => {
  it("@claim:redaction records the documented example and redacts state, events, and metadata", () => {
    const initial = { report: null, auth: { token: "secret" }, profile: { password: "also-secret" } };
    const recorder = createRecorder({
      id: "run-2",
      name: "finance report / run 2",
      initialState: initial,
      metadata: { operator: "Ada", password: "metadata-secret" },
      redact: ["auth.token", "**.password"],
      retention: { maxTransitions: 100, includeEvents: true },
      now: clock
    });

    recorder.record(
      { type: "report.requested", query: "quarterly revenue", password: "event-secret" },
      { report: { chart: "bar" }, auth: { token: "secret" }, profile: { password: "also-secret" } }
    );
    const capsule = recorder.capsule();

    expect(capsule.initial.state).toMatchObject({ auth: { token: "[REDACTED]" } });
    expect(capsule.transitions[0]?.event).toMatchObject({ password: "[REDACTED]" });
    expect(capsule.metadata.password).toBe("[REDACTED]");
    expect(initial.auth.token).toBe("secret");
    expect(parseCapsule(stringifyCapsule(capsule))).toEqual(capsule);
  });

  it("folds old transitions into the retention boundary", () => {
    const recorder = createRecorder({ name: "bounded", id: "bounded", initialState: { count: 0 }, retention: { maxTransitions: 2 }, now: clock });
    recorder.record({ type: "increment" }, { count: 1 });
    recorder.record({ type: "increment" }, { count: 2 });
    recorder.record({ type: "increment" }, { count: 3 });
    const capsule = recorder.capsule();
    expect(capsule.transitions).toHaveLength(2);
    expect(capsule.initial.state).toEqual({ count: 1 });
    expect(capsule.initial.label).toBe("Retention boundary");
  });
});

describe("compareCapsules", () => {
  function run(id: string, chart: string) {
    const recorder = createRecorder({ name: id, id, initialState: { report: null }, now: clock });
    recorder.record({ type: "report.requested" }, { report: { chart, rows: 12 } });
    return recorder.capsule();
  }

  it("finds the first divergent persisted field", () => {
    const report = compareCapsules(run("baseline", "bar"), run("failing", "line"));
    expect(report.equal).toBe(false);
    expect(report.firstDivergence).toMatchObject({
      transitionIndex: 0,
      path: "$.report.chart",
      expected: "bar",
      actual: "line"
    });
  });

  it("reports identical runs", () => {
    expect(compareCapsules(run("baseline", "bar"), run("candidate", "bar")).equal).toBe(true);
  });
});

describe("replayCapsule", () => {
  it("@claim:pure-replay replays only the supplied pure reducer and detects divergence", () => {
    const recorder = createRecorder({ name: "counter", id: "counter", initialState: { count: 0 }, now: clock });
    recorder.record({ type: "increment" }, { count: 1 });
    recorder.record({ type: "increment" }, { count: 2 });
    const capsule = recorder.capsule();

    expect(replayCapsule(capsule, (state, event) => ({
      count: (state as { count: number }).count + ((event as { type: string }).type === "increment" ? 1 : 0)
    })).ok).toBe(true);

    const badReplay = replayCapsule(capsule, (state) => ({ count: (state as { count: number }).count + 2 }));
    expect(badReplay.firstDivergence?.path).toBe("$.count");
  });

  it("fails safely when event payloads were omitted", () => {
    const recorder = createRecorder({ name: "private", id: "private", initialState: {}, retention: { includeEvents: false }, now: clock });
    recorder.record({ type: "secret" }, { done: true });
    expect(replayCapsule(recorder.capsule(), () => ({})).error?.message).toContain("without event payloads");
  });
});

describe("validation and state diff", () => {
  it("rejects malformed files with actionable messages", () => {
    expect(validateCapsule({ format: "wrong" }).errors).toContain("format must be state-transition-capsule/v1");
    expect(() => parseCapsule("not json")).toThrow("not valid JSON");
  });

  it("handles arrays, additions, removals, and types", () => {
    expect(diffStates({ list: [1, 2], enabled: true }, { list: [1, 3, 4], enabled: "yes" })).toEqual([
      { path: "$.enabled", kind: "type", expected: true, actual: "yes" },
      { path: "$.list[1]", kind: "changed", expected: 2, actual: 3 },
      { path: "$.list[2]", kind: "added", actual: 4 }
    ]);
  });

  it("preserves JSON keys named __proto__ without changing object prototypes", () => {
    const state = JSON.parse('{"__proto__":{"polluted":true},"safe":1}');
    const recorder = createRecorder({ name: "prototype safety", id: "safe", initialState: state, now: clock });
    const capsule = recorder.capsule();
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
    expect(JSON.stringify(capsule.initial.state)).toContain('"__proto__"');
  });
});
