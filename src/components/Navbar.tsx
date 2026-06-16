import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
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
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 flex items-center justify-center gap-2 ${
          scrolled ? "max-w-2xl" : "max-w-3xl"
        }`}
      >
        <div className="flex-1 sm:flex-initial min-w-0">
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
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          data-testid="button-theme-toggle"
          className="text-muted-foreground hover:text-foreground rounded-full h-[42px] w-[42px] bg-background border border-border shadow-sm"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <div
        className="fixed top-0 left-0 h-[2px] bg-accent z-50 transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
        data-testid="scroll-progress"
      />
    </>
  );
}
