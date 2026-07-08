import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { scrollToTarget } from "./fx/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINKS = [
  { num: "00", label: "Profile", href: "#about" },
  { num: "01", label: "Work", href: "#projects" },
  { num: "02", label: "Trajectory", href: "#experience" },
  { num: "03", label: "Arsenal", href: "#skills" },
  { num: "04", label: "Dossier", href: "#cv" },
  { num: "05", label: "Contact", href: "#contact" },
];

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur transition-colors hover:text-foreground active:scale-95 ${className ?? ""}`}
      data-testid="button-theme-toggle"
    >
      <motion.span
        key={dark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex"
      >
        {dark ? (
          <Sun className="h-4 w-4" aria-hidden="true" focusable="false" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" focusable="false" />
        )}
      </motion.span>
    </button>
  );
}

export default function SiteNav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Cache document height (a layout read) on resize only; the scroll
    // handler itself just reads scrollY, so it never forces a reflow.
    let total = 0;
    const measure = () => {
      total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    };
    measure();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 32);
        setProgress(total > 0 ? window.scrollY / total : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) scrollToTarget(el, -80);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>

      {/* Scroll progress hairline */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-[2px] bg-accent"
        style={{ width: `${progress * 100}%` }}
        data-testid="scroll-progress"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? "border-b border-border bg-background/75 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex items-baseline gap-0.5 font-display text-lg font-extrabold tracking-tight"
            aria-label="Back to top"
            data-testid="link-logo"
          >
            <span>mujii</span>
            <span className="text-accent transition-transform duration-300 group-hover:rotate-12">.</span>
            <span className="text-muted-foreground">dev</span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const isActive = active === l.href;
              return (
                <button
                  key={l.href}
                  type="button"
                  onClick={() => go(l.href)}
                  className={`relative rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${l.label.toLowerCase()}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border border-border bg-card"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    <span className="mr-1 text-accent">{isActive ? "▸" : ""}</span>
                    {l.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="mailto:mujtaba.sha19@gmail.com?subject=Let%27s%20work%20together"
              className="group hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-background transition-transform hover:-translate-y-px active:scale-[0.97] sm:flex"
              data-testid="nav-hire"
            >
              Hire me
              <ArrowUpRight
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
                focusable="false"
              />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-border bg-card/70 backdrop-blur lg:hidden"
              data-testid="button-menu-open"
            >
              <span className="h-px w-4 bg-foreground" />
              <span className="h-px w-4 bg-foreground" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[90] flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 items-center justify-between px-5 sm:px-8">
              <span className="font-display text-lg font-extrabold tracking-tight">
                mujii<span className="text-accent">.</span>
                <span className="text-muted-foreground">dev</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                data-testid="button-menu-close"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-foreground" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-foreground" />
                </span>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.055, duration: 0.5, ease: EASE }}
                  onClick={() => go(l.href)}
                  className="group flex items-baseline gap-4 py-2.5 text-left"
                  data-testid={`menu-${l.label.toLowerCase()}`}
                >
                  <span className="font-mono text-xs text-accent">{l.num}</span>
                  <span className="font-display text-4xl font-bold tracking-tight text-foreground transition-transform duration-300 group-active:translate-x-2">
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="border-t border-border px-8 py-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                doha, qatar / open to work
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
