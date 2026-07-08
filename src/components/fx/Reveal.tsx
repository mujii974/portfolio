import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** wrap in overflow-hidden for a masked line reveal */
  mask?: boolean;
};

/**
 * Masked rise-in, triggered once when scrolled into view.
 * Visibility is observed on the outer wrapper: a child translated outside an
 * overflow-hidden parent is fully clipped, so observing the child itself
 * would never fire.
 */
export default function Reveal({ children, delay = 0, y = 28, className, mask = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Top margin extends far above the viewport so content jumped past (End
  // key, fast fling, anchor jump) still counts as seen and reveals.
  const inView = useInView(ref, { once: true, margin: "999px 0px -60px 0px" });

  return (
    <div ref={ref} className={`${mask ? "overflow-hidden" : ""} ${className ?? ""}`}>
      <motion.div
        initial={false}
        animate={
          inView
            ? { opacity: 1, y: 0 }
            : { opacity: mask ? 1 : 0, y: mask ? "110%" : y }
        }
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
