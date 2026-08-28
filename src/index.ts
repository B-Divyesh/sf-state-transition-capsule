export {
  compareCapsules,
  createRecorder,
  diffStates,
  parseCapsule,
  replayCapsule,
  stringifyCapsule,
  validateCapsule
} from "./core";

export type {
  Capsule,
  ComparisonReport,
  DifferenceKind,
  Divergence,
  JSONPrimitive,
  JSONValue,
  PureReducer,
  Recorder,
  RecorderOptions,
  RecordOptions,
  RedactionRule,
  ReplayReport,
  ReplayStep,
  RetentionPolicy,
  Snapshot,
  StateDifference,
  Transition,
  ValidationResult
} from "./types";
