import { Router, type IRouter } from "express";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import { logger } from "../lib/logger";
import { db, contactMessagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

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

  // Persist to database first so the message is never lost, even if email fails
  try {
    await db.insert(contactMessagesTable).values({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  } catch (dbError) {
    logger.error({ dbError }, "Failed to persist contact message to database");
    res.status(500).json({ error: "Failed to send message. Please try again." });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    // Message is already saved — still respond with success so the user isn't alarmed
    logger.warn("RESEND_API_KEY not set; contact message saved to DB but email not sent");
    res.json({ success: true });
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
    // Message is already safely stored in DB — log the email failure but still return success
    logger.error({ resendError: error }, "Resend email failed (message already saved to DB)");
  }

  res.json({ success: true });
});

// Admin endpoint — list all contact submissions, newest first
// Requires a valid Bearer token matching the ADMIN_API_KEY environment variable
router.get("/admin/contact-messages", async (req, res) => {
  const adminKey = process.env["ADMIN_API_KEY"];
  if (!adminKey) {
    logger.error("ADMIN_API_KEY is not set; admin endpoint is disabled");
    res.status(503).json({ error: "Admin access is not configured." });
    return;
  }

  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || token !== adminKey) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  try {
    const messages = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));
    logger.info({ count: messages.length }, "Admin fetched contact messages");
    res.json({ messages });
  } catch (dbError) {
    logger.error({ dbError }, "Failed to fetch contact messages");
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
});

export default router;
