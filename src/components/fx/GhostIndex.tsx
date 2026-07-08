import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type GhostIndexProps = {
  n: string;
  className?: string;
};

/**
 * Oversized outlined section index that drifts against scroll direction.
 * The outer span stays static so the scroll progress target never moves.
 */
export default function GhostIndex({ n, className }: GhostIndexProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const amp = reduced ? 40 : 130;
  const y = useTransform(scrollYProgress, [0, 1], [amp, -amp]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className ?? ""}`}
    >
      <motion.span
        style={{ y }}
        className="text-ghost-outline block font-display text-[clamp(5rem,11vw,8.5rem)] font-extrabold leading-none opacity-70"
      >
        {n}
      </motion.span>
    </span>
  );
}
