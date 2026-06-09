import { Router, type IRouter } from "express";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Stricter rate limit for the contact endpoint — 5 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please wait before trying again." },
});

/** Escape HTML special characters to prevent injection in email HTML */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  if (name.length > 100) {
    res.status(400).json({ error: "Name must be under 100 characters." });
    return;
  }
  if (email.length > 254) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }
  if (message.length > 5000) {
    res.status(400).json({ error: "Message must be under 5,000 characters." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    res.status(503).json({ error: "Email service is not configured. Please try again later." });
    return;
  }

  const recipient = process.env["CONTACT_RECIPIENT_EMAIL"] ?? "mujtaba.sha19@gmail.com";
  const fromAddress = process.env["RESEND_FROM_EMAIL"] ?? "Portfolio Contact <onboarding@resend.dev>";

  // Escape all user-supplied values before injecting into HTML
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: recipient,
    replyTo: email.trim(),
    subject: `Portfolio message from ${safeName}`,
    html: `
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  if (error) {
    logger.error({ resendError: error }, "Resend email failed");
    res.status(500).json({ error: "Failed to send message. Please try again." });
    return;
  }

  res.json({ success: true });
});

export default router;
