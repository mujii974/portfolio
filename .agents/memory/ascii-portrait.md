---
name: ASCII-art portrait from a photo
description: How to make a recognizable gazijarin-style ASCII text portrait from a user photo
---

# ASCII-art portrait rendering

The portfolio Hero shows a gazijarin.com-style ASCII *text* portrait (real characters,
not a dot/halftone CSS mask). It is rendered on a `<canvas>` in `AsciiArt.tsx`.

**Rule:** When the source photo does NOT have a clean dark background, remove the
background first (produce a transparent PNG) and skip transparent pixels (alpha
threshold) when rendering. Map only the figure's pixels to the char ramp.

**Why:** A plain brightness→character map paints the *entire frame* with glyphs when
the background is bright/mid-tone (e.g. a blue wall + light floor). The reference look
only works because the figure sits on empty (dark/transparent) space. Background
removal is what makes the silhouette read.

**How to apply:**
- Use `remove_image_background_tool` on the portrait, import the cutout PNG.
- Sample a cropped region (head + upper torso) into a COLS×rows grid; derive
  `rows = COLS * (cellW/cellH) * (cropH/cropW)` to preserve aspect ratio.
- Contrast-stretch luma over opaque pixels only; skip cells with alpha below ~0.45.
- Tint glyphs in the accent color; resolve the *actual* theme (the ThemeProvider can
  return `"system"`) via `matchMedia` so the tint is correct, and redraw on change.
- Earlier dot-mask / CSS halftone attempts were rejected by the user as "not good" —
  they wanted genuine ASCII characters.
