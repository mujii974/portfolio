import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

function ResumeContent() {
  return (
    <div className="bg-card text-card-foreground p-8 md:p-12 rounded-xl border border-border font-sans max-w-4xl mx-auto shadow-sm">
      {/* Header */}
      <div className="text-center mb-8 border-b border-border pb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">MUJTABA SHAHID</h1>
        <p className="text-lg text-accent font-medium mb-3">Cybersecurity · Penetration Testing · Secure Software Development</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-mono">
          <span>Doha, Qatar</span>
          <span>|</span>
          <span>+974 5525 6562</span>
          <span>|</span>
          <span>mujtaba.sha19@gmail.com</span>
          <span>|</span>
          <a href="https://www.linkedin.com/in/mujtaba-shahid/" className="hover:text-accent transition-colors">linkedin</a>
          <span>|</span>
          <a href="https://github.com/mujii974/" className="hover:text-accent transition-colors">github</a>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-3 uppercase tracking-wider">Summary</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Data and Cybersecurity graduate from UDST. Hands-on experience in penetration testing, IoT and OT security, secure software development, and security monitoring. Built through university labs, a capstone on zero-trust architecture for multi-agent AI systems, and self-directed certification work. Currently completing CEH v13.
        </p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider">Experience</h2>
        
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold">Web Developer & Designer (Intern)</h3>
            <span className="text-sm font-mono text-muted-foreground">May 2025 – Jan 2026</span>
          </div>
          <p className="text-sm italic text-muted-foreground mb-2">NOVERA.DEV · Doha, Qatar</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 marker:text-accent">
            <li>Built and launched two Shopify storefronts end-to-end</li>
            <li>Shipped responsive frontend work on internal portfolio sites (LIKO, Rivor)</li>
            <li>WordPress + Elementor + WooCommerce; Git, CI/CD basics</li>
          </ul>
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold">Event Operations Coordinator (Freelance)</h3>
            <span className="text-sm font-mono text-muted-foreground">Nov – Dec 2022</span>
          </div>
          <p className="text-sm italic text-muted-foreground mb-2">The Planners W.L.L. — FIFA World Cup 2022</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 marker:text-accent">
            <li>On-site logistics across stadium zones during matchdays</li>
            <li>Coordinated VIP protocols, media access, and transport routing</li>
            <li>Held comms between event control, hospitality, and venue security</li>
          </ul>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold">Customer Service Agent, Airport Services</h3>
            <span className="text-sm font-mono text-muted-foreground">Oct 2021 – Jan 2022</span>
          </div>
          <p className="text-sm italic text-muted-foreground mb-2">Qatar Airways</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 marker:text-accent">
            <li>Flight bookings, reschedules, special requests on Amadeus ticketing system</li>
            <li>Gate operations and distressed passenger support; outstanding feedback</li>
          </ul>
        </div>
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider">Projects</h2>
        
        <div className="mb-4">
          <h3 className="font-bold">Decentralized Zero Trust Proxy for MCP <span className="font-normal italic text-muted-foreground text-sm ml-2">(Python, FastAPI, Docker, JWT)</span></h3>
          <p className="text-sm text-muted-foreground mt-1">Built a zero-trust proxy layer securing inter-agent communication in multi-agent AI systems. Addressed prompt injection, agent authentication, and trust verification with an 8-step cryptographic pipeline — 100% block rate across all tested attack vectors.</p>
        </div>

        <div>
          <h3 className="font-bold">Hospital Management System <span className="font-normal italic text-muted-foreground text-sm ml-2">(Java, JavaFX, SQLite)</span></h3>
          <p className="text-sm text-muted-foreground mt-1">Desktop application for patient and staff management with role-based access control and secure data handling. Built on OOP principles with strict separation of domain logic, persistence, and UI layers.</p>
        </div>
      </div>

      {/* Coursework */}
      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-3 uppercase tracking-wider">Coursework Highlights</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 marker:text-accent">
          <li><span className="font-semibold text-foreground">Penetration Testing:</span> Full-cycle labs, Metasploit/Burp Suite/Nmap, AD attack paths</li>
          <li><span className="font-semibold text-foreground">IoT & OT Security:</span> Attacked/hardened Flask IoT app on Raspberry Pi, firmware analysis</li>
          <li><span className="font-semibold text-foreground">Secure Software Development:</span> STRIDE/PASTA/DREAD, AES/RSA/JWT/TLS, SAST/DAST</li>
          <li><span className="font-semibold text-foreground">Incident Response:</span> Splunk SIEM, MITRE ATT&CK, YARA, Sigma rules</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Certifications */}
        <div>
          <h2 className="text-xl font-bold border-b border-border pb-2 mb-3 uppercase tracking-wider">Certifications</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Pre-Security Certificate — TryHackMe</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Firewall Essentials — Palo Alto Networks Academy</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Cybersecurity Foundation Student Certificate — Palo Alto Networks</li>
            <li className="flex items-start gap-2"><span className="text-accent font-bold">⟳</span> Jr. Penetration Tester (PT1) — TryHackMe (in progress)</li>
            <li className="flex items-start gap-2"><span className="text-accent font-bold">⟳</span> Certified Ethical Hacker (CEH) v13 — EC-Council (in progress)</li>
          </ul>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-bold border-b border-border pb-2 mb-3 uppercase tracking-wider">Education</h2>
          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-sm">BSc, Data and Cybersecurity</h3>
              <span className="text-xs font-mono text-muted-foreground">2022 – 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">University of Doha for Science and Technology</p>
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-sm">High School Diploma</h3>
              <span className="text-xs font-mono text-muted-foreground">Mar 2018</span>
            </div>
            <p className="text-sm text-muted-foreground">Ideal Indian School, Doha</p>
          </div>
        </div>
      </div>
      
      {/* Leadership */}
      <div>
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-3 uppercase tracking-wider">Leadership & Languages</h2>
        <p className="text-sm text-muted-foreground">Group lead on every team-based project; A in Project Management; fluent in English, Urdu, Hindi, conversational Arabic.</p>
      </div>
    </div>
  );
}

export default function CV() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const qrUrl = typeof window !== 'undefined' ? window.location.href : 'https://mujii.dev';

  return (
    <section id="cv" className="py-24 bg-muted/30" ref={ref}>
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Curriculum Vitae
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Full background.
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A comprehensive overview of academic background, professional experience, and technical certifications.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block qr-container relative p-2 bg-card rounded-lg border border-border shrink-0 overflow-hidden">
              <QRCodeSVG value={qrUrl} size={64} fgColor="hsl(var(--foreground))" bgColor="transparent" />
              <div className="qr-scanline" />
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="gap-2 w-full sm:w-auto" data-testid="btn-download-pdf">
                <a href="/cv/Mujtaba_Shahid_CV.pdf" download>
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="btn-fullscreen-pdf">
                    <Maximize2 className="w-4 h-4" />
                    Open Fullscreen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0">
                  <iframe 
                    src="/cv/Mujtaba_Shahid_CV.pdf" 
                    className="w-full h-full rounded-md border-0"
                    title="CV Fullscreen"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="resume" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="resume" data-testid="tab-view-resume">View Resume</TabsTrigger>
              <TabsTrigger value="pdf" data-testid="tab-view-pdf">View PDF</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="resume" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <ResumeContent />
          </TabsContent>
          
          <TabsContent value="pdf" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <div className="w-full max-w-4xl mx-auto aspect-[1/1.4] sm:aspect-auto sm:h-[800px] rounded-xl overflow-hidden border border-border shadow-sm bg-card flex items-center justify-center relative">
              <iframe 
                src="/cv/Mujtaba_Shahid_CV.pdf#toolbar=0" 
                className="w-full h-full border-0 absolute inset-0"
                title="CV PDF Viewer"
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}
