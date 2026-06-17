import { useState, useEffect, useRef } from "react";
import { Sun, Moon, X, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import PillNav from "./PillNav";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "CV", href: "#cv" },
  { label: "Contact", href: "#contact" },
];

function MobileNav({
  activeSection,
  scrollTo,
}: {
  activeSection: string;
  scrollTo: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(href), 50);
  };

  return (
    <>
      {/* Compact top bar — mobile only */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:hidden">
        <span className="text-sm font-bold tracking-widest text-foreground/60 uppercase select-none">
          mujii
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full h-10 w-10 bg-background/80 backdrop-blur border border-border text-muted-foreground hover:text-foreground"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-full h-10 w-10 bg-background/80 backdrop-blur border border-border text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[100] sm:hidden flex flex-col transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "hsl(var(--background))" }}
      >
        {/* Header row inside overlay */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-sm font-bold tracking-widest text-foreground/40 uppercase select-none">
            menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-full h-10 w-10 border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-1 pb-16">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`group w-full text-left py-4 border-b border-border/40 flex items-center justify-between transition-colors duration-150 ${
                  isActive ? "text-foreground" : "text-foreground/40 hover:text-foreground"
                }`}
                style={{
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                  transform: open ? "translateY(0)" : "translateY(12px)",
                  opacity: open ? 1 : 0,
                  transition: `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms, color 0.15s`,
                }}
              >
                <span className="text-4xl font-bold tracking-tight">{link.label}</span>
                <span className="text-xs font-mono text-foreground/30 group-hover:text-foreground/50 transition-colors">
                  0{i + 1}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className="px-8 pb-10 text-xs text-foreground/25 font-mono">
          mujii.dev
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    NAV_LINKS.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile navbar */}
      <MobileNav activeSection={activeSection} scrollTo={scrollTo} />

      {/* Desktop navbar — hidden on mobile */}
      <header
        className={`fixed top-4 z-50 transition-all duration-300 hidden sm:flex items-center justify-center gap-2 left-1/2 -translate-x-1/2 ${
          scrolled ? "max-w-2xl" : "max-w-3xl"
        }`}
        style={{ width: "calc(100% - 2rem)" }}
      >
        <PillNav
          items={NAV_LINKS}
          activeHref={activeSection ? `#${activeSection}` : undefined}
          onItemClick={scrollTo}
          ease="power2.easeOut"
          baseColor="hsl(var(--foreground))"
          pillColor="hsl(var(--background))"
          hoveredPillTextColor="hsl(var(--background))"
          pillTextColor="hsl(var(--foreground))"
          className={scrolled ? "shadow-lg shadow-black/5" : ""}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          data-testid="button-theme-toggle"
          className="text-muted-foreground hover:text-foreground rounded-full h-[42px] w-[42px] bg-background border border-border shadow-sm"
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-accent z-50 transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
        data-testid="scroll-progress"
      />
    </>
  );
}
