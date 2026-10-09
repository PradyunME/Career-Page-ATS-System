import test from "node:test";
import assert from "node:assert/strict";
import { validateApplication, type ApplicationFields } from "../lib/application-validation";

const validApplication: ApplicationFields = {
  jobSlug: "software-engineer-intern",
  fullName: "Casey Candidate",
  email: "casey@example.com",
  phone: "",
  linkedinUrl: "https://linkedin.com/in/casey",
  githubUrl: "https://github.com/casey",
  portfolioUrl: "",
  previousExperience: "A few student projects.",
  coverLetter: "",
  availabilityDate: "",
  expectedSalary: "",
  noticePeriod: "2_weeks"
};

test("accepts a valid application", () => {
  assert.deepEqual(validateApplication(validApplication), []);
});

test("requires a name, job, and valid email", () => {
  const issues = validateApplication({ ...validApplication, jobSlug: "", fullName: "", email: "not-an-email", previousExperience: "", noticePeriod: "" });
  assert.ok(issues.some((issue) => issue.field === "jobSlug"));
  assert.ok(issues.some((issue) => issue.field === "fullName"));
  assert.ok(issues.some((issue) => issue.field === "email"));
  assert.ok(issues.some((issue) => issue.field === "previousExperience"));
  assert.ok(issues.some((issue) => issue.field === "noticePeriod"));
});

test("rejects unsafe profile URLs", () => {
  const issues = validateApplication({ ...validApplication, githubUrl: "javascript:alert(1)" });
  assert.ok(issues.some((issue) => issue.field === "githubUrl"));
});

test("rejects fields that exceed documented limits", () => {
  const issues = validateApplication({ ...validApplication, fullName: "a".repeat(121) });
  assert.ok(issues.some((issue) => issue.field === "fullName" && issue.message.includes("120")));
});
