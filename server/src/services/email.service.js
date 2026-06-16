import sgMail from "@sendgrid/mail";
import { env } from "../config/env.js";

if (env.sendgridApiKey) sgMail.setApiKey(env.sendgridApiKey);

export const sendEmail = async ({ to, subject, text }) => {
  if (!env.enableEmailNotifications || !env.sendgridApiKey) {
    return { status: "SKIPPED", reason: "Email notifications disabled or SendGrid key missing" };
  }

  try {
    await sgMail.send({ to, from: env.sendgridFromEmail, subject, text });
    return { status: "SENT" };
  } catch (error) {
    return { status: "FAILED", reason: error.message };
  }
};
