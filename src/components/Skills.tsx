import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SKILL_GROUPS = [
  {
    title: "Security (Hands-on)",
    skills: ["Metasploit", "MSFvenom", "Burp Suite", "Nmap", "Wireshark", "Tcpdump", "Nessus", "OpenVAS", "Aircrack-ng", "Splunk"]
  },
  {
    title: "Security (Studied)",
    skills: ["BloodHound", "Mimikatz", "Impacket", "Hydra", "Hashcat", "SQLmap", "Snort", "Suricata"]
  },
  {
    title: "Languages",
    skills: ["Python", "Java", "Bash", "SQL", "PowerShell", "JavaScript", "HTML/CSS", "YAML"]
  },
  {
    title: "Frameworks",
    skills: ["MITRE ATT&CK", "NIST CSF", "OWASP Top 10", "Zero Trust", "STRIDE", "PASTA", "ISO 27001"]
  },
  {
    title: "Dev & Lab",
    skills: ["Git", "Docker", "VS Code", "IntelliJ IDEA", "VMware", "VirtualBox", "Kali Linux", "Ubuntu"]
  },
  {
    title: "IoT / OT",
    skills: ["Raspberry Pi", "Binwalk", "MQTT", "Arduino", "ESP32", "Zigbee"]
  },
  {
    title: "Web Dev",
    skills: ["Shopify", "WordPress", "Elementor", "WooCommerce", "Node.js"]
  }
];

function SkillGroup({
  group,
  index,
  inView
}: {
  group: typeof SKILL_GROUPS[0];
  index: number;
  inView: boolean;
}) {
  const ref = useRef(null);
  const chipsInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="flex flex-col h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-accent/40 hover:bg-muted/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h3 className="text-lg font-semibold">{group.title}</h3>
      </div>

      <motion.div
        ref={ref}
        className="flex flex-wrap gap-2 mt-auto"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 }
          }
        }}
        initial="hidden"
        animate={chipsInView ? "visible" : "hidden"}
      >
        {group.skills.map((skill) => (
          <motion.span
            key={skill}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 }
            }}
            className="px-3 py-1 text-sm rounded-md bg-secondary text-secondary-foreground border border-border transition-colors hover:border-accent/40"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Technical Arsenal
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Tools I work with.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_GROUPS.map((group, i) => (
          <SkillGroup key={group.title} group={group} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}
