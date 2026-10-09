# Source map

This project keeps the original career-page presentation where practical and replaces the private production services needed to make it run standalone.

| Original file in the supplied AltHire ZIP | Standalone project file | What changed |
|---|---|---|
| `src/app/(main)/careers/page.tsx` | `app/careers/page.tsx` | Original listing layout and Tailwind UI retained; Payload job query replaced with sample data in `lib/jobs.ts`; added a portfolio/demo notice. |
| `src/app/(main)/careers/job/[jobId]/page.tsx` | `app/careers/job/[jobId]/page.tsx` | Original job detail layout retained; private Payload lookup and rich-text renderer replaced with local sample job content. |
| `src/app/(main)/careers/apply/[jobId]/page.tsx` | `app/careers/apply/[jobId]/page.tsx` | Original route behavior retained; reads a sample job from the local job list rather than Payload. |
| `src/app/(main)/careers/apply/[jobId]/(components)/JobApplicationForm.tsx` | `components/JobApplicationForm.tsx` | Original form layout and applicant fields retained; private AI interview/posthog integrations removed; submit now posts to `/api/applications`. |

New files: `app/api/applications/route.ts`, `lib/email.ts`, `lib/application-validation.ts`, `lib/rate-limit.ts`, and the tests/documentation. The email API is a new portfolio implementation, not AltHire's original backend.
