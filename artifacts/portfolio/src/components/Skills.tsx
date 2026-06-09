import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SKILL_GROUPS = [
  {
    title: "Security (Hands-on)",
    color: "bg-red-500",
    skills: ["Metasploit", "MSFvenom", "Burp Suite", "Nmap", "Wireshark", "Tcpdump", "Nessus", "OpenVAS", "Aircrack-ng", "Splunk"]
  },
  {
    title: "Security (Studied)",
    color: "bg-yellow-500",
    skills: ["BloodHound", "Mimikatz", "Impacket", "Hydra", "Hashcat", "SQLmap", "Snort", "Suricata"]
  },
  {
    title: "Languages",
    color: "bg-blue-500",
    skills: ["Python", "Java", "Bash", "SQL", "PowerShell", "JavaScript", "HTML/CSS", "YAML"]
  },
  {
    title: "Frameworks",
    color: "bg-green-500",
    skills: ["MITRE ATT&CK", "NIST CSF", "OWASP Top 10", "Zero Trust", "STRIDE", "PASTA", "ISO 27001"]
  },
  {
    title: "Dev & Lab",
    color: "bg-zinc-500",
    skills: ["Git", "Docker", "VS Code", "IntelliJ IDEA", "VMware", "VirtualBox", "Kali Linux", "Ubuntu"]
  },
  {
    title: "IoT / OT",
    color: "bg-purple-500",
    skills: ["Raspberry Pi", "Binwalk", "MQTT", "Arduino", "ESP32", "Zigbee"]
  },
  {
    title: "Web Dev",
    color: "bg-indigo-500",
    skills: ["Shopify", "WordPress", "Elementor", "WooCommerce", "Node.js"]
  }
];

function SkillGroup({ group }: { group: typeof SKILL_GROUPS[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl p-6 relative overflow-hidden group hover:border-accent transition-colors">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${group.color} opacity-70`} />
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-3 h-3 rounded-full ${group.color}`} />
        <h3 className="text-lg font-bold font-mono">{group.title}</h3>
      </div>

      <motion.div 
        ref={ref}
        className="flex flex-wrap gap-2 mt-auto"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {group.skills.map(skill => (
          <motion.span
            key={skill}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="px-3 py-1 text-sm rounded bg-secondary/50 text-secondary-foreground border border-transparent group-hover:border-border transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
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
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-mono font-bold mb-12">
          <span className="text-accent">/</span> technical arsenal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_GROUPS.map(group => (
            <SkillGroup key={group.title} group={group} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
