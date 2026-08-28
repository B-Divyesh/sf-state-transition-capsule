import type {
  Capsule,
  ComparisonReport,
  DifferenceKind,
  Divergence,
  JSONPrimitive,
  JSONValue,
  PureReducer,
  Recorder,
  RecorderOptions,
  RedactionRule,
  ReplayReport,
  Snapshot,
  StateDifference,
  Transition,
  ValidationResult
} from "./types";

const FORMAT = "state-transition-capsule/v1" as const;
const REDACTED = "[REDACTED]";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJSON(value: unknown, seen = new WeakSet<object>(), path = "$"): JSONValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "object") throw new TypeError(`${path} is not JSON-serializable`);
  if (seen.has(value)) throw new TypeError(`${path} contains a circular reference`);
  seen.add(value);

  if (Array.isArray(value)) {
    const result = value.map((item, index) => cloneJSON(item, seen, `${path}[${index}]`));
    seen.delete(value);
    return result;
  }

  const result: Record<string, JSONValue> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = cloneJSON(item, seen, `${path}.${key}`);
  }
  seen.delete(value);
  return result;
}

function stableStringify(value: JSONValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key]!)}`)
    .join(",")}}`;
}

function fingerprint(value: JSONValue): string {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function segments(path: string): string[] {
  const normalized = path.trim().replace(/^\$\.?/, "").replace(/\[(\d+|\*)\]/g, ".$1");
  if (!normalized) throw new TypeError("Redaction paths cannot be empty");
  const result = normalized.split(".").filter(Boolean);
  if (result.some((part) => !part)) throw new TypeError(`Invalid redaction path: ${path}`);
  return result;
}

function pathMatches(rule: string[], candidate: string[], ri = 0, ci = 0): boolean {
  if (ri === rule.length) return ci === candidate.length;
  if (rule[ri] === "**") {
    return pathMatches(rule, candidate, ri + 1, ci) ||
      (ci < candidate.length && pathMatches(rule, candidate, ri, ci + 1));
  }
  if (ci >= candidate.length) return false;
  return (rule[ri] === "*" || rule[ri] === candidate[ci]) && pathMatches(rule, candidate, ri + 1, ci + 1);
}

interface CompiledRule {
  source: string;
  parts: string[];
  replacement: JSONPrimitive;
}

function compileRules(rules: Array<string | RedactionRule>): CompiledRule[] {
  return rules.map((rule) => {
    const normalized = typeof rule === "string" ? { path: rule, replacement: REDACTED } : rule;
    return {
      source: normalized.path,
      parts: segments(normalized.path),
      replacement: normalized.replacement ?? REDACTED
    };
  });
}

function redact(value: JSONValue, rules: CompiledRule[], path: string[] = []): JSONValue {
  const matching = rules.find((rule) => pathMatches(rule.parts, path));
  if (matching) return matching.replacement;
  if (Array.isArray(value)) return value.map((item, index) => redact(item, rules, [...path, String(index)]));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redact(item, rules, [...path, key])])
    );
  }
  return value;
}

function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `stc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeSnapshot(label: string, state: JSONValue, capturedAt: string): Snapshot {
  return { label, capturedAt, hash: fingerprint(state), state };
}

export function createRecorder(options: RecorderOptions): Recorder {
  if (!options.name.trim()) throw new TypeError("A capsule name is required");
  const rules = compileRules(options.redact ?? []);
  const now = options.now ?? (() => new Date());
  const maxTransitions = options.retention?.maxTransitions ?? 500;
  if (!Number.isInteger(maxTransitions) || maxTransitions < 1) {
    throw new RangeError("retention.maxTransitions must be a positive integer");
  }
  const retention = {
    maxTransitions,
    includeEvents: options.retention?.includeEvents ?? true
  };
  const createdAt = now().toISOString();
  const capsuleId = options.id ?? newId();
  let current = redact(cloneJSON(options.initialState), rules);
  let initial = makeSnapshot("Initial state", current, createdAt);
  let sequence = 0;
  const transitions: Transition[] = [];
  const metadata = redact(cloneJSON(options.metadata ?? {}), rules) as Record<string, JSONValue>;

  const record = (event: JSONValue, nextState: JSONValue, recordOptions = {}): Transition => {
    const capturedAt = now().toISOString();
    const redactedEvent = redact(cloneJSON(event), rules);
    const redactedNext = redact(cloneJSON(nextState), rules);
    sequence += 1;
    const name = (recordOptions as { name?: string }).name ??
      (isRecord(redactedEvent) && typeof redactedEvent.type === "string" ? redactedEvent.type : `Transition ${sequence}`);
    const transition: Transition = {
      sequence,
      name,
      capturedAt,
      ...(retention.includeEvents ? { event: redactedEvent } : {}),
      before: makeSnapshot(`${name} / before`, cloneJSON(current), capturedAt),
      after: makeSnapshot(`${name} / after`, redactedNext, capturedAt)
    };
    transitions.push(transition);
    current = cloneJSON(redactedNext);

    while (transitions.length > maxTransitions) {
      const removed = transitions.shift();
      if (removed) initial = makeSnapshot("Retention boundary", cloneJSON(removed.after.state), removed.capturedAt);
    }
    return cloneJSON(transition) as unknown as Transition;
  };

  return {
    record,
    snapshot: () => cloneJSON(makeSnapshot("Current state", cloneJSON(current), now().toISOString())) as unknown as Snapshot,
    capsule: () => cloneJSON({
      format: FORMAT,
      id: capsuleId,
      name: options.name,
      createdAt,
      metadata,
      redactions: rules.map((rule) => rule.source),
      retention,
      initial,
      transitions
    }) as unknown as Capsule
  };
}

function valueType(value: JSONValue | undefined): string {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function appendPath(base: string, key: string, array: boolean): string {
  if (array) return `${base}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`;
}

export function diffStates(expected: JSONValue, actual: JSONValue, base = "$", limit = 100): StateDifference[] {
  const differences: StateDifference[] = [];
  const visit = (left: JSONValue | undefined, right: JSONValue | undefined, path: string, leftExists = true, rightExists = true): void => {
    if (differences.length >= limit) return;
    if (!leftExists) {
      differences.push({ path, kind: "added", actual: cloneJSON(right) });
      return;
    }
    if (!rightExists) {
      differences.push({ path, kind: "removed", expected: cloneJSON(left) });
      return;
    }
    if (Object.is(left, right)) return;
    if (valueType(left) !== valueType(right)) {
      differences.push({ path, kind: "type", expected: cloneJSON(left), actual: cloneJSON(right) });
      return;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      const length = Math.max(left.length, right.length);
      for (let index = 0; index < length; index += 1) {
        visit(left[index], right[index], appendPath(path, String(index), true), index < left.length, index < right.length);
      }
      return;
    }
    if (left && right && typeof left === "object" && typeof right === "object") {
      const leftRecord = left as Record<string, JSONValue>;
      const rightRecord = right as Record<string, JSONValue>;
      const keys = [...new Set([...Object.keys(leftRecord), ...Object.keys(rightRecord)])].sort();
      for (const key of keys) {
        visit(leftRecord[key], rightRecord[key], appendPath(path, key, false), key in leftRecord, key in rightRecord);
      }
      return;
    }
    differences.push({ path, kind: "changed", expected: cloneJSON(left), actual: cloneJSON(right) });
  };
  visit(expected, actual, base);
  return differences;
}

function asDivergence(index: number, name: string, differences: StateDifference[]): Divergence {
  const first = differences[0]!;
  return {
    transitionIndex: index,
    transitionName: name,
    path: first.path,
    kind: first.kind,
    ...(first.expected !== undefined ? { expected: first.expected } : {}),
    ...(first.actual !== undefined ? { actual: first.actual } : {}),
    differences
  };
}

export function compareCapsules(baseline: Capsule, candidate: Capsule): ComparisonReport {
  assertCapsule(baseline);
  assertCapsule(candidate);
  let differences = diffStates(baseline.initial.state, candidate.initial.state);
  if (differences.length) {
    return {
      equal: false,
      baselineId: baseline.id,
      candidateId: candidate.id,
      comparedTransitions: 0,
      firstDivergence: asDivergence(-1, "Initial state", differences)
    };
  }

  const shared = Math.min(baseline.transitions.length, candidate.transitions.length);
  for (let index = 0; index < shared; index += 1) {
    const expected = baseline.transitions[index]!;
    const actual = candidate.transitions[index]!;
    differences = diffStates(expected.after.state, actual.after.state);
    if (differences.length) {
      return {
        equal: false,
        baselineId: baseline.id,
        candidateId: candidate.id,
        comparedTransitions: index + 1,
        firstDivergence: asDivergence(index, actual.name, differences)
      };
    }
  }

  if (baseline.transitions.length !== candidate.transitions.length) {
    const missingFromCandidate = baseline.transitions.length > candidate.transitions.length;
    const index = shared;
    const transition = (missingFromCandidate ? baseline : candidate).transitions[index]!;
    const difference: StateDifference = {
      path: "$",
      kind: missingFromCandidate ? "removed" : "added",
      ...(missingFromCandidate ? { expected: transition.after.state } : { actual: transition.after.state })
    };
    return {
      equal: false,
      baselineId: baseline.id,
      candidateId: candidate.id,
      comparedTransitions: shared,
      firstDivergence: asDivergence(index, transition.name, [difference])
    };
  }

  return { equal: true, baselineId: baseline.id, candidateId: candidate.id, comparedTransitions: shared };
}

export function replayCapsule(capsule: Capsule, reducer: PureReducer): ReplayReport {
  assertCapsule(capsule);
  let state = cloneJSON(capsule.initial.state);
  const steps: ReplayReport["steps"] = [];

  for (let index = 0; index < capsule.transitions.length; index += 1) {
    const transition = capsule.transitions[index]!;
    if (transition.event === undefined) {
      return {
        ok: false,
        capsuleId: capsule.id,
        steps,
        error: { transitionIndex: index, message: "This capsule was recorded without event payloads." }
      };
    }
    let result: JSONValue;
    try {
      result = cloneJSON(reducer(cloneJSON(state), cloneJSON(transition.event)));
    } catch (error) {
      return {
        ok: false,
        capsuleId: capsule.id,
        steps,
        error: { transitionIndex: index, message: error instanceof Error ? error.message : "Reducer threw an unknown error" }
      };
    }
    const differences = diffStates(transition.after.state, result);
    steps.push({ transitionIndex: index, transitionName: transition.name, ok: differences.length === 0, hash: fingerprint(result) });
    if (differences.length) {
      return {
        ok: false,
        capsuleId: capsule.id,
        steps,
        firstDivergence: asDivergence(index, transition.name, differences)
      };
    }
    state = result;
  }
  return { ok: true, capsuleId: capsule.id, steps };
}

export function validateCapsule(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ["Capsule must be a JSON object."] };
  if (value.format !== FORMAT) errors.push(`format must be ${FORMAT}`);
  if (typeof value.id !== "string" || !value.id) errors.push("id must be a non-empty string");
  if (typeof value.name !== "string" || !value.name) errors.push("name must be a non-empty string");
  if (typeof value.createdAt !== "string" || Number.isNaN(Date.parse(value.createdAt))) errors.push("createdAt must be an ISO date string");
  if (!isRecord(value.initial) || !("state" in value.initial)) errors.push("initial snapshot is missing");
  if (!Array.isArray(value.transitions)) errors.push("transitions must be an array");
  else {
    value.transitions.forEach((transition, index) => {
      if (!isRecord(transition)) errors.push(`transitions[${index}] must be an object`);
      else if (!isRecord(transition.after) || !("state" in transition.after)) errors.push(`transitions[${index}].after is missing`);
    });
  }
  try {
    cloneJSON(value);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Capsule contains invalid JSON data");
  }
  return { valid: errors.length === 0, errors };
}

function assertCapsule(value: unknown): asserts value is Capsule {
  const result = validateCapsule(value);
  if (!result.valid) throw new TypeError(`Invalid capsule: ${result.errors.join("; ")}`);
}

export function parseCapsule(json: string): Capsule {
  let value: unknown;
  try {
    value = JSON.parse(json) as unknown;
  } catch {
    throw new SyntaxError("The selected file is not valid JSON.");
  }
  assertCapsule(value);
  return cloneJSON(value) as unknown as Capsule;
}

export function stringifyCapsule(capsule: Capsule, space = 2): string {
  assertCapsule(capsule);
  return JSON.stringify(capsule, null, space);
}
