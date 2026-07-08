import { memo } from "react";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

// Static film grain. Fixed + pointer-events-none so it never repaints on scroll.
function Noise() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-overlay"
      style={{ backgroundImage: NOISE_SVG, opacity: "var(--grain-opacity)" }}
    />
  );
}

export default memo(Noise);
