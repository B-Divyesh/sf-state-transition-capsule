import "./styles.css";
import {
  compareCapsules,
  createRecorder,
  parseCapsule,
  type Capsule,
  type ComparisonReport,
  type JSONValue
} from "../../src";

const PRODUCT_SLUG = "state-transition-capsule";
const API_BASE = "https://api.sociobot.in/api/v1";
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const RUNS_KEY = "stc:saved-runs";
const HISTORY_KEY = "stc:case-history";
const MAX_FILE_BYTES = 5 * 1024 * 1024;

type Bay = "baseline" | "candidate";
type CachedVerdict = { valid: boolean; checkedAt: number; reason?: string };
type CaseRecord = { label: string; path: string; at: string };

let baseline: Capsule | undefined;
let candidate: Capsule | undefined;
let latestReport: ComparisonReport | undefined;
let studioUnlocked = false;

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing element #${id}`);
  return found as T;
}

const compareButton = element<HTMLButtonElement>("compare-button");
const message = element<HTMLDivElement>("bench-message");
const emptyResult = element<HTMLDivElement>("empty-result");
const resultContent = element<HTMLDivElement>("result-content");
const rememberToggle = element<HTMLInputElement>("remember-toggle");

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
  message.style.color = error ? "#ffad94" : "#93cfb8";
}

function updateBay(bay: Bay, capsule?: Capsule): void {
  const status = element<HTMLParagraphElement>(`${bay}-status`);
  const section = document.querySelector<HTMLElement>(`[data-bay="${bay}"]`);
  if (!section) return;
  section.classList.toggle("loaded", Boolean(capsule));
  status.textContent = capsule ? `${capsule.name} · ${capsule.transitions.length} transitions` : "No capsule loaded";
  compareButton.disabled = !(baseline && candidate);
}

function storeRuns(): void {
  if (!studioUnlocked || !rememberToggle.checked || !baseline || !candidate) return;
  localStorage.setItem(RUNS_KEY, JSON.stringify({ baseline, candidate }));
}

function assignCapsule(bay: Bay, capsule: Capsule): void {
  if (bay === "baseline") baseline = capsule;
  else candidate = capsule;
  updateBay(bay, capsule);
  setMessage(`${capsule.name} loaded into ${bay === "baseline" ? "known-good" : "changed"} bay.`);
  storeRuns();
}

async function readCapsule(file: File, bay: Bay): Promise<void> {
  if (file.size > MAX_FILE_BYTES) {
    setMessage(`${file.name} is larger than the 5 MB local safety limit. Reduce retention and export again.`, true);
    return;
  }
  try {
    assignCapsule(bay, parseCapsule(await file.text()));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "The file could not be read.";
    setMessage(`${file.name}: ${detail}`, true);
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
    kicker.textContent = "No divergence found";
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
  kicker.textContent = "First divergence located";
  const title = document.createElement("h3");
  title.id = "result-title";
  title.textContent = divergence.transitionIndex < 0 ? "The runs start from different state." : `State changed after “${divergence.transitionName}”.`;
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
  caption.textContent = "State differences at the first divergent transition";
  const head = document.createElement("thead");
  head.innerHTML = "<tr><th>Path</th><th>Kind</th><th>Known good</th><th>Changed run</th></tr>";
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
    appendCell(row, "Changed", actual);
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
    latestReport = compareCapsules(baseline!, candidate!);
    renderReport(latestReport);
    compareButton.disabled = false;
    compareButton.textContent = "Compare again";
    setMessage(latestReport.equal ? "Comparison complete. No divergence found." : `Comparison complete. First divergence: ${latestReport.firstDivergence!.path}`);
    storeRuns();
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

function setStudio(unlocked: boolean, note?: string): void {
  studioUnlocked = unlocked;
  rememberToggle.disabled = !unlocked;
  element("license-state").textContent = unlocked ? "Studio active" : "Studio locked";
  element("license-note").textContent = note ?? (unlocked ? "Local history and case labels are available." : "The free comparison bench remains fully available.");
  element("history-panel").hidden = !unlocked;
  if (unlocked) {
    renderHistory();
    restoreRuns();
  }
}

function readVerdict(): CachedVerdict | undefined {
  try {
    const raw = localStorage.getItem(VERDICT_KEY);
    return raw ? JSON.parse(raw) as CachedVerdict : undefined;
  } catch { return undefined; }
}

async function verifyLicense(token: string, force = false): Promise<void> {
  const cached = readVerdict();
  const fresh = cached && Date.now() - cached.checkedAt < 86_400_000;
  if (!force && fresh) {
    setStudio(cached.valid, cached.valid ? undefined : "License no longer active. The free tools remain available.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("Verification service unavailable");
    const result = await response.json() as { valid?: boolean; reason?: string };
    const verdict: CachedVerdict = { valid: result.valid === true, checkedAt: Date.now(), ...(result.reason ? { reason: result.reason } : {}) };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    setStudio(verdict.valid, verdict.valid ? undefined : "License no longer active. Check the token or buy a new license.");
  } catch {
    setStudio(cached?.valid === true, cached?.valid ? "Studio is active from the last verification. We’ll retry when the service is available." : "Could not verify right now. The free tools remain available.");
  }
}

function restoreRuns(): void {
  if (!studioUnlocked) return;
  try {
    const raw = localStorage.getItem(RUNS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { baseline?: Capsule; candidate?: Capsule };
    if (saved.baseline) { baseline = saved.baseline; updateBay("baseline", baseline); }
    if (saved.candidate) { candidate = saved.candidate; updateBay("candidate", candidate); }
    if (saved.baseline || saved.candidate) {
      rememberToggle.checked = true;
      setMessage("Restored locally saved capsules.");
    }
  } catch { localStorage.removeItem(RUNS_KEY); }
}

function renderHistory(): void {
  const panel = element("case-history");
  panel.replaceChildren();
  let history: CaseRecord[] = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as CaseRecord[]; } catch { /* ignore */ }
  if (!history.length) {
    const empty = document.createElement("p");
    empty.textContent = "No saved cases yet.";
    panel.append(empty);
    return;
  }
  const list = document.createElement("ul");
  list.className = "history-list";
  for (const item of history.slice(0, 8)) {
    const row = document.createElement("li");
    row.textContent = `${item.label} · ${item.path} · ${new Date(item.at).toLocaleDateString()}`;
    list.append(row);
  }
  panel.append(list);
}

function bindLicense(): void {
  const params = new URLSearchParams(location.search);
  const returnedLicense = params.get("license");
  if (returnedLicense) {
    localStorage.setItem(LICENSE_KEY, returnedLicense);
    params.delete("license");
    const query = params.toString();
    history.replaceState({}, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }
  const token = returnedLicense ?? localStorage.getItem(LICENSE_KEY);
  const cached = readVerdict();
  if (token && cached?.valid) setStudio(true);
  if (token) void verifyLicense(token, Boolean(returnedLicense));

  const form = element<HTMLFormElement>("license-form");
  element<HTMLButtonElement>("restore-button").addEventListener("click", () => {
    form.hidden = false;
    element<HTMLInputElement>("license-input").focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = element<HTMLInputElement>("license-input");
    const value = input.value.trim();
    if (!value) return;
    localStorage.setItem(LICENSE_KEY, value);
    element("license-note").textContent = "Verifying license…";
    void verifyLicense(value, true);
  });
  element<HTMLButtonElement>("save-case").addEventListener("click", () => {
    const label = element<HTMLInputElement>("case-label");
    if (!latestReport || !label.value.trim()) {
      element("license-note").textContent = "Compare two runs and enter a label before saving.";
      return;
    }
    let history: CaseRecord[] = [];
    try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as CaseRecord[]; } catch { /* ignore */ }
    history.unshift({ label: label.value.trim(), path: latestReport.firstDivergence?.path ?? "No divergence", at: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    label.value = "";
    renderHistory();
    element("license-note").textContent = "Case saved on this device.";
  });
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

bindImports();
bindCopyButtons();
bindLicense();
updateConnection();
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);
compareButton.addEventListener("click", compareRuns);
element<HTMLButtonElement>("sample-button").addEventListener("click", () => {
  [baseline, candidate] = makeExamples();
  updateBay("baseline", baseline);
  updateBay("candidate", candidate);
  setMessage("Example runs loaded. Compare them to locate the drift.");
  emptyResult.hidden = false;
  resultContent.hidden = true;
  storeRuns();
});
rememberToggle.addEventListener("change", () => {
  if (rememberToggle.checked) storeRuns();
  else {
    localStorage.removeItem(RUNS_KEY);
    setMessage("Saved capsules removed from this device.");
  }
});

if (import.meta.env.PROD && "serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js"));
}
