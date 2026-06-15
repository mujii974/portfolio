import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import AsciiArt from "./AsciiArt";
import GrainBackground from "./GrainBackground";

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-16 overflow-hidden"
    >
      <GrainBackground />

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1 flex justify-center lg:justify-end"
        >
          <AsciiArt />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Cybersecurity · Secure Development · Web
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold text-foreground mb-6 tracking-tight leading-[1.05]">
            Mujtaba Shahid
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
            I design and build secure systems. Currently completing CEH v13 in Doha, Qatar.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
              onClick={() => scrollTo("#projects")}
              data-testid="btn-view-work"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-border text-foreground hover:bg-muted hover:text-foreground"
              data-testid="btn-download-cv"
            >
              <a href="/cv/Mujtaba_Shahid_CV.pdf" download>
                Download CV
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/mujii974/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              data-testid="link-github-hero"
            >
              <SiGithub className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mujtaba-shahid/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              data-testid="link-linkedin-hero"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
