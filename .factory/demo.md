# Demo sandbox

- URL: `https://state-transition-capsule.sociobot.in/demo` (local: `http://127.0.0.1:4173/demo`).
- Entry: the first-screen **Try it with sample data** link opens the demo in one click.
- Sample: a known-good quarterly report run and a second run whose `chart.selected` transition changes `$.report.chart` from `bar` to `line`.
- First result: the sample loads and compares automatically. The workbench shows the exact first divergence.
- Reset: **Reset demo** recreates both bundled capsules and removes all `demo:` storage keys.
- Exit: **Start for real** removes all `demo:` keys and returns to `/`.
- Isolation: demo mode never reads the normal license, saved-run, or case-history keys. Its reserved namespace is `demo:`. The current sample requires no persistence, so resetting leaves that namespace empty.
- Network: the sample comparison uses only bundled code and data. It does not call the license API or any other external origin.
