import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import profileCutout from "@assets/profile_cutout.png";
import DotField from "./DotField";
// Dark (space) -> light (dense). Brighter source pixels get heavier glyphs.
const RAMP = " .'`^\":;Il!i~+_-?][}{1)|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao#MW&8%B@";
// Characters cycled through during the scramble-in reveal.
const SCRAMBLE = "01<>[]{}\\/\\|=+*#%&$XYZJCnuvxw?!:;";

const ACCENT_RGB_DARK = "79, 142, 247";
const ACCENT_RGB_LIGHT = "37, 64, 180";

// Crop window over the source image (head + upper torso), as fractions.
const CROP = { x: 0.28, y: 0.2, w: 0.52, h: 0.36 };

const COLS = 104;
const CELL_W = 5;
const CELL_H = 9;
const REVEAL_MS = 1700;

type Cell = {
  px: number;
  py: number;
  char: string;
  op: number;
  settle: number;
  // Cursor-driven displacement, eased toward a target each frame.
  ox: number;
  oy: number;
};

// Cursor interaction tuning for the dot-bulge effect on the glyph grid.
const CURSOR_RADIUS = 110;
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
const BULGE_STRENGTH = 16;
// Higher = snappier follow (less lag), for a fast water-like response.
const BULGE_EASE = 0.65;

export default function AsciiArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const animatedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  // Track theme so the dot field tint follows light/dark mode.
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Build the glyph grid from the image once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const img = new Image();
    img.src = profileCutout;
    img.onload = () => {
      if (cancelled) return;
      const sx = img.width * CROP.x;
      const sy = img.height * CROP.y;
      const sw = img.width * CROP.w;
      const sh = img.height * CROP.h;
      const rows = Math.round(COLS * (CELL_W / CELL_H) * (sh / sw));

      const sampler = document.createElement("canvas");
      sampler.width = COLS;
      sampler.height = rows;
      const sctx = sampler.getContext("2d");
      if (!sctx) return;
      sctx.clearRect(0, 0, COLS, rows);
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, rows);
      const data = sctx.getImageData(0, 0, COLS, rows).data;

      // Contrast stretch over opaque (figure) pixels only.
      const n = COLS * rows;
      const luma = new Float32Array(n);
      const alpha = new Float32Array(n);
      let min = 255;
      let max = 0;
      for (let i = 0; i < n; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const a = data[i * 4 + 3] / 255;
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        luma[i] = l;
        alpha[i] = a;
        if (a > 0.5) {
          if (l < min) min = l;
          if (l > max) max = l;
        }
      }
      const range = Math.max(1, max - min);

      const cells: Cell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          if (alpha[i] < 0.45) continue;
          const t = Math.max(0, Math.min(1, (luma[i] - min) / range));
          const ci = Math.round(t * (RAMP.length - 1));
          const ch = RAMP[ci];
          if (ch === " ") continue;
          cells.push({
            px: x * CELL_W,
            py: y * CELL_H,
            char: ch,
            op: 0.5 + t * 0.5,
            // Reveal top-to-bottom with a little randomness.
            settle: Math.min(0.95, (y / rows) * 0.7 + Math.random() * 0.3),
            ox: 0,
            oy: 0,
          });
        }
      }
      cellsRef.current = cells;

      // Size the canvas (DPR-aware for crisp glyphs).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = COLS * CELL_W;
      const cssH = rows * CELL_H;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.style.aspectRatio = `${cssW} / ${cssH}`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      setReady(true);
    };

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, []);

  // Draw (animated reveal first time, instant redraw on theme change).
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cells = cellsRef.current;
    const cssW = parseFloat(canvas.style.width);
    const cssH = parseFloat(canvas.style.height);

    // Track cursor position in canvas-local CSS px so glyphs can bulge
    // away from it, mirroring the dot-field interaction on DotField.
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) { onLeave(); return; }
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave, { passive: true });

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const paint = (progress: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      const rgb = isDark ? ACCENT_RGB_DARK : ACCENT_RGB_LIGHT;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = `${CELL_H}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];

        if (!prefersReduced) {
          const dx = mouse.x - c.px;
          const dy = mouse.y - c.py;
          const distSq = dx * dx + dy * dy;
          let tx = 0;
          let ty = 0;
          if (distSq < CURSOR_RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            // Smoothstep falloff: continuous to zero at the radius edge
            // with no hard cutoff, so displaced glyphs don't pile into a
            // visible ring right at the boundary.
            const t = 1 - dist / CURSOR_RADIUS;
            const tt = t * t * (3 - 2 * t);
            const push = tt * BULGE_STRENGTH;
            const angle = Math.atan2(dy, dx);
            tx = -Math.cos(angle) * push;
            ty = -Math.sin(angle) * push;
          }
          c.ox += (tx - c.ox) * BULGE_EASE;
          c.oy += (ty - c.oy) * BULGE_EASE;
        }

        const drawX = c.px + c.ox;
        const drawY = c.py + c.oy;

        if (progress >= c.settle) {
          ctx.fillStyle = `rgba(${rgb}, ${c.op})`;
          ctx.fillText(c.char, drawX, drawY);
        } else {
          const ch = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
          ctx.fillStyle = `rgba(${rgb}, ${c.op * 0.35})`;
          ctx.fillText(ch, drawX, drawY);
        }
      }
    };

    if (prefersReduced) {
      paint(1);
      animatedRef.current = true;
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
      };
    }

    // Run a persistent loop: drives the scramble-in reveal first, then
    // keeps repainting indefinitely so the cursor bulge stays live and
    // theme switches are picked up automatically.
    let start = 0;
    const loop = (ts: number) => {
      if (!start) start = ts;
      const p = animatedRef.current ? 1 : (ts - start) / REVEAL_MS;
      if (p >= 1) animatedRef.current = true;
      paint(Math.min(p, 1));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, [ready]);

  return (
    <motion.div
      className="w-full max-w-[400px] shrink-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.96 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      data-testid="ascii-canvas"
    >
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            cursorRadius={220}
            cursorForce={0.1}
            bulgeOnly={true}
            bulgeStrength={40}
            glowRadius={0}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom={`rgba(${isDark ? ACCENT_RGB_DARK : ACCENT_RGB_LIGHT}, 0.3)`}
            gradientTo={`rgba(${isDark ? ACCENT_RGB_DARK : ACCENT_RGB_LIGHT}, 0.08)`}
            glowColor="transparent"
          />
        </div>
        <canvas
          ref={canvasRef}
          role="img"
          className="relative z-10 w-full select-none"
          style={{ height: "auto" }}
          aria-label="ASCII portrait of Mujtaba Shahid"
        />
      </div>
    </motion.div>
  );
}
