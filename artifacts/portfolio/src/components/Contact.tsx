import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Copy, CheckCircle, Mail, Phone, Send, Loader2 } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const email = "mujtaba.sha19@gmail.com";
  const qrUrl = typeof window !== "undefined" ? window.location.href : "https://mujii.dev";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      setSubmitStatus("success");
      reset();
    } catch (err) {
      setSubmitStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="py-32 container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-14">
          <p className="text-sm font-mono uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Let's work together.
          </h2>
          <p className="text-lg text-muted-foreground">
            Open to opportunities in cybersecurity and secure development. Based in Doha, Qatar.
          </p>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 bg-card border border-border rounded-2xl p-6 sm:p-8 text-left"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                {...register("name", { required: "Name is required." })}
                className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address.",
                  },
                })}
                className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label htmlFor="message" className="text-sm text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="What's on your mind?"
              {...register("message", { required: "Message is required." })}
              className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition resize-none"
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          {/* Inline feedback */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mb-4"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              Message sent! I'll get back to you soon.
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-4"
            >
              {errorMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitStatus === "loading"}
            data-testid="btn-send-message"
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send message
              </>
            )}
          </button>
        </motion.form>

        {/* Contact links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl">
            <Mail className="w-5 h-5 text-accent shrink-0" />
            <span className="text-foreground break-all">{email}</span>
            <button
              onClick={copyEmail}
              className="ml-auto p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground relative group"
              data-testid="btn-copy-email"
              aria-label="Copy email"
            >
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border">
                {copied ? "Copied!" : "Copy"}
              </span>
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <a
            href="tel:+97455256562"
            className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl hover:border-accent/50 transition-colors"
            data-testid="link-phone"
          >
            <Phone className="w-5 h-5 text-accent shrink-0" />
            <span className="text-foreground">+974 5525 6562</span>
          </a>

          <a
            href="https://github.com/mujii974/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl hover:border-accent/50 transition-colors"
            data-testid="link-github-contact"
          >
            <SiGithub className="w-5 h-5 text-accent shrink-0" />
            <span className="text-foreground">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/mujtaba-shahid/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl hover:border-accent/50 transition-colors"
            data-testid="link-linkedin-contact"
          >
            <Linkedin className="w-5 h-5 text-accent shrink-0" />
            <span className="text-foreground">LinkedIn</span>
          </a>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-4">Scan to visit portfolio</p>
          <div className="qr-container relative p-4 bg-card rounded-xl border border-border inline-block overflow-hidden">
            <QRCodeSVG value={qrUrl} size={120} fgColor="#e8e6e3" bgColor="transparent" />
            <div className="qr-scanline" />
          </div>
        </div>
      </motion.div>

      <div className="mt-32 text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Designed & Built by Mujtaba Shahid
        </p>
      </div>
    </section>
  );
}
