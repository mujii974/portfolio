import { memo, useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
  CanvasTexture,
  Color,
  AdditiveBlending,
  NormalBlending,
  Group,
} from "three";

const THEME = {
  dark: { accent: 0x4f8ef7, faint: 0x8ab4f9, opacity: 0.5 },
  light: { accent: 0x2b4ec4, faint: 0x5b7bd6, opacity: 0.28 },
};

// Soft round sprite so points render as glowing dots, not squares.
function makeSprite(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

function makeLayer(count: number, spread: number, depth: [number, number], size: number, sprite: CanvasTexture) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62;
    positions[i * 3 + 2] = depth[0] + Math.random() * (depth[1] - depth[0]);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(positions, 3));
  const mat = new PointsMaterial({
    size,
    map: sprite,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new Points(geo, mat);
}

/**
 * Fixed full-viewport particle depth field behind all content.
 * Pointer parallax + scroll dolly + theme awareness. Pauses when the tab is
 * hidden; renders a single static frame under prefers-reduced-motion.
 */
function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // No WebGL: the CSS background carries the scene alone.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 0, 10);

    const sprite = makeSprite();
    const field = new Group();
    const density = small ? 0.45 : 1;
    const layers = [
      makeLayer(Math.round(420 * density), 70, [-30, -8], 0.5, sprite),
      makeLayer(Math.round(520 * density), 95, [-60, -28], 0.72, sprite),
      makeLayer(Math.round(320 * density), 120, [-95, -55], 1.05, sprite),
    ];
    layers.forEach((l) => field.add(l));
    scene.add(field);

    const isDark = () => document.documentElement.classList.contains("dark");
    const applyTheme = () => {
      const t = isDark() ? THEME.dark : THEME.light;
      layers.forEach((l, i) => {
        const m = l.material as PointsMaterial;
        m.color = new Color(i === 1 ? t.faint : t.accent);
        m.opacity = t.opacity * (1 - i * 0.18);
        // Additive glow reads beautifully on dark; normal blending on paper.
        m.blending = isDark() ? AdditiveBlending : NormalBlending;
        m.needsUpdate = true;
      });
    };
    applyTheme();

    const themeObserver = new MutationObserver(() => {
      applyTheme();
      if (reduced) renderer.render(scene, camera);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Pointer parallax target (mouse only), lerped in the frame loop.
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 2.2;
      target.y = -(e.clientY / window.innerHeight - 0.5) * 1.4;
    };

    // Cache the scrollable height so the frame loop never triggers a layout
    // read (getBoundingClientRect/scrollHeight) — recomputed only on resize
    // or when content height actually changes.
    let docTotal = 0;
    const measureDocTotal = () => {
      const doc = document.documentElement;
      docTotal = doc.scrollHeight - doc.clientHeight;
    };
    measureDocTotal();
    const resizeObserver = new ResizeObserver(measureDocTotal);
    resizeObserver.observe(document.documentElement);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      measureDocTotal();
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        window.removeEventListener("resize", onResize);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        layers.forEach((l) => {
          l.geometry.dispose();
          (l.material as PointsMaterial).dispose();
        });
        sprite.dispose();
        renderer.dispose();
      };
    }

    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;

      // Scroll dolly: drift deeper into the field as the page scrolls.
      const p = docTotal > 0 ? window.scrollY / docTotal : 0;

      camera.position.x += (target.x - camera.position.x) * 0.04;
      camera.position.y += (target.y + p * -2.5 - camera.position.y) * 0.04;
      camera.position.z = 10 - p * 5;
      camera.lookAt(0, p * -2.5, -40);

      layers[0].rotation.y = t * 0.012;
      layers[1].rotation.y = -t * 0.008;
      layers[2].rotation.y = t * 0.005;
      field.rotation.z = p * 0.12;
      field.position.y = Math.sin(t * 0.25) * 0.4;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      layers.forEach((l) => {
        l.geometry.dispose();
        (l.material as PointsMaterial).dispose();
      });
      sprite.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fade-in-slow pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

export default memo(SignalField);
