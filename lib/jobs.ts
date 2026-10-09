export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  postedDate: string;
  createdAt: string;
  excerpt: string;
  description: string[];
  responsibilities: string[];
};

// Portfolio demonstration listings. Replace these with authorized, real positions
// before using this project for an actual employer's recruitment process.
export const jobs: Job[] = [
  {
    id: "software-engineer-intern",
    slug: "software-engineer-intern",
    title: "Software Engineer Intern",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Internship",
    salaryRange: "Discussed during hiring",
    postedDate: "2026-10-01",
    createdAt: "2026-10-01T12:00:00.000Z",
    excerpt: "Help build and improve web applications and tools used by our product team.",
    description: [
      "This sample posting demonstrates the career portal and application workflow. It is not a claim that AltHire AI currently has this opening.",
      "The role is intended for a student or early-career developer interested in frontend development, backend APIs, and building useful product experiences."
    ],
    responsibilities: [
      "Build and maintain user-facing features with guidance from experienced developers.",
      "Work with APIs and structured data to support application functionality.",
      "Test changes, investigate bugs, and document technical decisions.",
      "Collaborate with product and engineering teammates to turn requirements into working software."
    ]
  },
  {
    id: "frontend-developer-intern",
    slug: "frontend-developer-intern",
    title: "Frontend Developer Intern",
    department: "Product Engineering",
    location: "Remote / Hybrid",
    type: "Internship",
    salaryRange: "Discussed during hiring",
    postedDate: "2026-10-01",
    createdAt: "2026-10-01T12:00:00.000Z",
    excerpt: "Create accessible, responsive interfaces and improve candidate-facing workflows.",
    description: [
      "This sample posting demonstrates the career portal and application workflow. It is not a claim that AltHire AI currently has this opening.",
      "The role focuses on component-driven frontend development, usability, API integration, and careful testing of interactive experiences."
    ],
    responsibilities: [
      "Implement responsive interfaces using React and TypeScript.",
      "Connect frontend components to documented APIs and handle loading and error states.",
      "Test user flows across common screen sizes and browsers.",
      "Document features and communicate progress with teammates."
    ]
  },
  {
    id: "full-stack-developer-intern",
    slug: "full-stack-developer-intern",
    title: "Full Stack Developer Intern",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Internship",
    salaryRange: "Discussed during hiring",
    postedDate: "2026-10-01",
    createdAt: "2026-10-01T12:00:00.000Z",
    excerpt: "Work across frontend components, server endpoints, data validation, and application workflows.",
    description: [
      "This sample posting demonstrates a full-stack application flow in the portfolio project. It is not a claim that AltHire AI currently has this opening.",
      "The role is suited to someone interested in delivering an end-to-end feature, from form and API design through validation and operational handling."
    ],
    responsibilities: [
      "Build frontend workflows and backend endpoints for an example web application.",
      "Validate submitted data and handle file uploads safely.",
      "Investigate unexpected behavior and add tests for important paths.",
      "Document setup instructions and environment configuration."
    ]
  }
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}
