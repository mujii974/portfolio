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

function TimelineNode({ item, index, inView }: { item: typeof WORK[0] | typeof EDUCATION[0]; index: number; inView: boolean }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="relative pl-10 pb-10 last:pb-0"
    >
      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />

      <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5 text-accent shrink-0" />
          <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 text-sm text-muted-foreground">
          <span>{"company" in item ? item.company : item.institution}</span>
          <span className="text-accent shrink-0 font-mono text-xs uppercase tracking-wider">{item.period}</span>
        </div>
        {item.points.length > 0 && (
          <ul className="space-y-2 text-muted-foreground text-sm">
            {item.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-accent mt-1.5">—</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function TimelineSection({
  title,
  items,
  offset = 0,
  inView
}: {
  title: string;
  items: typeof WORK | typeof EDUCATION;
  offset?: number;
  inView: boolean;
}) {
  return (
    <div className="mb-16 last:mb-0">
      <h3 className="text-xl font-semibold mb-8 text-muted-foreground">
        {title}
      </h3>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        {items.map((item, i) => (
          <TimelineNode key={i} item={item as typeof WORK[0]} index={i + offset} inView={inView} />
        ))}
      </div>
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
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Experience & Education
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          The path so far.
        </h2>
      </motion.div>

      <TimelineSection title="Experience" items={WORK} inView={inView} />
      <TimelineSection title="Education" items={EDUCATION} offset={WORK.length} inView={inView} />
    </section>
  );
}
