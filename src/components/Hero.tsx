import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Linkedin, ArrowDown, FileDown } from "lucide-react";
import AsciiArt from "./AsciiArt";
import Magnetic from "./fx/Magnetic";
import Scramble from "./fx/Scramble";
import Marquee from "./fx/Marquee";
import { scrollToTarget } from "./fx/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

const TICKER = [
  "location: doha, qatar",
  "status: open to work",
  "cert: ceh v13 / in progress",
  "focus: zero-trust for agentic ai",
  "bsc data & cybersecurity / udst 2026",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Pronounced scroll-scrub: portrait and copy pull apart with depth as the
  // hero exits. Kept on for everyone (motion is the product); the amplitude
  // trims slightly under reduced motion rather than switching off entirely.
  const amp = reduced ? 0.4 : 1;
  const asciiY = useTransform(scrollYProgress, [0, 1], [0, -150 * amp]);
  const asciiScale = useTransform(scrollYProgress, [0, 1], [1, 1 - 0.16 * amp]);
  const asciiRotate = useTransform(scrollYProgress, [0, 1], [0, -4 * amp]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70 * amp]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) scrollToTarget(el, -80);
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden pt-24"
    >
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity: fade }} className="order-1 py-6 lg:py-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="overline-label mb-6 flex items-center gap-3"
          >
            <span className="status-dot shrink-0" />
            <Scramble text="cybersecurity // secure development // web" step={16} />
          </motion.p>

          <h1 className="mb-7 font-display font-extrabold leading-[0.98] tracking-tight text-foreground">
            {["Mujtaba", "Shahid"].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: EASE }}
                  className="block text-[clamp(3.1rem,8.5vw,6.1rem)]"
                >
                  {word}
                  {i === 1 && <span className="text-accent">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mb-10 max-w-[34rem] text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            I design and build systems that are hard to break: from
            pentesting isolated networks to zero-trust layers for AI agents.
            Currently completing CEH v13 in Doha.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollTo("#projects")}
                className="group flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-lg transition-transform active:scale-[0.97]"
                data-testid="btn-view-work"
              >
                View my work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a
                href="/cv/Mujtaba_Shahid_CV.pdf"
                download
                className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-accent/50 active:scale-[0.97]"
                data-testid="btn-download-cv"
              >
                <FileDown className="h-4 w-4 text-accent" />
                Download CV
              </a>
            </Magnetic>

            <div className="ml-1 flex items-center gap-5">
              <a
                href="https://github.com/mujii974/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-accent"
                data-testid="link-github-hero"
              >
                <SiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/mujtaba-shahid/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-accent"
                data-testid="link-linkedin-hero"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ASCII portrait — the brand mark */}
        <motion.div
          style={{ y: asciiY, scale: asciiScale, rotate: asciiRotate, opacity: fade }}
          className="order-2 flex flex-col items-center justify-center lg:items-end"
        >
          <AsciiArt />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            25.2854° N, 51.5310° E / rendered from 62 glyphs
          </motion.p>
        </motion.div>
      </div>

      {/* Status ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 border-y border-border bg-background/60 backdrop-blur"
      >
        <Marquee baseVelocity={2.2} className="py-3.5">
          {TICKER.map((item) => (
            <span
              key={item}
              className="mx-7 flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              {item}
              <span aria-hidden="true" className="text-accent">✳</span>
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
