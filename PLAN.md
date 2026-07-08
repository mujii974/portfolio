# PLAN.md — mujii.dev redesign

Goal: complete ultra-premium redesign. Keep: ASCII hero animation, all real content, theme system, routing, deploy setup. No git commits.

## Assets (from ~/Downloads, ChatGPT image 2.0 originals)
1. Crop 5 transparent poses from sticker sheet → `src/assets/character/pose-{phone,steepled,pointing,crossed,thinking}.png`
2. Copy full-body → `src/assets/character/operative.png`
3. New favicon (M/ monogram SVG). OG image: hero screenshot at the end.

## Files
- `src/index.css` — rewrite: Fontshare (Cabinet Grotesk, Satoshi) + JBM, OKLCH tokens (light/dark), utilities (grain, marquee, scanline), @theme mapping `var()` not `hsl(var())`.
- `index.html` — font links + CSP hosts (api/cdn.fontshare.com), meta refresh.
- NEW `src/components/three/SignalField.tsx` — 3D background.
- NEW `src/components/fx/` — `Magnetic.tsx`, `Scramble.tsx`, `Reveal.tsx`, `TiltCard.tsx`, `Noise.tsx`, `Marquee.tsx`.
- NEW `src/components/SiteNav.tsx` (replaces Navbar+PillNav), `Boot.tsx` (first-visit decode overlay).
- Rewrites: `Hero.tsx`, `About.tsx`, `Projects.tsx` (sticky stack + procedural artifacts), `Trajectory.tsx` (replaces Timeline), `Arsenal.tsx` (replaces Skills), `Dossier.tsx` (replaces CV; certs + download + QR + PDF dialog), `Contact.tsx`, `pages/home.tsx`, `pages/not-found.tsx`.
- NEW `src/components/artifacts/ProjectArtifact.tsx` — canvas artifacts (mesh / pulse-grid / radar) per project, offscreen-paused.
- Tweak `AsciiArt.tsx` accents if needed (keep behavior). Keep `DotField`.
- Delete after integration: `Navbar.tsx`, `PillNav.tsx`, `PillNav.css`, `GrainBackground.tsx`, `Timeline.tsx`, `Skills.tsx`, `CV.tsx`.

## Sections
Nav → Hero (ASCII + scramble headline + status marquee) → 00 About (narrative + operative tilt-card + stat strip) → 01 Projects (sticky stack ×3) → 02 Trajectory (scroll-drawn line) → 03 Arsenal (group rail + chip swap) → 04 Dossier (certs, CV download, QR, PDF dialog) → 05 Contact (finale + character + rows + Doha clock + footer).

## Verify (QA_GATE)
typecheck + build; preview at 375/768/1280+; light+dark; reduced-motion; console clean; user-config audit checklist (overflow, min-width:0, z-index, font sizes, breakpoints); Lighthouse-ish sanity (canvas DPR caps, lazy images). Log to Obsidian. NO COMMIT.
