import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINES = [
  "mujii.dev // secure channel",
  "verifying integrity ......... ok",
  "loading portfolio ........... ok",
];

// Kept snappy on purpose: this overlay covers the real content on every
// fresh session (no sessionStorage flag yet), so its duration is a direct,
// deterministic tax on LCP for first-time visitors and lab audits.
const LINE_MS = 180;
const HOLD_MS = 180;

// One-time-per-session boot readout. Short, then gone.
export default function Boot() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem("mujii-boot") !== "done";
  });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!show || reduced) return;
    sessionStorage.setItem("mujii-boot", "done");
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setVisible(i + 1), (i + 1) * LINE_MS));
    });
    timers.push(
      window.setTimeout(() => setShow(false), LINES.length * LINE_MS + HOLD_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [show, reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          <div className="w-[300px] font-mono text-xs leading-7 text-muted-foreground">
            {LINES.slice(0, visible).map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={i === 0 ? "text-foreground" : undefined}
              >
                <span className="mr-2 text-accent">&gt;</span>
                {line}
              </motion.p>
            ))}
            <span className="caret-blink ml-4 inline-block h-3.5 w-2 translate-y-0.5 bg-accent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
