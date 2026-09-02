import "./styles.css";
import {
  compareCapsules,
  createRecorder,
  parseCapsule,
  replayCapsule,
  stringifyCapsule,
  type Capsule,
  type ComparisonReport,
  type JSONValue
} from "../../src";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const DEMO_MODE = location.pathname.replace(/\/$/, "") === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
const ROUTE_FOCUS_KEY = "stc:route-focus";

type Bay = "baseline" | "candidate";

let baseline: Capsule | undefined;
let candidate: Capsule | undefined;

type PlaygroundScenario = {
  initial: JSONValue;
  event: JSONValue;
  knownGood: JSONValue;
  failedRun: JSONValue;
  redact?: string[];
};

const playgroundExamples: Record<"compare" | "redaction" | "replay", { label: string; scenario: PlaygroundScenario }> = {
  compare: {
    label: "Comparison result",
    scenario: {
      initial: { report: { chart: null }, session: { token: "sample-secret" } },
      event: { type: "chart.selected" },
      knownGood: { report: { chart: "bar" }, session: { token: "sample-secret" } },
      failedRun: { report: { chart: "line" }, session: { token: "sample-secret" } },
      redact: ["session.token"]
    }
  },
  redaction: {
    label: "Redaction result",
    scenario: {
      initial: { account: { token: "sample-secret" }, report: { chart: null } },
      event: { type: "report.opened", token: "event-secret" },
      knownGood: { account: { token: "sample-secret" }, report: { chart: "bar" } },
      failedRun: { account: { token: "sample-secret" }, report: { chart: "line" } },
      redact: ["account.token", "token"]
    }
  },
  replay: {
    label: "Replay result",
    scenario: {
      initial: { count: 0 },
      event: { type: "set-count", count: 1 },
      knownGood: { count: 1 },
      failedRun: { count: 2 },
      redact: []
    }
  }
};

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing element #${id}`);
  return found as T;
}

function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLElement>("main h1");
  const announcer = document.getElementById("route-announcer");
  const shouldFocus = document.referrer.startsWith(location.origin) || sessionStorage.getItem(ROUTE_FOCUS_KEY) === "1";
  if (!heading || !shouldFocus) return;
  sessionStorage.removeItem(ROUTE_FOCUS_KEY);
  window.setTimeout(() => {
    heading.focus({ preventScroll: true });
    if (announcer) announcer.textContent = document.title;
  }, 0);
}

const compareButton = element<HTMLButtonElement>("compare-button");
const message = element<HTMLDivElement>("bench-message");
const emptyResult = element<HTMLDivElement>("empty-result");
const resultContent = element<HTMLDivElement>("result-content");

function makeExamples(): [Capsule, Capsule] {
  const times = ["2026-08-28T09:00:00.000Z", "2026-08-28T09:00:01.000Z", "2026-08-28T09:00:02.000Z"];
  let firstTick = 0;
  let secondTick = 0;
  const initial = { session: { userId: "user_28", token: "secret" }, report: { query: "Q2 revenue", chart: null, filters: [] } };
  const options = { redact: ["session.token"], retention: { maxTransitions: 20 } };
  const good = createRecorder({ ...options, id: "run_known_good", name: "Quarterly report / known good", initialState: initial, now: () => new Date(times[firstTick++]!) });
  good.record({ type: "query.planned", model: "finance-v3" }, { ...initial, report: { query: "Q2 revenue", chart: null, filters: ["region:all"] } });
  good.record({ type: "chart.selected" }, { ...initial, report: { query: "Q2 revenue", chart: "bar", filters: ["region:all"] } });
  const changed = createRecorder({ ...options, id: "run_changed", name: "Quarterly report / second run", initialState: initial, now: () => new Date(times[secondTick++]!) });
  changed.record({ type: "query.planned", model: "finance-v3" }, { ...initial, report: { query: "Q2 revenue", chart: null, filters: ["region:all"] } });
  changed.record({ type: "chart.selected" }, { ...initial, report: { query: "Q2 revenue", chart: "line", filters: ["region:all"] } });
  return [good.capsule(), changed.capsule()];
}

function setMessage(text: string, error = false): void {
  message.textContent = text;
  message.classList.toggle("error", error);
}

function updateBay(bay: Bay, capsule?: Capsule): void {
  const status = element<HTMLParagraphElement>(`${bay}-status`);
  const section = document.querySelector<HTMLElement>(`[data-bay="${bay}"]`);
  if (!section) return;
  section.classList.toggle("loaded", Boolean(capsule));
  status.textContent = capsule ? `${capsule.name} · ${capsule.transitions.length} transitions` : "No run file loaded";
  compareButton.disabled = !(baseline && candidate);
}

function assignCapsule(bay: Bay, capsule: Capsule): void {
  if (bay === "baseline") baseline = capsule;
  else candidate = capsule;
  updateBay(bay, capsule);
  setMessage(`${capsule.name} loaded as the ${bay === "baseline" ? "known-good" : "failed"} run file.`);
}

function importErrorMessage(file: File, error: unknown): string {
  if (error instanceof SyntaxError) {
    return `${file.name} is not valid JSON. Export the run file again, then choose the new file.`;
  }
  if (error instanceof TypeError && error.message.startsWith("Invalid capsule:")) {
    return `${file.name} is missing the run-file format and required fields. Export it again, then choose the new file.`;
  }
  return `${file.name} could not be read. Choose the run file again.`;
}

async function readCapsule(file: File, bay: Bay): Promise<void> {
  if (file.size > MAX_FILE_BYTES) {
    setMessage(`${file.name} is larger than the 5 MB local safety limit. Reduce retention and export again.`, true);
    return;
  }
  try {
    assignCapsule(bay, parseCapsule(await file.text()));
  } catch (error) {
    setMessage(importErrorMessage(file, error), true);
  }
}

function formatValue(value: JSONValue | undefined): string {
  return value === undefined ? "—" : JSON.stringify(value, null, 2);
}

function appendCell(row: HTMLTableRowElement, label: string, content: string | HTMLElement): void {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  if (typeof content === "string") cell.textContent = content;
  else cell.append(content);
  row.append(cell);
}

function renderReport(report: ComparisonReport): void {
  emptyResult.hidden = true;
  resultContent.hidden = false;
  resultContent.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "result-summary";
  const main = document.createElement("div");
  const kicker = document.createElement("p");
  kicker.className = "eyebrow";

  if (report.equal) {
    kicker.textContent = "No changed field found";
    const title = document.createElement("h3");
    title.id = "result-title";
    title.textContent = "These retained states match.";
    const detail = document.createElement("p");
    detail.textContent = `${report.comparedTransitions} transitions compared.`;
    main.append(kicker, title, detail);
    const mark = document.createElement("span");
    mark.className = "identical-mark";
    mark.setAttribute("aria-label", "Matching runs");
    mark.textContent = "✓";
    summary.append(main, mark);
    resultContent.append(summary);
    return;
  }

  const divergence = report.firstDivergence!;
  kicker.textContent = "First changed field located";
  const title = document.createElement("h3");
  title.id = "result-title";
  title.textContent = divergence.transitionIndex < 0 ? "The runs start from different states." : `State changed after “${divergence.transitionName}”.`;
  const path = document.createElement("code");
  path.className = "path-readout";
  path.textContent = divergence.path;
  main.append(kicker, title, path);
  const meta = document.createElement("div");
  meta.className = "result-meta";
  meta.textContent = divergence.transitionIndex < 0 ? "Initial snapshot" : `Transition ${divergence.transitionIndex + 1}\n${divergence.differences.length} field difference${divergence.differences.length === 1 ? "" : "s"}`;
  summary.append(main, meta);

  const table = document.createElement("table");
  table.className = "diff-table";
  const caption = document.createElement("caption");
  caption.className = "visually-hidden";
  caption.textContent = "Changed fields in the first transition that differs between runs.";
  const head = document.createElement("thead");
  head.innerHTML = "<tr><th>Path</th><th>Kind</th><th>Known good</th><th>Failed run</th></tr>";
  const body = document.createElement("tbody");
  for (const difference of divergence.differences.slice(0, 20)) {
    const row = document.createElement("tr");
    appendCell(row, "Path", difference.path);
    const tag = document.createElement("span");
    tag.className = "kind-tag";
    tag.textContent = difference.kind;
    appendCell(row, "Kind", tag);
    const expected = document.createElement("code");
    expected.textContent = formatValue(difference.expected);
    appendCell(row, "Known good", expected);
    const actual = document.createElement("code");
    actual.textContent = formatValue(difference.actual);
    appendCell(row, "Failed run", actual);
    body.append(row);
  }
  table.append(caption, head, body);
  resultContent.append(summary, table);
}

function compareRuns(): void {
  if (!baseline || !candidate) return;
  compareButton.disabled = true;
  compareButton.textContent = "Comparing…";
  setMessage("Reading retained snapshots locally…");
  requestAnimationFrame(() => {
    const report = compareCapsules(baseline!, candidate!);
    renderReport(report);
    compareButton.disabled = false;
    compareButton.textContent = "Compare again";
    setMessage(report.equal ? "Comparison complete. No changed field found." : `Comparison complete. First changed field: ${report.firstDivergence!.path}`);
  });
}

function bindImports(): void {
  for (const bay of ["baseline", "candidate"] as const) {
    const input = element<HTMLInputElement>(`${bay}-file`);
    const container = document.querySelector<HTMLElement>(`[data-bay="${bay}"]`)!;
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) void readCapsule(file, bay);
      input.value = "";
    });
    for (const eventName of ["dragenter", "dragover"]) {
      container.addEventListener(eventName, (event) => {
        event.preventDefault();
        container.classList.add("dragging");
      });
    }
    for (const eventName of ["dragleave", "drop"]) {
      container.addEventListener(eventName, (event) => {
        event.preventDefault();
        container.classList.remove("dragging");
      });
    }
    container.addEventListener("drop", (event) => {
      const file = event.dataTransfer?.files[0];
      if (file) void readCapsule(file, bay);
    });
  }
}

function updateConnection(): void {
  const state = element<HTMLParagraphElement>("connection-state");
  state.classList.toggle("offline", !navigator.onLine);
  state.lastElementChild!.textContent = navigator.onLine ? "Local engine ready" : "Offline · still ready";
}

function bindCopyButtons(): void {
  document.querySelectorAll<HTMLElement>("[data-copy], [data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = button.dataset.copyTarget ? element(button.dataset.copyTarget).textContent ?? "" : button.dataset.copy ?? "";
      try {
        await navigator.clipboard.writeText(target);
        const label = button.querySelector<HTMLElement>(".copy-label");
        const old = label?.textContent ?? button.textContent;
        if (label) label.textContent = "Copied"; else button.textContent = "Copied";
        window.setTimeout(() => { if (label) label.textContent = old; else button.textContent = old; }, 1600);
      } catch { setMessage("Copy was blocked. Select the command manually.", true); }
    });
  });
}

function scenarioCapsules(scenario: PlaygroundScenario): [Capsule, Capsule] {
  const options = { initialState: scenario.initial, redact: scenario.redact ?? [], retention: { maxTransitions: 10 }, now: () => new Date("2026-09-01T09:00:00.000Z") };
  const good = createRecorder({ ...options, id: "playground-good", name: "Playground known-good run" });
  good.record(scenario.event, scenario.knownGood);
  const failed = createRecorder({ ...options, id: "playground-failed", name: "Playground failed run" });
  failed.record(scenario.event, scenario.failedRun);
  // Parsing the package's own JSON output exercises the same export/import path shown in the viewer.
  return [parseCapsule(stringifyCapsule(good.capsule())), parseCapsule(stringifyCapsule(failed.capsule()))];
}

function playgroundInput(): HTMLTextAreaElement {
  return element<HTMLTextAreaElement>("playground-input");
}

function writePlaygroundExample(example: "compare" | "redaction" | "replay"): void {
  playgroundInput().value = JSON.stringify(playgroundExamples[example].scenario, null, 2);
  runPlayground(example);
}

function runPlayground(mode: "compare" | "redaction" | "replay" = "compare"): void {
  const output = element<HTMLElement>("playground-output");
  const status = element<HTMLElement>("playground-status");
  try {
    const scenario = JSON.parse(playgroundInput().value) as PlaygroundScenario;
    const [good, failed] = scenarioCapsules(scenario);
    let result: unknown;
    if (mode === "redaction") {
      result = { redactedInitialState: good.initial.state, redactedEvent: good.transitions[0]?.event };
    } else if (mode === "replay") {
      const replay = createRecorder({ id: "playground-replay", name: "Playground replay", initialState: { count: 0 }, now: () => new Date("2026-09-01T09:00:00.000Z") });
      replay.record({ type: "set-count", count: 1 }, { count: 1 });
      result = replayCapsule(replay.capsule(), (state, event) => {
        const current = state as { count: number };
        const action = event as { type?: string; count?: number };
        return action.type === "set-count" ? { count: action.count ?? current.count } : current;
      });
    } else {
      result = compareCapsules(good, failed);
    }
    output.textContent = JSON.stringify(result, null, 2);
    status.textContent = `${playgroundExamples[mode].label} updated from the package.`;
  } catch (error) {
    output.textContent = "";
    status.textContent = error instanceof Error ? `Check the JSON: ${error.message}` : "Check the JSON and try again.";
  }
}

function bindPlayground(): void {
  const input = playgroundInput();
  let timer = 0;
  input.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => runPlayground("compare"), 120);
  });
  for (const button of Array.from(document.querySelectorAll<HTMLButtonElement>("[data-playground-example]"))) {
    button.addEventListener("click", () => writePlaygroundExample(button.dataset.playgroundExample as "compare" | "redaction" | "replay"));
  }
  writePlaygroundExample("compare");
}

bindImports();
bindCopyButtons();
bindPlayground();
updateConnection();
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);
compareButton.addEventListener("click", compareRuns);
function loadSampleRuns(): void {
  [baseline, candidate] = makeExamples();
  updateBay("baseline", baseline);
  updateBay("candidate", candidate);
  setMessage("Example runs loaded. Compare them to locate the first changed field.");
  emptyResult.hidden = false;
  resultContent.hidden = true;
}

element<HTMLButtonElement>("sample-button").addEventListener("click", loadSampleRuns);

function clearDemoStorage(): void {
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of Object.keys(storage)) {
      if (key.startsWith("demo:")) storage.removeItem(key);
    }
  }
}

if (DEMO_MODE) {
  document.title = "Demo — State Transition Capsule";
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", "https://state-transition-capsule.sociobot.in/demo");
  element<HTMLElement>("demo-banner").hidden = false;
  clearDemoStorage();
  loadSampleRuns();
  compareRuns();
  element<HTMLButtonElement>("reset-demo").addEventListener("click", () => {
    clearDemoStorage();
    loadSampleRuns();
    compareRuns();
  });
  element<HTMLAnchorElement>("start-real").addEventListener("click", () => {
    clearDemoStorage();
  });
  document.body.classList.add("demo-mode");
  window.requestAnimationFrame(() => element("workbench-title").scrollIntoView({ block: "start" }));
}

focusRouteHeading();
window.addEventListener("pageshow", focusRouteHeading);
window.addEventListener("pagehide", () => sessionStorage.setItem(ROUTE_FOCUS_KEY, "1"));

if (import.meta.env.PROD && "serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js"));
}
