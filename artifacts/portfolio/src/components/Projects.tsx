import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const PROJECTS = [
  {
    title: "Decentralized Zero Trust Proxy for MCP",
    badge: "Capstone Project",
    tags: ["Python", "FastAPI", "Docker", "JWT", "MCP"],
    description: "A zero-trust proxy layer securing inter-agent communication in multi-agent AI systems. Addressed prompt injection, agent authentication, and trust verification with an 8-step cryptographic pipeline — 100% block rate across all tested attack vectors.",
    github: "https://github.com/mujii974/DZT-Proxy-for-MCP"
  },
  {
    title: "Hospital Management System",
    badge: "Secure Software Dev",
    tags: ["Java", "JavaFX", "SQLite", "IntelliJ"],
    description: "Desktop application for patient and staff management with role-based access control and secure data handling. Built on OOP principles with strict separation of domain logic, persistence, and UI layers.",
    github: "https://github.com/mujii974/Hospital-Management-System"
  },
  {
    title: "Battleship — CryptoCracks",
    badge: "Cryptography",
    tags: ["Java", "RSA", "AES", "Sockets"],
    description: "Secure multiplayer Battleship game with encrypted socket communication. RSA + AES hybrid encryption provides a cryptographically secure channel between players.",
    github: "https://github.com/mujii974/Battleship_CryptoCracks"
  }
];

function ProjectCard({
  project,
  featured = false,
  index,
  inView
}: {
  project: typeof PROJECTS[0];
  featured?: boolean;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`group flex flex-col bg-card border border-border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-accent/50 hover:bg-muted/30 ${
        featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
        <Badge variant="outline" className="w-fit text-accent border-accent/30 bg-accent/5">
          {project.badge}
        </Badge>
      </div>

      <h3 className={`font-semibold text-foreground mb-4 group-hover:text-accent transition-colors ${
        featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
      }`}>
        {project.title}
      </h3>

      <p className="text-muted-foreground leading-relaxed flex-grow mb-8">
        {project.description}
      </p>

      <div className="mt-auto">
        <Button
          variant="secondary"
          asChild
          className="w-full sm:w-auto gap-2 group/btn bg-secondary hover:bg-muted border border-border"
          data-testid={`btn-github-${project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
        >
          <a href={project.github} target="_blank" rel="noreferrer">
            <SiGithub className="w-4 h-4" />
            View Source
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </a>
        </Button>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Selected Work
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Projects that show the craft.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={i}
            project={project}
            featured={i === 0}
            index={i}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}
