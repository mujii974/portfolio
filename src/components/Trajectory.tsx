import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import Reveal from "./fx/Reveal";
import GhostIndex from "./fx/GhostIndex";

type Entry = {
  title: string;
  org: string;
  year: string;
  period: string;
  points: string[];
  kind: "work" | "edu";
};

const ENTRIES: Entry[] = [
  {
    title: "Web Developer & Designer",
    org: "NOVERA.DEV · Doha, Qatar",
    year: "'25 — '26",
    period: "Intern · May 2025 – Jan 2026",
    points: [
      "Built and launched two Shopify storefronts end-to-end",
      "Shipped responsive frontend work on internal portfolio sites (LIKO, Rivor)",
      "WordPress + Elementor + WooCommerce; Git, CI/CD basics",
    ],
    kind: "work",
  },
  {
    title: "Event Operations Coordinator",
    org: "The Planners W.L.L. · FIFA World Cup 2022",
    year: "'22",
    period: "Freelance · Nov – Dec 2022",
    points: [
      "On-site logistics across stadium zones during matchdays",
      "Coordinated VIP protocols, media access, and transport routing",
      "Held comms between event control, hospitality, and venue security",
    ],
    kind: "work",
  },
  {
    title: "Customer Service Agent, Airport Services",
    org: "Qatar Airways",
    year: "'21 — '22",
    period: "Oct 2021 – Jan 2022",
    points: [
      "Flight bookings, reschedules, special requests on Amadeus ticketing system",
      "Gate operations and distressed passenger support; outstanding feedback",
    ],
    kind: "work",
  },
  {
    title: "BSc, Data and Cybersecurity",
    org: "University of Doha for Science and Technology (UDST)",
    year: "'22 — '26",
    period: "Jan 2022 – May 2026",
    points: [
      "Five-person research team on LLM and agentic AI security under a PhD supervisor",
      "Grade A in Project Management; group lead across all team projects",
    ],
    kind: "edu",
  },
  {
    title: "High School Diploma",
    org: "Ideal Indian School, Doha, Qatar",
    year: "'18",
    period: "Graduated Mar 2018",
    points: [],
    kind: "edu",
  },
];

const KIND_ICON: Record<Entry["kind"], LucideIcon> = {
  work: Briefcase,
  edu: GraduationCap,
};

function SectionDivider({ label, count }: { label: string; count: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "999px 0px -40px 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-8 flex items-center gap-4 pt-2 first:pt-0"
    >
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{count}</span>
    </motion.div>
  );
}

function EntryRow({ entry, index }: { entry: Entry; index: number }) {
  const Icon = KIND_ICON[entry.kind];
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "999px 0px -70px 0px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Node on the rail */}
      <span
        aria-hidden="true"
        className="absolute -left-[calc(1.5rem+5px)] top-[0.55rem] z-10 flex h-3 w-3 items-center justify-center sm:-left-[calc(2rem+5px)]"
      >
        <span className="absolute h-3 w-3 rounded-full bg-accent/25 transition-transform duration-500 group-hover:scale-[2.2]" />
        <span className="h-[7px] w-[7px] rounded-full bg-accent ring-4 ring-background transition-transform duration-300 group-hover:scale-125" />
      </span>

      <div className="grid grid-cols-1 gap-x-8 gap-y-2 rounded-2xl px-4 py-5 transition-colors duration-300 hover:bg-card/60 sm:grid-cols-[92px_1fr] sm:px-5">
        {/* Year rail */}
        <div className="sm:pt-0.5">
          <span className="font-mono text-lg font-medium tabular-nums tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
            {entry.year}
          </span>
        </div>

        {/* Content */}
        <div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h3 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-foreground md:text-[1.4rem]">
              <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" focusable="false" />
              {entry.title}
            </h3>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {entry.period}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{entry.org}</p>

          {entry.points.length > 0 && (
            <ul className="mt-4 grid gap-2">
              {entry.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default function Trajectory() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  // A glowing pulse that rides the drawn line as it fills.
  const pulseTop = useTransform(drawn, [0, 1], ["0%", "100%"]);

  const work = ENTRIES.filter((e) => e.kind === "work");
  const edu = ENTRIES.filter((e) => e.kind === "edu");

  return (
    <section id="experience" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:py-36">
      <div className="relative mb-16 md:mb-20">
        <GhostIndex n="02" className="absolute -top-6 right-0" />
        <Reveal>
          <p className="overline-label mb-4">
            02 <span className="text-accent">/</span> trajectory
          </p>
        </Reveal>
        <Reveal delay={0.08} mask>
          <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold tracking-tight text-foreground">
            The path so far.
          </h2>
        </Reveal>
      </div>

      {/* Content sits entirely right of the rail so nothing overlaps the line */}
      <div ref={railRef} className="relative max-w-[900px] pl-6 sm:pl-8">
        {/* Rail: static track + scroll-drawn accent + riding pulse */}
        <span aria-hidden="true" className="absolute bottom-3 left-0 top-3 w-px bg-border" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: drawn, transformOrigin: "top" }}
          className="absolute bottom-3 left-0 top-3 w-px bg-accent"
        />
        <motion.span
          aria-hidden="true"
          style={{ top: pulseTop }}
          className="absolute left-[-3px] hidden h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(var(--accent-rgb),0.7)] motion-safe:block"
        />

        <SectionDivider label="Experience" count="3 roles" />
        <ol className="mb-14 grid gap-3">
          {work.map((entry, i) => (
            <EntryRow key={entry.title} entry={entry} index={i} />
          ))}
        </ol>

        <SectionDivider label="Education" count="2 programs" />
        <ol className="grid gap-3">
          {edu.map((entry, i) => (
            <EntryRow key={entry.title} entry={entry} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
