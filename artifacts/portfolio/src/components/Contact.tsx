import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Copy, CheckCircle, Mail, Phone } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);
  const email = "mujtaba.sha19@gmail.com";
  const qrUrl = typeof window !== 'undefined' ? window.location.href : 'https://mujii.dev';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-32 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl font-mono font-bold mb-6">
          <span className="text-accent">/</span> get in touch
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12">
          Open to new opportunities in cybersecurity and web development. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="flex flex-col items-center gap-8 mb-16">
          {/* Email row */}
          <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl w-full sm:w-auto shadow-sm">
            <Mail className="w-5 h-5 text-accent shrink-0" />
            <span className="font-mono text-foreground break-all">{email}</span>
            <button 
              onClick={copyEmail}
              className="ml-auto sm:ml-4 p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground relative group"
              data-testid="btn-copy-email"
              aria-label="Copy email"
            >
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm border border-border">
                {copied ? "Copied!" : "Copy"}
              </span>
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500 scale-110 transition-transform" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="tel:+97455256562"
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card hover:border-accent hover:text-accent transition-colors shadow-sm"
              data-testid="link-phone"
            >
              <Phone className="w-5 h-5" />
              <span className="font-mono">+974 5525 6562</span>
            </a>
            
            <a 
              href="https://github.com/mujii974/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card hover:border-accent hover:text-accent transition-colors shadow-sm"
              data-testid="link-github-contact"
            >
              <SiGithub className="w-5 h-5" />
              <span className="font-medium">GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/mujtaba-shahid/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card hover:border-accent hover:text-accent transition-colors shadow-sm"
              data-testid="link-linkedin-contact"
            >
              <Linkedin className="w-5 h-5" />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-mono text-muted-foreground mb-4">Scan to visit portfolio</p>
          <div className="qr-container relative p-4 bg-white rounded-xl border-2 border-accent inline-block overflow-hidden shadow-md">
            <QRCodeSVG value={qrUrl} size={120} fgColor="#000000" bgColor="transparent" />
            <div className="qr-scanline" />
          </div>
        </div>
      </motion.div>
      
      <div className="mt-32 text-center pt-8 border-t border-border">
        <p className="text-sm font-mono text-muted-foreground">
          Designed & Built by Mujtaba Shahid
        </p>
      </div>
    </section>
  );
}
