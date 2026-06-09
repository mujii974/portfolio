import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    res
      .status(503)
      .json({ error: "Email service is not configured. Please try again later." });
    return;
  }

  const recipient = process.env["CONTACT_RECIPIENT_EMAIL"] ?? "mujtaba.sha19@gmail.com";

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: recipient,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
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
