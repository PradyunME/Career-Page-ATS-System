# Career Portal + Email-Based ATS

A standalone Next.js application based on the career-page UI and application form structure from the supplied AltHire career-page source. It adds a new, independent server-side application endpoint that sends applications to a configured hiring inbox, with the resume attached.

> **Portfolio/demo notice:** The listed jobs are sample entries for testing the workflow, not a representation of current AltHire vacancies. The mail backend in this repository is a new implementation for this showcase; it is not AltHire's original private backend. Before publicly publishing or using employer-related source/assets, confirm you have permission to do so.

## Features

- Career listing page, job detail page, and application form.
- Server-side `POST /api/applications` endpoint using the Next.js Node.js runtime.
- Sends the submitted candidate details and resume attachment to `APPLICATIONS_TO` over SMTP.
- Sets the candidate's validated email as `Reply-To` so a recruiter can reply to the applicant directly.
- Accepts PDF, DOC, and DOCX resumes, with a configurable size limit (10 MB by default).
- Server-side required-field, email, URL, file-extension, MIME type, and PDF/DOC/DOCX signature checks.
- HTML-escaped email content, fixed recipient configuration, SMTP timeouts, hidden honeypot field, and best-effort in-memory rate limiting.
- Clear error responses if the mail server is not configured or delivery fails. The UI only reports success after SMTP accepts the message.
- No candidate or resume data is deliberately written to the application's local disk. Email delivery is the intended record of an application.

## Requirements

- Node.js 20 or later
- npm
- An SMTP account permitted to send mail

## Run locally

1. Extract this project and open a terminal at the folder containing `package.json`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`.

   **PowerShell:**

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Edit `.env.local` and configure the SMTP sender and destination inbox (details below).
5. Start the app:

   ```bash
   npm run dev
   ```

6. Open <http://localhost:3000/careers>, choose a sample role, and submit a test application with a test resume.

Run the validation tests with:

```bash
npm test
```

Type-check the TypeScript project with:

```bash
npm run typecheck
```

Create a production build with:

```bash
npm run build
npm run start
```

## Configure email delivery

The application sends one email to the configured hiring inbox. The resume is attached. **Email delivery will not work until real SMTP settings are supplied.** No email credentials are included in this project.

Required variables:

| Variable | Purpose | Example |
|---|---|---|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `465` |
| `SMTP_SECURE` | Use implicit TLS (`true` for port 465; usually `false` for port 587 with STARTTLS) | `true` |
| `SMTP_USER` | Authenticated sender mailbox/login | `sender@example.com` |
| `SMTP_PASSWORD` | SMTP password/app password | Set privately in `.env.local` |
| `APPLICATIONS_TO` | Destination mailbox that receives applications | `recruiting@example.com` |
| `MAIL_FROM` | Optional sender address/approved alias | `sender@example.com` |
| `MAX_RESUME_SIZE_MB` | Resume file limit | `10` |

### Gmail example

1. Enable 2-Step Verification for the sending Google account if it is not already enabled.
2. Generate an **App Password** for that account (if your account/workspace permits App Passwords). Do not use your normal Google password.
3. Use `smtp.gmail.com`, port `465`, and `SMTP_SECURE=true`, or the provider's documented STARTTLS configuration.
4. Set `SMTP_USER` to the sender account, `SMTP_PASSWORD` to the app password, and `APPLICATIONS_TO` to the inbox where applications should arrive.
5. Restart the dev server after modifying `.env.local`.

For Outlook/Microsoft 365 or another provider, use that provider's current SMTP host, port, authentication and sender rules. The authenticated sender often must match `MAIL_FROM` or be authorized to send as that alias.

## Email behavior and failure handling

- Each successful submission gets a generated application reference ID included in the email subject/body.
- The request returns `201` only after the SMTP server accepts the message for delivery.
- If SMTP configuration is missing, the API returns `503` and does not report the application as delivered.
- If SMTP rejects/fails the message, the API returns `502`; the form shows an error and asks the applicant to retry later. No local resume archive is retained.
- SMTP acceptance does **not** guarantee final delivery to the destination inbox. Check spam/quarantine and the mail provider's delivery logs while configuring the project.

## API contract

`POST /api/applications` accepts `multipart/form-data` with these fields:

- `jobSlug` (required)
- `fullName` (required)
- `email` (required)
- `phone`, `linkedinUrl`, `githubUrl`, `portfolioUrl`
- `previousExperience`, `coverLetter`, `availabilityDate`, `expectedSalary`, `noticePeriod`
- `resume` (required PDF/DOC/DOCX file)
- `consent` (must be `yes`; confirms the candidate understands the details/resume are emailed)
- `website` (hidden anti-spam honeypot; leave empty)

Responses use JSON with a `success` boolean and a `message`. Invalid data returns `422`, unsupported files return `415`, oversized uploads return `413`, throttled requests return `429`, missing mail configuration returns `503`, and delivery failures return `502`.

## Deployment notes

Deploy as a **Node.js server application**, not a static export. Configure the SMTP environment variables as server-side environment variables in the hosting dashboard. Never prefix secret variables with `NEXT_PUBLIC_` and never commit `.env.local`.

The included in-memory rate limiter is a best-effort measure for a single server process; it is not a substitute for a platform/WAF rate limit when running multiple instances. Before production use, add persistent application storage, monitoring, malware scanning for uploaded files, CAPTCHA or stronger bot defense as appropriate, a privacy notice/retention policy, and a documented process for handling applicant personal information. Avoid using the public demo form to collect real candidates until those operational controls are in place.

## Project structure

```text
app/
  api/applications/route.ts       # Server-side validation + SMTP dispatch
  careers/page.tsx                # Adapted original career listing UI
  careers/job/[jobId]/page.tsx    # Adapted original job detail UI
  careers/apply/[jobId]/page.tsx  # Job-specific application page
components/
  JobApplicationForm.tsx          # Original application form UI adapted to the email API
lib/
  application-validation.ts  # Shared validation and field limits
  email.ts                   # SMTP message generation and attachment
  jobs.ts                    # Portfolio sample job data
  rate-limit.ts              # Best-effort request throttle
.env.example                 # Safe SMTP configuration template
```

## Attribution / accuracy

The career listing markup, job detail layout, and application form UI are adapted from the original source files in the user-provided AltHire archive; the Payload CMS lookups and private AI-interview service calls were replaced with local sample job data and this standalone email API. The API route, validation, SMTP mailer, sample job dataset and setup documentation are newly written for this standalone portfolio project. The private AltHire API implementations were not in the supplied source archive and are not represented here as if they were recovered.
