import nodemailer from "nodemailer";
import type { Job } from "@/lib/jobs";
import type { ApplicationFields } from "@/lib/application-validation";

export type ResumeAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required email setting: ${name}`);
  return value;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    };
    return entities[char];
  });
}

function formatValue(value: string): string {
  return value.trim() || "Not provided";
}

export async function sendApplicationEmail(
  job: Job,
  application: ApplicationFields & { applicationId: string; submittedAt: string },
  resume: ResumeAttachment
): Promise<void> {
  const host = requiredEnv("SMTP_HOST");
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASSWORD");
  const to = requiredEnv("APPLICATIONS_TO");
  const from = process.env.MAIL_FROM?.trim() || user;
  const portValue = Number(process.env.SMTP_PORT || "465");
  if (!Number.isInteger(portValue) || portValue < 1 || portValue > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port number.");
  }
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : portValue === 465;

  const transporter = nodemailer.createTransport({
    host,
    port: portValue,
    secure,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: { minVersion: "TLSv1.2" }
  });

  const rows: Array<[string, string]> = [
    ["Application ID", application.applicationId],
    ["Submitted at (UTC)", application.submittedAt],
    ["Position", job.title],
    ["Full name", application.fullName],
    ["Email", application.email],
    ["Phone", application.phone],
    ["LinkedIn", application.linkedinUrl],
    ["GitHub", application.githubUrl],
    ["Portfolio", application.portfolioUrl],
    ["Previous experience", application.previousExperience],
    ["Cover letter", application.coverLetter],
    ["Availability date", application.availabilityDate],
    ["Expected salary", application.expectedSalary],
    ["Notice period", application.noticePeriod]
  ];

  const text = rows.map(([label, value]) => `${label}: ${formatValue(value)}`).join("\n\n");
  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <th align="left" style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#4b5563;vertical-align:top;width:190px">${escapeHtml(label)}</th>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(formatValue(value))}</td>
    </tr>`).join("");

  await transporter.sendMail({
    from,
    to,
    replyTo: application.email,
    subject: `New application: ${job.title} — ${application.fullName.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
    text,
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827">
      <main style="max-width:850px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
        <header style="padding:24px;background:#1e3a8a;color:#ffffff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#bfdbfe">Career Portal Application</p><h1 style="margin:0;font-size:24px">${escapeHtml(job.title)}</h1><p style="margin:10px 0 0;color:#dbeafe">Application ID: ${escapeHtml(application.applicationId)}</p></header>
        <div style="padding:12px 20px 22px"><p style="color:#4b5563">The candidate's resume is attached to this message.</p><table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">${htmlRows}</table></div>
      </main></body></html>`,
    attachments: [{
      filename: resume.filename,
      content: resume.content,
      contentType: resume.contentType
    }],
    disableFileAccess: true,
    disableUrlAccess: true
  });
}
