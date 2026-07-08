import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, FileText, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Reveal from "./fx/Reveal";
import Magnetic from "./fx/Magnetic";
import GhostIndex from "./fx/GhostIndex";

const CV_URL = "/cv/Mujtaba_Shahid_CV.pdf";

const CERTS = [
  { name: "Pre-Security Certificate", issuer: "TryHackMe", done: true },
  { name: "Firewall Essentials", issuer: "Palo Alto Networks Academy", done: true },
  { name: "Cybersecurity Foundation", issuer: "Palo Alto Networks", done: true },
  { name: "Jr. Penetration Tester (PT1)", issuer: "TryHackMe", done: false },
  { name: "Certified Ethical Hacker v13", issuer: "EC-Council", done: false },
];

export default function Dossier() {
  const qrUrl = typeof window !== "undefined" ? window.location.origin : "https://mujii.dev";
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cardAmp = reduced ? 26 : 90;
  const cardY = useTransform(scrollYProgress, [0, 1], [cardAmp, -cardAmp]);

  return (
    <section id="cv" ref={sectionRef} className="relative border-y border-border bg-card/40">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:py-36">
        <div className="relative mb-14 md:mb-20">
          <GhostIndex n="04" className="absolute -top-6 right-0" />
          <Reveal>
            <p className="overline-label mb-4">
              04 <span className="text-accent">/</span> dossier
            </p>
          </Reveal>
          <Reveal delay={0.08} mask>
            <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold tracking-tight text-foreground">
              Full background, one file.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_400px] lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-10 max-w-[58ch] text-lg leading-relaxed text-muted-foreground">
                Academic record, professional experience, coursework, and
                certifications, compiled into a single PDF for recruiters who
                move fast.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                certifications
              </h3>
              <ul>
                {CERTS.map((cert) => (
                  <li
                    key={cert.name}
                    className="row-line flex items-center justify-between gap-4 py-4 first:border-t-0 hover:border-accent/40"
                  >
                    <span className="flex items-center gap-3.5">
                      {cert.done ? (
                        <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" focusable="false" />
                      ) : (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
                          <span className="status-dot" />
                        </span>
                      )}
                      <span className="sr-only">{cert.done ? "Completed: " : "In progress: "}</span>
                      <span className="text-sm font-medium text-foreground sm:text-base">{cert.name}</span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      {cert.issuer}
                      {!cert.done && <span className="ml-2 text-accent">in progress</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-10 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
                  languages /{" "}
                </span>
                English, Urdu, Hindi (fluent) · Arabic (conversational). Group
                lead on every team-based project; Grade A in Project Management.
              </p>
            </Reveal>
          </div>

          {/* The file — drifts against the cert column while scrolling */}
          <Reveal delay={0.18}>
            <motion.div
              style={{ y: cardY }}
              className="rounded-3xl border border-border bg-card p-7 shadow-lg sm:p-8"
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary">
                    <FileText className="h-5 w-5 text-accent" />
                  </span>
                  <div>
                    <p className="font-mono text-sm text-foreground">Mujtaba_Shahid_CV.pdf</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      updated 2026 · en
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-col gap-3">
                <Magnetic strength={0.15}>
                  <a
                    href={CV_URL}
                    download
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-px active:scale-[0.98]"
                    data-testid="btn-download-pdf"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                </Magnetic>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2.5 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 active:scale-[0.98]"
                      data-testid="btn-fullscreen-pdf"
                    >
                      <Maximize2 className="h-4 w-4 text-accent" />
                      View fullscreen
                    </button>
                  </DialogTrigger>
                  <DialogContent className="h-[90vh] w-[92vw] max-w-5xl p-0">
                    <DialogTitle className="sr-only">CV — fullscreen PDF viewer</DialogTitle>
                    <iframe
                      src={CV_URL}
                      className="h-full w-full rounded-md border-0"
                      title="CV fullscreen"
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-5 border-t border-border pt-7">
                <div className="qr-container relative inline-block shrink-0 overflow-hidden rounded-lg border border-border bg-background p-2.5">
                  <QRCodeSVG
                    value={qrUrl}
                    size={76}
                    fgColor="currentColor"
                    bgColor="transparent"
                    className="text-foreground"
                    title={`QR code linking to ${qrUrl}`}
                  />
                  <div className="qr-scanline" />
                </div>
                <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                  scan to open
                  <br />
                  on your phone
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
