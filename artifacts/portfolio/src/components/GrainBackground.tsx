export default function GrainBackground() {
  return (
    <>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--accent) / 0.05), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <svg className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
}
