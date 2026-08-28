# State Transition Capsule — visual thesis

## Direction: mid-century instrument panel

Stateful bugs feel invisible until two runs are placed side by side. The interface borrows the calm legibility of a 1960s bench instrument: warm enamel, charcoal bezels, stamped labels, status lamps, and a ruled trace surface. It should feel like a precise tool that can be trusted with evidence, not a generic dashboard or nostalgic prop.

## Tokens

- Background `#F2EBD9` (aged instrument paper); surface `#FFF9EA`; recessed surface `#1E2927`.
- Text `#182420`; muted text `#56645E`; hairline `#9B9A80`.
- Signal orange `#C34B2E` with cream contrast `#FFF9EA`; teal `#176B67`; success `#2C6A4F`; warning `#8B5A12`; danger `#A42E28`.
- Dark treatment is scoped to the diagnostic console rather than a theme toggle: charcoal `#15201E`, panel `#22302D`, pale trace `#F4E9CB`, muted trace `#AAB9AF`. This preserves the single-mode physical-instrument thesis while providing depth.
- Contrast was selected for 4.5:1 body text minimum. Focus is a 3px orange/cream double ring visible on both treatments.

## Type and spacing

- Display: self-hosted **Bricolage Grotesque**, 600–700, compact and engineered without becoming sci-fi.
- Data: self-hosted **IBM Plex Mono**, 400–600, tabular figures for paths, counters, hashes, and code.
- Scale: 14, 16, 20, 26, 40, 64px; body never below 16px. Reading measure tops out near 68 characters.
- Spacing follows a 4/8px rhythm: 4, 8, 12, 16, 24, 32, 48, 72px. Panel controls have a 44px minimum target.

## Interaction grammar

Inputs resemble labelled sockets, imported capsules become numbered cartridges, and the comparison result is a paper trace moving left-to-right from run A to run B. Orange is reserved for the primary action and first divergence. Teal signals loaded/ready. State is always reinforced with a label or icon, never color alone.

On phones, the two import bays stack, the editorial hero illustration is cropped to its diagnostic core, and the result table becomes a path-first list. Marketing copy defers to the workbench.

## Motion policy

Controls settle over 180ms with opacity and transform only. A newly calculated divergence receives one 260ms trace reveal; nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and results appear instantly.

## Original asset plan and provenance

- `site/public/instrument-trace.webp`: generated specifically for this product with the factory image deployment, then locally converted to WebP. Prompt: “Editorial cutaway illustration of a mid-century laboratory diagnostic instrument for comparing two software state timelines, cream enamel casing, charcoal recessed screen, orange and teal indicator lamps, two paper data cartridges feeding a single divergence trace, subtle screenprint grain, geometric 1960s technical-manual composition, warm off-white background, no people, no readable text, no logos, no watermark, wide landscape with the instrument concentrated on the right and calm negative space on the left.” Deployment metadata is retained beside the source during generation; the shipped WebP is an original project asset.
- Interface icons and signal marks are hand-made CSS/SVG geometry and carry no external license dependency.

The generated image is explanatory: it establishes the two-runs-to-one-divergence model before the user reaches the live workbench.
