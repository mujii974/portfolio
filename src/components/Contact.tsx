import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const EMAIL = "mujtaba.sha19@gmail.com";
const MAILTO_SUBJECT = encodeURIComponent("Let's work together — Portfolio Inquiry");

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const qrUrl =
    typeof window !== "undefined" ? window.location.href : "https://mujii.dev";

  const links = [
    {
      href: `mailto:${EMAIL}?subject=${MAILTO_SUBJECT}`,
      icon: Mail,
      label: EMAIL,
      aria: "Send email",
      external: false,
    },
    {
      href: "tel:+97455256562",
      icon: Phone,
      label: "+974 5525 6562",
      aria: "Call phone",
      external: false,
    },
    {
      href: "https://github.com/mujii974/",
      icon: SiGithub,
      label: "GitHub",
      aria: "GitHub profile",
      external: true,
    },
    {
      href: "https://www.linkedin.com/in/mujtaba-shahid/",
      icon: Linkedin,
      label: "LinkedIn",
      aria: "LinkedIn profile",
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-32 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-14">
          <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Let&rsquo;s work together.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Open to opportunities in cybersecurity and secure development.
            Based in Doha, Qatar.
          </p>
        </div>

        <a
          href={`mailto:${EMAIL}?subject=${MAILTO_SUBJECT}`}
          className="group flex items-center justify-center gap-3 w-full px-8 py-4 bg-accent text-accent-foreground rounded-xl text-base font-medium hover:bg-accent/90 transition-colors mb-10"
          data-testid="btn-email-me"
        >
          <Mail className="w-5 h-5" />
          Email me
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              aria-label={link.aria}
              className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl hover:border-accent/40 transition-colors group"
            >
              <link.icon className="w-5 h-5 text-accent shrink-0" />
              <span className="text-foreground text-sm truncate">{link.label}</span>
              {link.external && (
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-4">
            Scan to visit portfolio
          </p>
          <div className="qr-container relative p-4 bg-card rounded-xl border border-border inline-block overflow-hidden">
            <QRCodeSVG
              value={qrUrl}
              size={120}
              fgColor="hsl(var(--foreground))"
              bgColor="transparent"
            />
            <div className="qr-scanline" />
          </div>
        </div>
      </motion.div>

      <div className="mt-32 text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Designed &amp; Built by Mujtaba Shahid
        </p>
      </div>
    </section>
  );
}