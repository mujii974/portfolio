---
name: Digital Showcase Hub
description: A precise, restrained personal portfolio where the interface itself proves craft.
colors:
  background: "#0f0f10"
  surface: "#18181b"
  surface-elevated: "#232326"
  foreground: "#e8e6e3"
  muted: "#6e6b68"
  border: "#27272a"
  accent: "#d4a373"
  accent-foreground: "#0f0f10"
  destructive: "#ef4444"
typography:
  display:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#e0b17f"
    textColor: "{colors.accent-foreground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
---

# Design System: Digital Showcase Hub

## 1. Overview

**Creative North Star: "The Engineer's Workbench"**

This portfolio is a single-room workshop: every surface is intentional, every tool is within reach, and nothing competes for attention. The design language is precise, confident, and restrained — warm ink backgrounds, one disciplined accent, and typography that favors clarity over flourish. Visitors should feel they are looking at the output of someone who edits ruthlessly.

The system rejects the default "developer portfolio" playbook. No particle networks, no blue-on-dark SaaS gradients, no glass cards, no decorative monospace. Warmth and discipline replace coldness and noise.

**Key Characteristics:**
- One accent color, used sparingly and with purpose
- Generous whitespace; sections breathe
- Flat surfaces at rest; only state changes earn elevation
- Monospace is confined to labels, code, and microcopy
- Type hierarchy is stark: one weight family, clear size contrast

## 2. Colors

The palette is warm, near-monochrome ink with a single amber accent. The accent must feel like a highlight, not a theme.

### Primary
- **Warm Amber** (`#d4a373`): Primary action, focus rings, key highlights, active nav state. Used on ≤10% of any screen.

### Neutral
- **Ink Black** (`#0f0f10`): Page background. The deepest value; no pure `#000`.
- **Charcoal** (`#18181b`): Card and container surfaces.
- **Elevated Charcoal** (`#232326`): Hover states, chips, raised surfaces.
- **Warm White** (`#e8e6e3`): Primary text. Softer than pure white for long reading.
- **Warm Gray** (`#6e6b68`): Secondary text, metadata, captions.
- **Border Gray** (`#27272a`): Dividers, subtle borders, separators.

### Named Rules
**The One Accent Rule.** Warm amber is the only hue on the page. Use it for the one thing that needs to be noticed.

**The No Pure Black Rule.** Background is `#0f0f10`, not `#000000`. Shadows, overlays, and borders must never be pure black.

## 3. Typography

**Display / Headline / Body Font:** Inter (system-ui fallback)
**Label / Code Font:** JetBrains Mono (monospace fallback)

Inter is chosen for its neutrality and engineering discipline. JetBrains Mono is reserved for labels, inline code, and technical metadata — never for marketing headlines or body paragraphs.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 6vw, 4.5rem)`, 1.05): Hero headline. One per page.
- **Headline** (600, `clamp(1.75rem, 3vw, 2.5rem)`, 1.1): Section titles.
- **Title** (500, `1.25rem`, 1.3): Card titles, project names.
- **Body** (400, `1rem`, 1.65): Paragraphs and descriptions. Max line length 65–75ch.
- **Label** (500, `0.75rem`, uppercase, `letter-spacing: 0.08em`): Tags, dates, categories, microcopy.

### Named Rules
**The One Voice Rule.** One sans-serif family carries 95% of the interface. Monospace is a tool, not a personality.

**The No Tiny Body Rule.** Body copy never drops below `1rem` / `16px`.

## 4. Elevation

The system is flat by default. Depth is conveyed through tonal layering (`surface` vs `surface-elevated`) rather than heavy shadows. Shadows, when used, are diffuse and warm.

### Shadow Vocabulary
- **Ambient Hover** (`0 8px 24px rgba(0, 0, 0, 0.24)`): Cards and buttons on hover. Always subtle, never sharp.
- **Focus Ring** (`0 0 0 2px #0f0f10, 0 0 0 4px #d4a373`): Accessible focus states with high contrast.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Elevation is a response, not a default.

**The No Pure Black Shadow Rule.** All shadows use a dark ink tint, never `#000`.

## 5. Components

### Buttons
- **Shape:** 8px radius.
- **Primary:** Warm amber background (`#d4a373`), ink text, 12px 24px padding. Hover lightens to `#e0b17f`.
- **Ghost:** Transparent background, warm-white text. Hover uses `surface-elevated` tonal fill.
- **Focus:** 2px inner ink + 2px outer amber ring.

### Cards / Containers
- **Corner Style:** 12px radius.
- **Background:** Charcoal (`#18181b`).
- **Border:** 1px solid `#27272a`.
- **Internal Padding:** 24px.
- **Hover:** Background shifts to `surface-elevated`; subtle ambient shadow appears.

### Chips / Tags
- **Style:** Elevated charcoal background, warm-white text, 1px border.
- **State:** No hover transform; only a tonal shift.

### Navigation
- **Style:** Fixed top bar, blurred charcoal background (`backdrop-blur`), 1px bottom border.
- **Typography:** Body weight, warm-white text.
- **Active:** Warm amber underline or text color.
- **Mobile:** Sheet or compact dropdown, same tonal language.

### Inputs / Fields
- **Style:** Transparent background, 1px border, 8px radius.
- **Focus:** Border shifts to accent; focus ring follows button convention.
- **Error:** Destructive red (`#ef4444`) border and text.

## 6. Do's and Don'ts

### Do:
- Use warm amber as the single call-to-action color.
- Keep body text at 1rem or larger.
- Use generous whitespace between sections (96px default).
- Respect `prefers-reduced-motion` for all entrance and state animations.
- Use JetBrains Mono only for code, labels, and technical metadata.

### Don't:
- Use a particle-network or connect-dot background.
- Use pure black (`#000000`) anywhere, including shadows and QR code foregrounds.
- Use blue as a primary or accent color.
- Use glassmorphism, blur cards, or heavy drop shadows as decoration.
- Use side-stripe colored borders as a card detail.
- Use monospace fonts for headlines or marketing copy.
- Animate every element on scroll with the same fade-up transform.
