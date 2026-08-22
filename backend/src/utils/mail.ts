import nodemailer from "nodemailer";

type NotifyInput = {
  subject: string;
  text: string;
};

type SendMailInput = NotifyInput & {
  to: string;
};

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.NOTIFY_EMAIL));
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT ?? "587");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

function fromAddress() {
  return process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@boardnotes.com";
}

export async function notifyAdmin({ subject, text }: NotifyInput) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to || !smtpConfigured()) {
    console.log(`[notify] ${subject}\n${text}`);
    return { sent: false, logged: true };
  }

  await createTransport().sendMail({ from: fromAddress(), to, subject, text });
  return { sent: true };
}

/** Send to a single user. Without SMTP, logs to the server console. */
export async function sendUserMail({ to, subject, text }: SendMailInput) {
  if (!to.includes("@")) return { sent: false, logged: false };

  if (!smtpConfigured()) {
    console.log(`[email] to=${to}\nsubject=${subject}\n${text}\n`);
    return { sent: false, logged: true };
  }

  await createTransport().sendMail({ from: fromAddress(), to, subject, text });
  return { sent: true };
}
