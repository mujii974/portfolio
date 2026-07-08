import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "./fx/Reveal";
import GhostIndex from "./fx/GhostIndex";
import steepled from "@assets/character/pose-steepled.webp";

const GROUPS = [
  {
    title: "Security · hands-on",
    tag: "offense",
    blurb: "Run across live labs and full-cycle pentest engagements.",
    skills: ["Metasploit", "MSFvenom", "Burp Suite", "Nmap", "Wireshark", "Tcpdump", "Nessus", "OpenVAS", "Aircrack-ng", "Splunk"],
  },
  {
    title: "Security · studied",
    tag: "research",
    blurb: "Studied in depth through coursework and self-directed research.",
    skills: ["BloodHound", "Mimikatz", "Impacket", "Hydra", "Hashcat", "SQLmap", "Snort", "Suricata"],
  },
  {
    title: "Languages",
    tag: "code",
    blurb: "Where I'm fluent enough to both build and break.",
    skills: ["Python", "Java", "Bash", "SQL", "PowerShell", "JavaScript", "HTML/CSS", "YAML"],
  },
  {
    title: "Frameworks",
    tag: "defense",
    blurb: "The models I threat-model with and design controls around.",
    skills: ["MITRE ATT&CK", "NIST CSF", "OWASP Top 10", "Zero Trust", "STRIDE", "PASTA", "ISO 27001"],
  },
  {
    title: "Dev & lab",
    tag: "build",
    blurb: "The daily environment and virtual rigs I work inside.",
    skills: ["Git", "Docker", "VS Code", "IntelliJ IDEA", "VMware", "VirtualBox", "Kali Linux", "Ubuntu"],
  },
  {
    title: "IoT / OT",
    tag: "hardware",
    blurb: "Firmware, sensors, and the physical attack surface.",
    skills: ["Raspberry Pi", "Binwalk", "MQTT", "Arduino", "ESP32", "Zigbee"],
  },
  {
    title: "Web dev",
    tag: "ship",
    blurb: "What I reach for to ship real client products.",
    skills: ["Shopify", "WordPress", "Elementor", "WooCommerce", "Node.js"],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.skills.length, 0);
const MAX = Math.max(...GROUPS.map((g) => g.skills.length));
const CYCLE_MS = 5200;

const cloud = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
  exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
};
const chip = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -8, filter: "blur(2px)", transition: { duration: 0.2 } },
};

export default function Arsenal() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const group = GROUPS[active];

  // Auto-cycle so the wall feels alive; pauses on hover/focus or reduced motion.
  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % GROUPS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, reduced]);

  const hoverProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return (
    <section id="skills" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div>
          <Reveal>
            <p className="overline-label mb-4">
              03 <span className="text-accent">/</span> arsenal
            </p>
          </Reveal>
          <Reveal delay={0.08} mask>
            <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold tracking-tight text-foreground">
              Tools I work with.
            </h2>
          </Reveal>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <GhostIndex n="03" className="hidden sm:block" />
          <Reveal delay={0.15}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {TOTAL} instruments · {GROUPS.length} domains
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-10"
          {...hoverProps}
        >
          {/* Domain index */}
          <nav aria-label="Skill domains" className="flex flex-col gap-1">
            {GROUPS.map((g, i) => {
              const isActive = i === active;
              return (
                <button
                  key={g.title}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className="group relative overflow-hidden rounded-xl px-4 py-3 text-left transition-colors duration-300"
                  data-testid={`arsenal-tab-${i}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="arsenal-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border border-accent/40 bg-accent/[0.08]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? "text-accent" : "text-muted-foreground/50"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-base font-semibold tracking-tight transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {g.title}
                    </span>
                    <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground/60">
                      {String(g.skills.length).padStart(2, "0")}
                    </span>
                  </span>
                  {/* Count bar */}
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-2 block h-px w-full overflow-hidden bg-border"
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-accent"
                      initial={false}
                      animate={{ width: `${(g.skills.length / MAX) * 100}%`, opacity: isActive ? 1 : 0.32 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Living tool wall */}
          <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-border bg-card/40 p-6 sm:min-h-[300px] sm:p-8">
            {/* Domain watermark, bottom-right with breathing room */}
            <AnimatePresence mode="wait">
              <motion.span
                key={group.title}
                aria-hidden="true"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-ghost-outline pointer-events-none absolute bottom-5 right-6 max-w-[calc(100%-3rem)] select-none truncate text-right font-display text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-none opacity-60"
              >
                {group.tag}
              </motion.span>
            </AnimatePresence>

            <div className="relative z-10 mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="status-dot shrink-0" />
              domain {String(active + 1).padStart(2, "0")} <span className="text-accent">/</span> {group.title}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={group.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 mb-6 max-w-[42ch] text-sm leading-relaxed text-muted-foreground"
              >
                {group.blurb}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.ul
                key={group.title}
                variants={cloud}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10 flex flex-wrap gap-2.5"
                aria-label={group.title}
              >
                {group.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={chip}
                    className="rounded-lg border border-border bg-background/80 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_24px_-12px_rgba(var(--accent-rgb),0.5)]"
                    data-testid={`skill-${skill.toLowerCase().replace(/[\s/]/g, "-")}`}
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* Rationed playfulness */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-6 hidden select-none items-center justify-end gap-3 xl:flex"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
          always scheming better defenses
        </p>
        <img src={steepled} alt="" width={84} height={132} loading="lazy" className="float-slow w-[84px]" />
      </div>
    </section>
  );
}
