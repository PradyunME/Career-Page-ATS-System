import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cleanText, validateApplication, type ApplicationFields } from "@/lib/application-validation";
import { getJobBySlug } from "@/lib/jobs";
import { sendApplicationEmail } from "@/lib/email";
import { checkApplicationRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_RESUME_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MIME_TYPES_BY_EXTENSION: Record<string, Set<string>> = {
  ".pdf": new Set(["application/pdf", "application/octet-stream"]),
  ".doc": new Set(["application/msword", "application/octet-stream"]),
  ".docx": new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/octet-stream"
  ])
};
const DEFAULT_MAX_RESUME_MB = 10;

function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ success: false, message, ...(details ? { details } : {}) }, { status });
}

function safeFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() || "resume";
  return base.replace(/[^a-zA-Z0-9._() -]/g, "_").slice(0, 120) || "resume";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  const maxMb = Number(process.env.MAX_RESUME_SIZE_MB || DEFAULT_MAX_RESUME_MB);
  const maxFileBytes = (Number.isFinite(maxMb) && maxMb > 0 ? maxMb : DEFAULT_MAX_RESUME_MB) * 1024 * 1024;
  if (contentLength > maxFileBytes + 1_000_000) {
    return jsonError(413, `Your request is too large. Resume files must be ${Math.round(maxFileBytes / 1024 / 1024)} MB or smaller.`);
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = request.headers.get("x-real-ip")?.trim() || forwarded || "unknown";
  const limit = clientIp === "unknown"
    ? { allowed: true, retryAfterSeconds: 0 }
    : checkApplicationRateLimit(clientIp);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many applications have been submitted from this connection. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Could not read the application form. Please try again.");
  }

  // Honeypot field: legitimate users never see or fill this field.
  // Return a generic success response to avoid helping simple bots tune their requests.
  if (cleanText(form.get("website"))) {
    return NextResponse.json({ success: true, message: "Application received." }, { status: 201 });
  }

  if (cleanText(form.get("consent")) !== "yes") {
    return jsonError(422, "Please confirm that your application details and resume may be emailed to the hiring inbox.");
  }

  const fields: ApplicationFields = {
    jobSlug: cleanText(form.get("jobSlug")),
    fullName: cleanText(form.get("fullName")),
    email: cleanText(form.get("email")).toLowerCase(),
    phone: cleanText(form.get("phone")),
    linkedinUrl: cleanText(form.get("linkedinUrl")),
    githubUrl: cleanText(form.get("githubUrl")),
    portfolioUrl: cleanText(form.get("portfolioUrl")),
    previousExperience: cleanText(form.get("previousExperience")),
    coverLetter: cleanText(form.get("coverLetter")),
    availabilityDate: cleanText(form.get("availabilityDate")),
    expectedSalary: cleanText(form.get("expectedSalary")),
    noticePeriod: cleanText(form.get("noticePeriod"))
  };

  const issues = validateApplication(fields);
  if (issues.length > 0) return jsonError(422, "Please correct the highlighted application fields.", issues);

  const job = getJobBySlug(fields.jobSlug);
  if (!job) return jsonError(400, "That position is no longer available. Please return to the careers page.");

  const resumeEntry = form.get("resume");
  if (!resumeEntry || typeof resumeEntry === "string" || typeof resumeEntry.arrayBuffer !== "function") {
    return jsonError(422, "Please attach your resume as a PDF, DOC, or DOCX file.");
  }
  const resume = resumeEntry as File;
  const extension = resume.name.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
  if (!ALLOWED_RESUME_EXTENSIONS.has(extension)) {
    return jsonError(415, "Unsupported resume format. Upload a PDF, DOC, or DOCX file.");
  }
  const extensionMimes = MIME_TYPES_BY_EXTENSION[extension];
  if (resume.type && extensionMimes && !extensionMimes.has(resume.type)) {
    return jsonError(415, "The resume file type does not match its filename. Upload a valid PDF, DOC, or DOCX file.");
  }
  if (resume.size <= 0) return jsonError(422, "The resume file is empty. Please choose another file.");
  if (resume.size > maxFileBytes) {
    return jsonError(413, `Resume files must be ${Math.round(maxFileBytes / 1024 / 1024)} MB or smaller.`);
  }
  if (resume.name.length > 250) return jsonError(422, "The resume filename is too long.");

  // Validate PDF's signature to reject a renamed non-PDF file. DOC/DOCX are
  // restricted by extension and the browser-provided MIME type above.
  const resumeBuffer = Buffer.from(await resume.arrayBuffer());
  const prefix = resumeBuffer.subarray(0, 8);
  if (extension === ".pdf" && prefix.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return jsonError(415, "The uploaded file does not appear to be a valid PDF.");
  }
  if (extension === ".docx" && prefix.subarray(0, 4).toString("ascii") !== "PK\u0003\u0004") {
    return jsonError(415, "The uploaded file does not appear to be a valid DOCX document.");
  }
  if (extension === ".doc") {
    const isOleDocument = prefix.subarray(0, 8).equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]));
    const isRtfDocument = prefix.subarray(0, 5).toString("ascii") === "{\\rtf";
    if (!isOleDocument && !isRtfDocument) {
      return jsonError(415, "The uploaded file does not appear to be a valid DOC document.");
    }
  }

  const applicationId = randomUUID();
  const submittedAt = new Date().toISOString();
  try {
    await sendApplicationEmail(job, { ...fields, applicationId, submittedAt }, {
      filename: safeFilename(resume.name),
      content: resumeBuffer,
      contentType: resume.type || (extension === ".pdf" ? "application/pdf" : extension === ".docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/msword")
    });
  } catch (error) {
    // Log only technical error details, never candidate details or resume content.
    console.error("Application email delivery failed:", error instanceof Error ? error.message : "Unknown mail error");
    const missingConfig = error instanceof Error && error.message.startsWith("Missing required email setting:");
    return jsonError(
      missingConfig ? 503 : 502,
      missingConfig
        ? "Application email is not configured yet. The site owner must complete the SMTP settings before applications can be delivered."
        : "We could not deliver your application to the hiring inbox. No success has been reported; please try again later or contact the site owner."
    );
  }

  return NextResponse.json({
    success: true,
    applicationId,
    message: `Your application for ${job.title} has been emailed successfully. Keep this reference: ${applicationId.slice(0, 8).toUpperCase()}.`
  }, { status: 201 });
}
