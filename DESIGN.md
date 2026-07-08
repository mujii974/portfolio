# DESIGN.md — mujii.dev design system

Aesthetic lane: **cinematic tech-noir dossier with one playful agent.** Reference points: high-end product-launch pages (depth, luminous signal lines) crossed with an intelligence-file layout (mono metadata, numbered sections, status readouts). Not editorial-magazine, not terminal cosplay.

## Color (OKLCH, blue-tinted neutrals, one accent)
Strategy: Restrained base with **Committed accent moments** (hero glow, section numbers, ASCII tint, active states).

### Dark (default feel — "operator at night")
- background: `oklch(0.16 0.02 255)`
- card / surface: `oklch(0.19 0.022 255)`
- border: `oklch(0.75 0.03 255 / 0.14)` (hairlines, alpha-based)
- foreground: `oklch(0.93 0.006 250)`
- muted-foreground: `oklch(0.68 0.02 252)`
- accent: `oklch(0.69 0.155 257)` ≈ rgb(79,142,247) — matches ASCII tint
- accent-foreground: `oklch(0.15 0.02 255)`

### Light ("paper dossier at a desk")
- background: `oklch(0.965 0.005 250)`
- card: `oklch(0.99 0.002 250)`
- border: `oklch(0.3 0.03 255 / 0.13)`
- foreground: `oklch(0.22 0.02 258)`
- muted-foreground: `oklch(0.5 0.02 255)`
- accent: `oklch(0.47 0.19 262)` deep cobalt ≈ rgb(37,64,180)
- accent-foreground: `oklch(0.97 0.005 250)`

Never #000/#fff. Shadows tinted to background hue. Selection = accent.

## Typography
- Display: **Cabinet Grotesk** 700/800 (Fontshare) — headlines, tracking-tight, clamp() fluid.
- Body/UI: **Satoshi** 400/500/700 (Fontshare) — max 70ch.
- Technical: **JetBrains Mono** 400/500 (Google) — labels, statuses, tags, numbers. Uppercase + tracking-[0.18em] for overlines.
- Scale ratio ≥1.28. H1 `clamp(2.9rem, 6.5vw, 5.5rem)`; section H2 `clamp(2rem, 4vw, 3.25rem)`.

## Layout
- Max width 1200–1400px, `px-5 sm:px-8`. Asymmetric grids (`1.15fr .85fr`, offset columns); everything collapses to single column < 768px.
- Sections numbered `00–05 /` in mono accent. Hairline `border-t` rows instead of cards wherever possible.
- Full-height sections use `min-h-[100dvh]`, never `h-screen`.

## Motion
- Framer Motion only in the DOM tree; raw three.js isolated to one canvas component. No GSAP.
- Ease: `[0.16, 1, 0.3, 1]` (expo-out) or springs (stiffness 100–260, damping 20–30). No bounce/elastic.
- Signature moves: scramble/decode text-in (echoes ASCII), masked line reveals, scroll-drawn SVG line (trajectory), sticky project stack, magnetic CTAs, 3D pointer-tilt operative card, floating character parallax.
- Everything gated on `prefers-reduced-motion` (MotionConfig reducedMotion="user" + manual checks in canvas/rAF code).

## 3D layer
`SignalField` — fixed, full-viewport three.js points lattice with depth fog; slow drift, pointer parallax (lerped), scroll dolly. Theme-aware colors, DPR ≤ 2, particle count scaled down on mobile, paused when tab hidden / reduced motion → static. `pointer-events-none`, z-0 behind content. WebGL failure → silent null (CSS gradient stays).

## Character usage (rationed)
- `operative.png` (full body, navy bg) → About "operative card", 3D tilt + sheen. Navy bg framed as part of the card.
- `pose-pointing` → Contact headline companion (float + parallax).
- `pose-thinking` → 404 page. `pose-steepled` → Arsenal easter corner. `pose-phone` → contact rows hover flair (optional). `pose-crossed` → reserve.

## Recurring details
- Grain: fixed SVG-noise overlay, opacity ~0.04 dark / 0.03 light, `pointer-events-none`.
- Status dot: accent, breathing (scale+opacity loop). Used for "OPEN TO WORK", cert in-progress.
- QR keeps the scanline hover flair (existing identity).
- Doha local time readout in contact/footer (mono, live).
- Focus-visible: 2px accent ring offset 2px, everywhere interactive.
