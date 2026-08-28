export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

export interface RedactionRule {
  /** Dot-separated path. `*` matches one segment; `**` matches any depth. */
  path: string;
  replacement?: JSONPrimitive;
}

export interface RetentionPolicy {
  /** Oldest transitions are folded into the initial snapshot. */
  maxTransitions?: number;
  /** Set false to retain snapshots without domain-event payloads. */
  includeEvents?: boolean;
}

export interface Snapshot {
  label: string;
  capturedAt: string;
  hash: string;
  state: JSONValue;
}

export interface Transition {
  sequence: number;
  name: string;
  capturedAt: string;
  event?: JSONValue;
  before: Snapshot;
  after: Snapshot;
}

export interface Capsule {
  format: "state-transition-capsule/v1";
  id: string;
  name: string;
  createdAt: string;
  metadata: Record<string, JSONValue>;
  redactions: string[];
  retention: Required<RetentionPolicy>;
  initial: Snapshot;
  transitions: Transition[];
}

export interface RecorderOptions {
  name: string;
  initialState: JSONValue;
  metadata?: Record<string, JSONValue>;
  redact?: Array<string | RedactionRule>;
  retention?: RetentionPolicy;
  /** Useful for deterministic tests or application-defined trace IDs. */
  id?: string;
  /** Injectable clock. */
  now?: () => Date;
}

export interface RecordOptions {
  name?: string;
}

export interface Recorder {
  record(event: JSONValue, nextState: JSONValue, options?: RecordOptions): Transition;
  snapshot(): Snapshot;
  capsule(): Capsule;
}

export type DifferenceKind = "added" | "removed" | "changed" | "type";

export interface StateDifference {
  path: string;
  kind: DifferenceKind;
  expected?: JSONValue;
  actual?: JSONValue;
}

export interface Divergence {
  transitionIndex: number;
  transitionName: string;
  path: string;
  kind: DifferenceKind;
  expected?: JSONValue;
  actual?: JSONValue;
  differences: StateDifference[];
}

export interface ComparisonReport {
  equal: boolean;
  baselineId: string;
  candidateId: string;
  comparedTransitions: number;
  firstDivergence?: Divergence;
}

export interface ReplayStep {
  transitionIndex: number;
  transitionName: string;
  ok: boolean;
  hash: string;
}

export interface ReplayReport {
  ok: boolean;
  capsuleId: string;
  steps: ReplayStep[];
  firstDivergence?: Divergence;
  error?: {
    transitionIndex: number;
    message: string;
  };
}

export type PureReducer = (state: Readonly<JSONValue>, event: Readonly<JSONValue>) => JSONValue;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
