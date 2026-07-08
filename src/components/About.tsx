import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "./fx/Reveal";
import TiltCard from "./fx/TiltCard";
import GhostIndex from "./fx/GhostIndex";
import operative from "@assets/character/operative.webp";

const STATS = [
  { value: "BSc", label: "Data & Cybersecurity, UDST" },
  { value: "CEH v13", label: "EC-Council, in progress" },
  { value: "Doha", label: "Qatar, GMT+3" },
  { value: "2026", label: "Graduating class" },
];

const CARD_META = [
  { k: "id", v: "MUJII-974" },
  { k: "role", v: "SECURITY + DEV" },
  { k: "loc", v: "DOHA / QA" },
  { k: "status", v: "ACTIVE", live: true },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cardAmp = reduced ? 30 : 110;
  const cardY = useTransform(scrollYProgress, [0, 1], [cardAmp, -cardAmp]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:py-36"
    >
      <div className="relative mb-14 md:mb-20">
        <GhostIndex n="00" className="absolute -top-6 right-0" />
        <Reveal>
          <p className="overline-label mb-4">
            00 <span className="text-accent">/</span> profile
          </p>
        </Reveal>
        <Reveal delay={0.08} mask>
          <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold tracking-tight text-foreground">
            Precision over noise.
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal delay={0.1}>
            <p className="mb-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              Data &amp; Cybersecurity graduate from UDST, Doha. I&rsquo;m drawn to the
              intersection of{" "}
              <span className="text-foreground">offensive security</span> and{" "}
              <span className="text-foreground">secure system design</span>: pentesting
              isolated networks, architecting zero-trust layers for AI systems.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="max-w-[62ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              Outside the lab, I&rsquo;ve shipped real products at agencies and worked
              live events under pressure, including a World Cup. Currently
              completing CEH v13.
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <dl className="mt-12 grid grid-cols-2 border-y border-border md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.value}
                  className={`px-5 py-6 ${i > 0 ? "border-l border-border" : ""} ${
                    i === 2 ? "max-md:border-l-0 max-md:border-t max-md:border-border" : ""
                  } ${i === 3 ? "max-md:border-t max-md:border-border" : ""}`}
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-xl font-medium text-foreground md:text-2xl">
                    {s.value}
                  </dd>
                  <dd className="mt-1.5 text-xs leading-snug text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Operative card — counter-parallax against the scroll */}
        <Reveal delay={0.2} className="mx-auto w-full max-w-[400px] lg:mx-0 lg:justify-self-end">
          <motion.div style={{ y: cardY }}>
            <TiltCard maxTilt={8} className="w-full">
            <figure className="overflow-hidden rounded-3xl border border-border bg-[#363b4d] shadow-lg">
              <figcaption className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                <span>operative dossier</span>
                <span className="text-[rgba(var(--accent-rgb),1)]">public / 1a</span>
              </figcaption>

              <div className="relative">
                <img
                  src={operative}
                  alt="Illustrated full-body character of Mujtaba in a grey double-breasted suit"
                  width={820}
                  height={1093}
                  loading="lazy"
                  className="block w-full select-none"
                  draggable={false}
                />
                {/* Corner brackets */}
                <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5 border-l border-t border-white/30" />
                <span aria-hidden="true" className="absolute right-4 top-4 h-5 w-5 border-r border-t border-white/30" />
                <span aria-hidden="true" className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-white/30" />
                <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-white/30" />
              </div>

              <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
                {CARD_META.map((m) => (
                  <div key={m.k} className="bg-[#31364a] px-5 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{m.k}</p>
                    <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-white/90">
                      {m.live && <span className="status-dot !h-1.5 !w-1.5 shrink-0" />}
                      {m.v}
                    </p>
                  </div>
                ))}
              </div>
            </figure>
            </TiltCard>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
