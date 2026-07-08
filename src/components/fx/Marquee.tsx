import { memo, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

const wrapRange = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
};

type MarqueeProps = {
  children: ReactNode;
  /** base speed in % of one content-copy per second */
  baseVelocity?: number;
  className?: string;
};

/**
 * Scroll-velocity-reactive ticker: drifts left on its own, accelerates with
 * scroll speed, and reverses direction when scrolling back up.
 */
function Marquee({ children, baseVelocity = 2.2, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrapRange(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    let moveBy = direction.current * -baseVelocity * (delta / 1000);
    moveBy += moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden marquee-mask ${className ?? ""}`}>
      <motion.div className="marquee-track" style={{ x: reduced ? 0 : x }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default memo(Marquee);
