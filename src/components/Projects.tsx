import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { SiGithub } from "react-icons/si";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectArtifact, { type ArtifactVariant } from "./artifacts/ProjectArtifact";
import Reveal from "./fx/Reveal";
import Magnetic from "./fx/Magnetic";
import GhostIndex from "./fx/GhostIndex";

const EASE = [0.16, 1, 0.3, 1] as const;

type Project = {
  file: string;
  badge: string;
  title: string;
  description: string;
  metric: string;
  tags: string[];
  github: string;
  variant: ArtifactVariant;
};

const PROJECTS: Project[] = [
  {
    file: "FILE_01",
    badge: "Capstone",
    title: "Decentralized Zero Trust Proxy for MCP",
    description:
      "A zero-trust proxy layer securing inter-agent communication in multi-agent AI systems. Addresses prompt injection, agent authentication, and trust verification with an 8-step cryptographic pipeline.",
    metric: "100% block rate across all tested attack vectors",
    tags: ["python", "fastapi", "docker", "jwt", "mcp"],
    github: "https://github.com/mujii974/DZT-Proxy-for-MCP",
    variant: "mesh",
  },
  {
    file: "FILE_02",
    badge: "Secure Software Dev",
    title: "Hospital Management System",
    description:
      "Desktop application for patient and staff management with role-based access control and secure data handling. Built on OOP principles with strict separation of domain logic, persistence, and UI layers.",
    metric: "RBAC enforced · layered architecture",
    tags: ["java", "javafx", "sqlite", "intellij"],
    github: "https://github.com/mujii974/Hospital-Management-System",
    variant: "wards",
  },
  {
    file: "FILE_03",
    badge: "Cryptography",
    title: "Battleship: CryptoCracks",
    description:
      "Secure multiplayer Battleship with encrypted socket communication. RSA + AES hybrid encryption provides a cryptographically secure channel between players; every shot fired is ciphertext.",
    metric: "RSA + AES hybrid channel · zero plaintext on the wire",
    tags: ["java", "rsa", "aes", "sockets"],
    github: "https://github.com/mujii974/Battleship_CryptoCracks",
    variant: "radar",
  },
];

/* ── A single project card with pointer-tracked 3D tilt ──────────── */
function ProjectCard({
  project,
  index,
  horizontal,
}: {
  project: Project;
  index: number;
  horizontal: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(sy, [0, 1], [5, -5]);
  const rotateY = useTransform(sx, [0, 1], [-6.5, 6.5]);
  const sheen = useTransform(
    [sx, sy],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(var(--accent-rgb),0.12), transparent 45%)`
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1300 }}
      className={horizontal ? "w-[86vw] shrink-0 sm:w-[72vw] lg:w-[62vw] xl:w-[54vw]" : "w-full"}
    >
      <motion.article
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={reset}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "999px 0px -80px 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group/card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lg transition-shadow duration-500 hover:shadow-[0_44px_90px_-28px_rgba(var(--accent-rgb),0.32)]"
        data-testid={`project-panel-${index + 1}`}
      >
        {!reduced && (
          <motion.div
            aria-hidden="true"
            style={{ background: sheen }}
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          />
        )}

        <div className="grid flex-1 grid-cols-1 md:grid-cols-[1.04fr_0.96fr]">
          {/* Copy */}
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
            <div className="mb-7 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {project.file} <span className="text-accent">/</span> {project.badge}
              </span>
              <span
                aria-hidden="true"
                className="text-ghost-outline font-display text-5xl font-extrabold leading-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mb-4 font-display text-[1.7rem] font-bold leading-[1.06] tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h3>

            <p className="mb-5 max-w-[34rem] leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <p className="mb-8 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.06em] text-accent">
              <span className="status-dot shrink-0" />
              {project.metric}
            </p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-5">
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.2}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:text-accent active:scale-[0.97]"
                  data-testid={`btn-source-${index + 1}`}
                >
                  <SiGithub className="h-4 w-4" aria-hidden="true" focusable="false" />
                  View source
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Living artifact */}
          <div className="relative min-h-[240px] border-t border-border bg-gradient-to-br from-transparent to-[rgba(var(--accent-rgb),0.05)] md:border-l md:border-t-0">
            <ProjectArtifact variant={project.variant} className="absolute inset-0" />
            <span className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              live render / {project.variant}
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/* ── Horizontal pinned gallery (desktop) ─────────────────────────── */
function HorizontalGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Measure how far the track must travel so the last card ends flush right.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Section height = one viewport of pin + the horizontal travel distance.
  const sectionHeight = `calc(100dvh + ${distance}px)`;

  return (
    <div ref={sectionRef} style={{ height: sectionHeight }} className="relative">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        {/* Header rail */}
        <div className="relative mx-auto flex w-full max-w-[1400px] items-end justify-between gap-6 px-5 pb-8 sm:px-8">
          <GhostIndex n="01" className="absolute -top-14 right-5 sm:right-8" />
          <div>
            <p className="overline-label mb-3">
              01 <span className="text-accent">/</span> selected work
            </p>
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-bold tracking-tight text-foreground">
              Built, attacked, hardened.
            </h2>
          </div>
          <div className="hidden items-center gap-3 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:flex">
            scroll
            <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" focusable="false" />
          </div>
        </div>

        {/* Moving track */}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-6 px-5 sm:px-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} horizontal />
          ))}
          {/* End cap */}
          <div className="flex w-[42vw] shrink-0 flex-col justify-center lg:w-[30vw]">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              More on GitHub.
            </p>
            <a
              href="https://github.com/mujii974/"
              target="_blank"
              rel="noreferrer"
              className="group mt-4 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
              data-testid="link-more-github"
            >
              github.com/mujii974
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
                focusable="false"
              />
            </a>
          </div>
        </motion.div>

        {/* Progress rail */}
        <div className="mx-auto mt-8 h-px w-full max-w-[1400px] overflow-hidden bg-border px-5 sm:px-8">
          <motion.div style={{ width: progress }} className="h-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

/* ── Vertical fallback (mobile / no measured travel) ─────────────── */
function VerticalStack() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="overline-label mb-3">
              01 <span className="text-accent">/</span> selected work
            </p>
          </Reveal>
          <Reveal delay={0.08} mask>
            <h2 className="font-display text-[clamp(2rem,7vw,2.6rem)] font-bold tracking-tight text-foreground">
              Built, attacked, hardened.
            </h2>
          </Reveal>
        </div>
      </div>
      <div className="grid gap-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} horizontal={false} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="https://github.com/mujii974/"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
        >
          more on github
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
            focusable="false"
          />
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  const isMobile = useIsMobile();
  return (
    <section id="projects" className="relative">
      {isMobile ? <VerticalStack /> : <HorizontalGallery />}
    </section>
  );
}
