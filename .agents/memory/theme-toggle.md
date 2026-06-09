---
name: Theme toggle must use resolved theme
description: Why the light/dark toggle needs resolvedTheme, not the raw stored theme
---

# Theme toggle: toggle off the resolved theme

A light/dark toggle button must compute its next value from the *resolved* theme
(`"dark"`/`"light"`), not the raw stored theme which can be `"system"`.

**Why:** With `defaultTheme: "system"`, the stored value is `"system"`. A naive
`setTheme(theme === "dark" ? "light" : "dark")` evaluates `"system" === "dark"` →
false → sets `"dark"`. If the OS is already dark, that first click is a visual no-op,
so the user must click twice the first time. After that, the stored value is explicit
and it works — classic "double-click on first toggle" bug.

**How to apply:** The ThemeProvider exposes `resolvedTheme` (kept in sync with a
`matchMedia` listener while in system mode). Toggle and icon both read `resolvedTheme`.
Any component that themes off the active mode (e.g. canvas/portrait colors) should also
use `resolvedTheme`, never the raw `theme`.
