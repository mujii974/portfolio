import { useEffect, useRef, useState, memo } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Same glyph pool as the ASCII portrait, so text decodes in the site voice.
const GLYPHS = "01<>[]{}|=+*#%&$XYZJCnuvxw?!:;";

type ScrambleProps = {
  text: string;
  className?: string;
  /** ms before decode starts once in view */
  delay?: number;
  /** ms per character lock-in */
  step?: number;
  once?: boolean;
};

function Scramble({ text, className, delay = 0, step = 28, once = true }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "999px 0px -40px 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : "");
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (!inView) return;

    let start = 0;
    const total = text.length * step + delay;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = ts - start - delay;
      if (t < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const locked = Math.min(text.length, Math.floor(t / step));
      let out = text.slice(0, locked);
      for (let i = locked; i < text.length; i++) {
        const ch = text[i];
        out += ch === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (ts - start < total) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, text, delay, step, reduced]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || " "}</span>
    </span>
  );
}

export default memo(Scramble);
