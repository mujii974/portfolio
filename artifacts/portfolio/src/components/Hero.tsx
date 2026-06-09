import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import AsciiArt from "./AsciiArt";
import ParticleBackground from "./ParticleBackground";

const ROLES = [
  "Cybersecurity Engineer",
  "Penetration Tester",
  "Secure Software Developer",
  "Web Developer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length - 1));
        }, 50); // delete speed
      }
    } else {
      if (displayText.length === currentRole.length) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500); // pause at full text
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length + 1));
        }, 100); // type speed
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-16 overflow-hidden"
    >
      <ParticleBackground />

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1 flex justify-center lg:justify-end"
        >
          <AsciiArt />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Hi, I'm
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-accent mb-4 tracking-tight">
            Mujii.
          </h1>
          
          <div className="h-10 md:h-12 flex items-center mb-6">
            <span className="text-xl md:text-3xl font-mono text-foreground">
              {displayText}
              <span className="animate-pulse inline-block ml-1 w-3 md:w-4 h-6 md:h-8 bg-accent align-middle" />
            </span>
          </div>

          <p className="text-lg font-mono text-muted-foreground mb-8">
            Based in Doha, Qatar
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => scrollTo("#projects")}
              data-testid="btn-view-work"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary/10"
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
              <SiGithub className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mujtaba-shahid/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              data-testid="link-linkedin-hero"
            >
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
