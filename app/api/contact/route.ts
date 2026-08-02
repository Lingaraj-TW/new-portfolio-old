import { NextResponse } from "next/server";

import {
  contactSubjectOptions,
  type ContactSubjectValue,
} from "@/content/contact";

const SUBJECT_VALUES = new Set<ContactSubjectValue>(
  contactSubjectOptions.map((o) => o.value),
);

const SUBJECT_LABELS: Record<ContactSubjectValue, string> = {
  "full-time": "Full-time Role",
  contract: "Contract",
  freelance: "Freelance",
  collaboration: "Collaboration",
  other: "Other",
};

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMessageHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "")
    .trim();
}

function validatePayload(body: ContactBody): { ok: true; data: Required<ContactBody> } | { ok: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const messageHtml =
    typeof body.message === "string" ? sanitizeMessageHtml(body.message.trim()) : "";
  const messagePlain = htmlToPlainText(messageHtml);

  if (name.length < 2) {
    return { ok: false, error: "Please enter your name (at least 2 characters)." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!subject || !SUBJECT_VALUES.has(subject as ContactSubjectValue)) {
    return { ok: false, error: "Please select a subject." };
  }
  if (messagePlain.length < 10) {
    return { ok: false, error: "Message must be at least 10 characters." };
  }
  if (messagePlain.length > 2000) {
    return { ok: false, error: "Message must be 2000 characters or fewer." };
  }

  return {
    ok: true,
    data: { name, email, subject, message: messageHtml },
  };
}

function buildEmailHtml(
  name: string,
  email: string,
  subjectLabel: string,
  messageHtml: string,
): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subjectLabel);
  const safeMessageBody = sanitizeMessageHtml(messageHtml);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#09080F;font-family:Inter,Segoe UI,sans-serif;color:#FDF4FF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09080F;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#110F1C;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 20px;background:linear-gradient(135deg,#9333EA,#EC4899);">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Prodoc Portfolio</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#FFFFFF;">New contact message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#C4B5D4;">From</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#FDF4FF;">${safeName}</p>
              <p style="margin:4px 0 0;font-size:14px;color:#C084FC;"><a href="mailto:${safeEmail}" style="color:#C084FC;text-decoration:none;">${safeEmail}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;">
              <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#C4B5D4;">Subject</p>
              <p style="margin:0;font-size:15px;color:#FDF4FF;">${safeSubject}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#C4B5D4;">Message</p>
              <div style="margin:0;font-size:14px;line-height:1.6;color:#E9D5FF;">${safeMessageBody}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;" align="center">
              <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 24px;border-radius:12px;background:linear-gradient(135deg,#9333EA,#EC4899);color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${safeName}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const validated = validatePayload(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = validated.data;
  const subjectKey = subject as ContactSubjectValue;
  const subjectLabel = SUBJECT_LABELS[subjectKey];

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Email service is not configured." },
      { status: 503 },
    );
  }

  const toEmail =
    process.env.CONTACT_EMAIL?.trim() || "lingaraj.m.tw@gmail.com";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `[Prodoc] ${subjectLabel} — from ${name}`,
      html: buildEmailHtml(name, email, subjectLabel, message),
    }),
  });

  if (!res.ok) {
    let detail = "Failed to send message. Please try again.";
    try {
      const errBody = (await res.json()) as { message?: string };
      if (errBody.message) detail = errBody.message;
    } catch {
      /* ignore parse errors */
    }
    return NextResponse.json(
      { ok: false, error: detail },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
