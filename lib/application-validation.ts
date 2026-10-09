export type ApplicationFields = {
  jobSlug: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  previousExperience: string;
  coverLetter: string;
  availabilityDate: string;
  expectedSalary: string;
  noticePeriod: string;
};

export type ValidationIssue = { field: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_FIELDS: Array<keyof ApplicationFields> = ["linkedinUrl", "githubUrl", "portfolioUrl"];
const FIELD_LIMITS: Partial<Record<keyof ApplicationFields, number>> = {
  jobSlug: 100,
  fullName: 120,
  email: 254,
  phone: 50,
  linkedinUrl: 500,
  githubUrl: 500,
  portfolioUrl: 500,
  previousExperience: 8000,
  coverLetter: 12000,
  availabilityDate: 40,
  expectedSalary: 200,
  noticePeriod: 100
};

export function cleanText(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "";
  // Strip NUL and other control characters (preserve ordinary line breaks/tabs).
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function validateApplication(fields: ApplicationFields): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!fields.jobSlug) issues.push({ field: "jobSlug", message: "Select a job before applying." });
  if (fields.fullName.length < 2) issues.push({ field: "fullName", message: "Enter your full name." });
  if (!EMAIL_RE.test(fields.email) || fields.email.length > 254) {
    issues.push({ field: "email", message: "Enter a valid email address." });
  }
  if (!fields.previousExperience) {
    issues.push({ field: "previousExperience", message: "Summarize your relevant experience." });
  }
  if (!fields.noticePeriod) {
    issues.push({ field: "noticePeriod", message: "Select your notice period or availability." });
  }

  for (const key of Object.keys(FIELD_LIMITS) as Array<keyof ApplicationFields>) {
    const limit = FIELD_LIMITS[key];
    if (limit && fields[key].length > limit) {
      issues.push({ field: key, message: `${key} must be ${limit} characters or fewer.` });
    }
  }

  for (const key of URL_FIELDS) {
    if (fields[key] && !isHttpUrl(fields[key])) {
      issues.push({ field: key, message: "Use a complete http:// or https:// URL." });
    }
  }
  return issues;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
