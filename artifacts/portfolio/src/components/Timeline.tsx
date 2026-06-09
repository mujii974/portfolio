import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const WORK = [
  {
    title: "Web Developer & Designer (Intern)",
    company: "NOVERA.DEV · Doha, Qatar",
    period: "May 2025 – Jan 2026",
    points: [
      "Built and launched two Shopify storefronts end-to-end",
      "Shipped responsive frontend work on internal portfolio sites (LIKO, Rivor)",
      "WordPress + Elementor + WooCommerce; Git, CI/CD basics"
    ],
    icon: Briefcase
  },
  {
    title: "Event Operations Coordinator (Freelance)",
    company: "The Planners W.L.L. — FIFA World Cup 2022",
    period: "Nov – Dec 2022",
    points: [
      "On-site logistics across stadium zones during matchdays",
      "Coordinated VIP protocols, media access, and transport routing",
      "Held comms between event control, hospitality, and venue security"
    ],
    icon: Briefcase
  },
  {
    title: "Customer Service Agent, Airport Services",
    company: "Qatar Airways",
    period: "Oct 2021 – Jan 2022",
    points: [
      "Flight bookings, reschedules, special requests on Amadeus ticketing system",
      "Gate operations and distressed passenger support; outstanding feedback"
    ],
    icon: Briefcase
  }
];

const EDUCATION = [
  {
    title: "BSc, Data and Cybersecurity",
    institution: "University of Doha for Science and Technology (UDST)",
    period: "Jan 2022 – May 2026",
    points: [
      "Five-person research team on LLM and agentic AI security under a PhD supervisor",
      "Grade A in Project Management; group lead across all team projects"
    ],
    icon: GraduationCap
  },
  {
    title: "High School Diploma",
    institution: "Ideal Indian School, Doha, Qatar",
    period: "Graduated Mar 2018",
    points: [],
    icon: GraduationCap
  }
];

function TimelineNode({ item, isLeft }: { item: any, isLeft: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = item.icon;

  return (
    <div ref={ref} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group w-full mb-12 last:mb-0">
      
      {/* Center line dot */}
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />
      
      {/* Content box */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -30 : 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-card border border-border ml-auto md:ml-0"
      >
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold">{item.title}</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-sm font-mono text-muted-foreground">
          <span>{item.company || item.institution}</span>
          <span className="text-accent/80">{item.period}</span>
        </div>
        {item.points.length > 0 && (
          <ul className="space-y-2 text-muted-foreground">
            {item.points.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent mt-1 opacity-50">•</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-mono font-bold mb-16">
          <span className="text-accent">/</span> experience &amp; education
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-border" />
          
          <div className="mb-16">
            <h3 className="text-2xl font-mono font-semibold mb-8 pl-8 md:pl-0 md:text-center text-muted-foreground">Experience</h3>
            {WORK.map((item, i) => (
              <TimelineNode key={i} item={item} isLeft={i % 2 === 0} />
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-mono font-semibold mb-8 pl-8 md:pl-0 md:text-center text-muted-foreground">Education</h3>
            {EDUCATION.map((item, i) => (
              <TimelineNode key={i} item={item} isLeft={i % 2 === 0} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
