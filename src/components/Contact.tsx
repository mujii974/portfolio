import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Mail, Phone, ArrowUpRight, ArrowUp } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import Reveal from "./fx/Reveal";
import Magnetic from "./fx/Magnetic";
import { scrollToTarget } from "./fx/SmoothScroll";
import pointing from "@assets/character/pose-pointing.webp";

const EMAIL = "mujtaba.sha19@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Let's work together — Portfolio Inquiry")}`;

const LINKS = [
  { href: MAILTO, icon: Mail, label: EMAIL, meta: "email", external: false },
  { href: "tel:+97455256562", icon: Phone, label: "+974 5525 6562", meta: "phone", external: false },
  { href: "https://github.com/mujii974/", icon: SiGithub, label: "github.com/mujii974", meta: "code", external: true },
  { href: "https://www.linkedin.com/in/mujtaba-shahid/", icon: Linkedin, label: "in/mujtaba-shahid", meta: "network", external: true },
];

// Live Doha clock — ticks once a second, cheap.
function DohaClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Qatar",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
      doha <span className="text-accent">{time}</span> gmt+3
    </span>
  );
}

export default function Contact() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  // Giant wordmark drifts horizontally as the finale scrolls into view.
  const wordmarkX = useTransform(scrollYProgress, [0, 1], reduced ? ["-3%", "1.5%"] : ["-12%", "6%"]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      {/* Giant faint wordmark, seated in the band between the channels and
          the footer (below the LinkedIn row, above the copyright). The
          wrapper handles centering; the span only handles the scroll drift. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[84px] z-0 flex justify-center overflow-hidden"
      >
        <motion.span
          style={{ x: wordmarkX }}
          className="text-ghost-outline select-none whitespace-nowrap font-display text-[clamp(3rem,13vw,10rem)] font-extrabold leading-none tracking-tight opacity-[0.55]"
        >
          MUJII.DEV
        </motion.span>
      </div>

      {/* Main content, vertically centered within the viewport */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pt-24 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_260px]">
          <div>
            <Reveal>
              <p className="overline-label mb-4">
                05 <span className="text-accent">/</span> contact
              </p>
            </Reveal>
            <Reveal delay={0.06} mask>
              <h2 className="max-w-[15ch] font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[1.02] tracking-tight text-foreground">
                Let&rsquo;s build something secure<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Open to opportunities in cybersecurity and secure development,
                Doha or remote. Replies within a day.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Magnetic className="mt-8">
                <a
                  href={MAILTO}
                  className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-foreground shadow-lg transition-transform active:scale-[0.97]"
                  data-testid="btn-email-me"
                >
                  <Mail className="h-5 w-5" />
                  Email me
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* The agent, pointing at the CTA */}
          <Reveal delay={0.18} className="hidden justify-self-center lg:block">
            <img
              src={pointing}
              alt="Illustrated character of Mujtaba pointing toward the contact button"
              width={283}
              height={430}
              loading="lazy"
              className="float-slow w-[210px] -scale-x-100 select-none xl:w-[240px]"
              draggable={false}
            />
          </Reveal>
        </div>

        {/* Channels — compact */}
        <Reveal delay={0.1}>
          <ul className="mt-10 border-t border-border">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="row-line group flex items-center justify-between gap-4 py-3.5 first:border-t-0 hover:border-accent/40"
                  data-testid={`contact-${link.meta}`}
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <link.icon className="h-[18px] w-[18px] shrink-0 text-accent" />
                    <span className="truncate text-sm text-foreground transition-transform duration-300 group-hover:translate-x-1.5 sm:text-base">
                      {link.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {link.meta}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Thin footer bar, same screen */}
      <footer className="relative z-10 mt-auto border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-5 sm:px-8">
          <p className="text-xs text-muted-foreground">
            © 2026 Mujtaba Shahid. Designed &amp; built by hand, no template.
          </p>
          <div className="flex items-center gap-6">
            <DohaClock />
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-accent"
              data-testid="btn-back-top"
            >
              top
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
