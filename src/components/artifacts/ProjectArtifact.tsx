import { memo, useEffect, useRef } from "react";

export type ArtifactVariant = "mesh" | "wards" | "radar";

type Palette = {
  accent: string; // "r, g, b"
  line: string;
  alert: string;
};

function palette(): Palette {
  const dark = document.documentElement.classList.contains("dark");
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() ||
    (dark ? "79, 142, 247" : "43, 78, 196");
  return {
    accent,
    line: dark ? "168, 182, 210" : "84, 96, 124",
    alert: dark ? "235, 108, 96" : "205, 72, 60",
  };
}

/* ── Zero-trust proxy: packets race toward a hardened core ────────── */
function drawMesh(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: Palette) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.36;
  const N = 8;

  const nodes = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 + t * 0.05;
    return { x: cx + Math.cos(a) * R * 1.18, y: cy + Math.sin(a) * R * 0.82 };
  });

  ctx.lineWidth = 1;
  nodes.forEach((n, i) => {
    ctx.strokeStyle = `rgba(${p.line}, 0.16)`;
    ctx.beginPath();
    ctx.moveTo(n.x, n.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    const m = nodes[(i + 1) % N];
    ctx.strokeStyle = `rgba(${p.line}, 0.08)`;
    ctx.beginPath();
    ctx.moveTo(n.x, n.y);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
  });

  // Packets: some verified (pass), some hostile (blocked at the core).
  for (let k = 0; k < 6; k++) {
    const cycle = 3.2 + k * 0.9;
    const phase = ((t + k * 1.7) % cycle) / cycle;
    const from = nodes[(k * 3 + 1) % N];
    const hostile = k % 3 === 2;
    const cap = hostile ? 0.5 : 1;
    const q = Math.min(phase / cap, 1);
    const x = from.x + (cx - from.x) * q;
    const y = from.y + (cy - from.y) * q;
    if (phase <= cap) {
      ctx.fillStyle = hostile ? `rgba(${p.alert}, 0.9)` : `rgba(${p.accent}, 0.9)`;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (hostile && phase < cap + 0.12) {
      // Block flash at the perimeter ring.
      const ringR = R * 0.34 + (phase - cap) * 90;
      ctx.strokeStyle = `rgba(${p.alert}, ${0.6 * (1 - (phase - cap) / 0.12)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  nodes.forEach((n, i) => {
    const pulse = 2 + Math.sin(t * 2 + i) * 0.6;
    ctx.fillStyle = `rgba(${p.line}, 0.75)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2);
    ctx.fill();
  });

  // The proxy core: double ring + breathing glow.
  const breathe = 1 + Math.sin(t * 1.6) * 0.08;
  ctx.strokeStyle = `rgba(${p.accent}, 0.9)`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.3 * breathe, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = `rgba(${p.accent}, 0.3)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.4 * breathe, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = `rgba(${p.accent}, 0.16)`;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.3 * breathe, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.fillStyle = `rgba(${p.accent}, 0.85)`;
  ctx.textAlign = "center";
  ctx.fillText("DZT", cx, cy + 3.5);
}

/* ── Hospital wards: floorplan grid with a live ECG trace ─────────── */
function drawWards(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: Palette) {
  const cols = 8;
  const rows = 5;
  const pad = Math.min(w, h) * 0.09;
  const cw = (w - pad * 2) / cols;
  const ch = (h - pad * 2) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * cw;
      const y = pad + r * ch;
      const glow = Math.max(0, Math.sin(t * 1.2 + c * 0.9 + r * 1.7));
      ctx.strokeStyle = `rgba(${p.line}, ${0.14 + glow * 0.08})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 3, y + 3, cw - 6, ch - 6);
      if ((r * cols + c) % 7 === 3) {
        ctx.fillStyle = `rgba(${p.accent}, ${0.25 + glow * 0.5})`;
        ctx.beginPath();
        ctx.arc(x + cw - 10, y + 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ECG sweeping across the middle band.
  const midY = h / 2;
  const sweep = ((t * 0.22) % 1.3) * w;
  ctx.strokeStyle = `rgba(${p.accent}, 0.95)`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  let started = false;
  for (let x = 0; x < w; x += 2) {
    const d = sweep - x;
    if (d < 0 || d > w * 0.55) continue;
    const fade = 1 - d / (w * 0.55);
    const local = (x % (w / 4)) / (w / 4);
    let y = midY;
    if (local > 0.42 && local < 0.5) y = midY - Math.sin((local - 0.42) / 0.08 * Math.PI) * ch * 1.15;
    else if (local > 0.5 && local < 0.56) y = midY + Math.sin((local - 0.5) / 0.06 * Math.PI) * ch * 0.5;
    else y = midY + Math.sin(x * 0.08 + t) * 1.4;
    ctx.globalAlpha = fade;
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.fillStyle = `rgba(${p.line}, 0.6)`;
  ctx.textAlign = "left";
  ctx.fillText("RBAC: ENFORCED", pad, h - pad + 14);
  ctx.textAlign = "right";
  ctx.fillText(`WARD ${String.fromCharCode(65 + (Math.floor(t / 4) % 6))}`, w - pad, h - pad + 14);
}

/* ── Battleship radar: sweep, blips, board coordinates ────────────── */
function drawRadar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: Palette) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.4;

  for (let i = 1; i <= 3; i++) {
    ctx.strokeStyle = `rgba(${p.line}, ${0.2 - i * 0.04})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, (R / 3) * i, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(${p.line}, 0.12)`;
  ctx.beginPath();
  ctx.moveTo(cx - R, cy);
  ctx.lineTo(cx + R, cy);
  ctx.moveTo(cx, cy - R);
  ctx.lineTo(cx, cy + R);
  ctx.stroke();

  // Board coordinates — it is Battleship, after all.
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.fillStyle = `rgba(${p.line}, 0.55)`;
  "ABCDE".split("").forEach((ch, i) => {
    ctx.textAlign = "right";
    ctx.fillText(ch, cx - R - 8, cy - R + 14 + i * (R / 2.5));
  });
  "12345".split("").forEach((n, i) => {
    ctx.textAlign = "center";
    ctx.fillText(n, cx - R + 14 + i * (R / 2.5), cy - R - 8);
  });

  // Rotating sweep with a fading wake.
  const a = t * 0.9;
  const grad = ctx.createConicGradient
    ? (() => {
        const g = ctx.createConicGradient(a, cx, cy);
        g.addColorStop(0, `rgba(${p.accent}, 0.28)`);
        g.addColorStop(0.12, `rgba(${p.accent}, 0)`);
        g.addColorStop(1, `rgba(${p.accent}, 0)`);
        return g;
      })()
    : `rgba(${p.accent}, 0.12)`;
  ctx.fillStyle = grad as CanvasGradient | string;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, R, a, a + 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `rgba(${p.accent}, 0.9)`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  ctx.stroke();

  // Deterministic blips that flare when the sweep passes.
  for (let k = 0; k < 5; k++) {
    const ba = (k * 2.4 + 0.7) % (Math.PI * 2);
    const br = R * (0.3 + ((k * 37) % 60) / 100);
    const bx = cx + Math.cos(ba) * br;
    const by = cy + Math.sin(ba) * br;
    const diff = (a - ba) % (Math.PI * 2);
    const norm = diff < 0 ? diff + Math.PI * 2 : diff;
    const flare = Math.max(0, 1 - norm / 2.2);
    if (flare > 0.02) {
      ctx.fillStyle = `rgba(${p.accent}, ${flare})`;
      ctx.beginPath();
      ctx.arc(bx, by, 2.4 + flare * 1.6, 0, Math.PI * 2);
      ctx.fill();
      if (flare > 0.55) {
        ctx.fillStyle = `rgba(${p.line}, ${flare * 0.8})`;
        ctx.textAlign = "left";
        ctx.fillText(`0x${((k + 3) * 1289).toString(16).toUpperCase()}`, bx + 7, by - 6);
      }
    }
  }
}

const DRAW: Record<ArtifactVariant, typeof drawMesh> = {
  mesh: drawMesh,
  wards: drawWards,
  radar: drawRadar,
};

/**
 * Procedural, theme-aware canvas artwork for a project panel.
 * Runs only while on screen; renders one static frame under reduced motion.
 */
function ProjectArtifact({ variant, className }: { variant: ArtifactVariant; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pal = palette();
    let raf = 0;
    let visible = false;
    let w = 0;
    let h = 0;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      DRAW[variant](ctx, w, h, t, pal);
    };

    const loop = (ts: number) => {
      if (!visible) return;
      draw(ts / 1000);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now() / 1000);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting && !reduced;
        if (visible && !was) raf = requestAnimationFrame(loop);
        if (!visible) cancelAnimationFrame(raf);
        if (entry.isIntersecting && reduced) draw(4.2);
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      pal = palette();
      if (reduced) draw(4.2);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [variant]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`h-full w-full ${className ?? ""}`} />;
}

export default memo(ProjectArtifact);
