# Demo sandbox

- URL: `https://state-transition-capsule.sociobot.in/demo` (also `?demo=1`; local: `http://127.0.0.1:4173/demo`).
- Entry: the first-screen **Try it with sample data** link opens the demo in one click.
- Sample: a known-good quarterly report run and a second run whose `chart.selected` transition changes `$.report.chart` from `bar` to `line`.
- First result: the sample loads and compares automatically. The comparison viewer shows the exact first changed field.
- Playground: the editable JSON playground records two run files with the library, exports and imports them, then updates comparison output locally. Its Compare, Redaction, and Replay examples use the shipped package functions.
- Reset: **Reset demo** recreates both bundled run files and removes all `demo:` storage keys.
- Exit: **Start for real** removes all `demo:` keys and returns to `/`.
- Mobile boundary: the demo banner stays sticky over the comparison viewer and keeps **Reset demo** and **Start for real** available while scrolling.
- Isolation: demo mode never reads normal browser storage. Its reserved namespace is `demo:`. The current sample needs no persistence, and reset removes every key in that namespace.
- Network: the sample comparison uses only bundled code and data. It does not call an API or any external origin.
