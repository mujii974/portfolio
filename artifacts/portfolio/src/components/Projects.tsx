import { useRef, MouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const PROJECTS = [
  {
    title: "Decentralized Zero Trust Proxy for MCP",
    badge: "Capstone Project",
    tags: ["Python", "FastAPI", "Docker", "JWT", "MCP"],
    description: "Built a zero-trust proxy layer securing inter-agent communication in multi-agent AI systems. Addressed prompt injection, agent authentication, and trust verification with an 8-step cryptographic pipeline — 100% block rate across all tested attack vectors.",
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

function TiltCard({ project }: { project: typeof PROJECTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
      className="h-full"
    >
      <div 
        ref={cardRef}
        className="h-full p-6 sm:p-8 rounded-2xl bg-card border border-border transition-all duration-200 ease-out hover:shadow-lg hover:shadow-accent/10 flex flex-col group relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Badge variant="outline" className="w-fit text-accent border-accent/30 bg-accent/5">
            {project.badge}
          </Badge>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed flex-grow mb-8">
          {project.description}
        </p>

        <div className="mt-auto">
          <Button variant="secondary" asChild className="w-full sm:w-auto gap-2 group/btn" data-testid={`btn-github-${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
            <a href={project.github} target="_blank" rel="noreferrer">
              <SiGithub className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              View Source
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
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
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-mono font-bold mb-12">
          <span className="text-accent">/</span> selected projects
        </h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {PROJECTS.map((project, i) => (
            <TiltCard key={i} project={project} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
