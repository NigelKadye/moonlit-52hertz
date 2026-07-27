import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { ContactRequest, ContactResponse } from "@shared/api";

const TO_EMAIL = process.env.CONTACT_EMAIL ?? "val@52hertz.co.zw";

export const handleContact: RequestHandler = async (req, res) => {
  const { name, email, message } = req.body as ContactRequest;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    const response: ContactResponse = {
      ok: false,
      message: "Please provide your name, email and message.",
    };
    res.status(400).json(response);
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    // SMTP not configured — log and return graceful error
    console.warn(
      "[contact] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    );
    const response: ContactResponse = {
      ok: false,
      message:
        "The contact form is not fully configured yet. Please email val@52hertz.co.zw directly.",
    };
    res.status(503).json(response);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"52Hertz Website" <${smtpUser}>`,
    replyTo: `${name.trim()} <${email.trim()}>`,
    to: TO_EMAIL,
    subject: `New message from ${name.trim()}`,
    text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    html: `<p><strong>Name:</strong> ${name.trim()}</p><p><strong>Email:</strong> ${email.trim()}</p><hr/><p>${message.trim().replace(/\n/g, "<br/>")}</p>`,
  });

  const response: ContactResponse = { ok: true, message: "Message sent." };
  res.status(200).json(response);
};
