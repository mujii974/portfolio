import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/**
 * Scroll helper that routes through Lenis when it's active, falling back to
 * native scrolling (touch devices, reduced motion, hidden tab, or before
 * mount).
 */
export function scrollToTarget(target: Element | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target as HTMLElement | number, { offset });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior });
  }
}

/**
 * Inertia smooth scrolling (Lenis) for mouse/trackpad users.
 * Touch devices and reduced-motion users keep native scrolling. Lenis is
 * torn down whenever the tab is hidden (its RAF loop would be throttled to
 * zero anyway, and native scroll is a safer fallback) and rebuilt on return.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scrolling is core to this experience, so it runs for everyone on
    // pointer devices. Touch devices keep native momentum scrolling.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    let raf = 0;

    const start = () => {
      if (lenis) return;
      // Duration + expo-out easing is the canonical "buttery" Lenis feel:
      // a decisive glide that settles smoothly instead of a laggy float.
      lenis = new Lenis({
        duration: 0.95,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1.05,
        touchMultiplier: 1.6,
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  return null;
}
