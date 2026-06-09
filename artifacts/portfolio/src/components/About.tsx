import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const SKILLS = [
  "Python", "Java", "Bash", "SQL", "JavaScript", "HTML/CSS",
  "Metasploit", "Burp Suite", "Nmap", "Wireshark", "Splunk",
  "Docker", "Git", "MITRE ATT&CK", "OWASP Top 10", "Zero Trust",
  "Kali Linux", "STRIDE", "Nessus", "Aircrack-ng", "PowerShell",
  "VMware", "AWS"
];

type Stat = {
  value: string | number;
  suffix: string;
  label: string;
  isString: boolean;
};

const STATS: Stat[] = [
  { value: "BSc", suffix: "", label: "Data & Cybersecurity", isString: true },
  { value: "CEH v13", suffix: "", label: "In Progress", isString: true },
  { value: "Doha", suffix: "", label: "Qatar", isString: true },
  { value: "2026", suffix: "", label: "Graduate", isString: true },
];

function StatCard({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || stat.isString || typeof stat.value !== "number") return;
    const target = stat.value;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, stat]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 border border-border rounded-2xl bg-card hover:border-accent transition-colors">
      <span className="text-3xl font-bold text-foreground font-mono">
        {stat.isString ? stat.value : count}{stat.suffix}
      </span>
      <span className="text-sm text-muted-foreground mt-2 text-center">{stat.label}</span>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-mono font-bold mb-12">
          <span className="text-accent">/</span> about me
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Data &amp; Cybersecurity graduate from UDST, Doha. I'm drawn to the intersection of offensive security and secure system design — from pentesting isolated networks to architecting zero-trust layers for AI systems. Outside the lab, I've shipped real products at agencies and worked live events under pressure. Currently completing CEH v13.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>
          </div>

          <motion.div
            className="flex flex-wrap gap-3"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {SKILLS.map((skill) => (
              <motion.span
                key={skill}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="px-4 py-2 text-sm font-medium rounded-full border border-accent/30 bg-accent/5 text-foreground hover:bg-accent/10 hover:border-accent transition-colors"
                data-testid={`skill-pill-${skill.toLowerCase().replace(/[\s/]/g, "-")}`}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
