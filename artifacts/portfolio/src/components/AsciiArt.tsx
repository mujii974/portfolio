import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import profileCutout from "@assets/profile_cutout.png";
import { useTheme } from "./ThemeProvider";

// Dark (space) -> light (dense). Brighter source pixels get heavier glyphs.
const RAMP = " .'`^\":;Il!i~+_-?][}{1)|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao#MW&8%B@";

// Crop window over the source image (head + upper torso), as fractions.
const CROP = { x: 0.28, y: 0.2, w: 0.52, h: 0.36 };

const COLS = 84;
const CELL_W = 6;
const CELL_H = 11;

export default function AsciiArt() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Resolve the actual rendered theme (theme can be "system").
  const [isDark, setIsDark] = useState(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (theme === "dark") return setIsDark(true);
    if (theme === "light") return setIsDark(false);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

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

      // Keep aspect ratio: rows derived from crop aspect + glyph cell aspect.
      const rows = Math.round(COLS * (CELL_W / CELL_H) * (sh / sw));

      // Downsample the cropped region into a COLS x rows grid.
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

      // Size the canvas (account for DPR for crisp glyphs).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = COLS * CELL_W;
      const cssH = rows * CELL_H;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const accent = isDark ? "88, 166, 255" : "26, 107, 212";
      ctx.font = `${CELL_H}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          if (alpha[i] < 0.45) continue; // transparent background -> empty
          const t = (luma[i] - min) / range; // 0..1 normalized brightness
          const clamped = Math.max(0, Math.min(1, t));
          const ci = Math.round(clamped * (RAMP.length - 1));
          const ch = RAMP[ci];
          if (ch === " ") continue;
          // Heavier glyphs slightly more opaque for depth.
          const op = 0.55 + clamped * 0.45;
          ctx.fillStyle = `rgba(${accent}, ${op.toFixed(3)})`;
          ctx.fillText(ch, x * CELL_W, y * CELL_H);
        }
      }
      setReady(true);
    };

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [isDark]);

  return (
    <motion.div
      className="w-full max-w-[380px] shrink-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.96 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      data-testid="ascii-canvas"
    >
      <canvas
        ref={canvasRef}
        role="img"
        className="w-full h-auto select-none"
        aria-label="ASCII portrait of Mujtaba Shahid"
      />
    </motion.div>
  );
}
