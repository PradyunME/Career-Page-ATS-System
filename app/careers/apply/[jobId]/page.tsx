import React from "react";
import { notFound } from "next/navigation";
import JobApplicationForm from "@/components/JobApplicationForm";
import { getJobBySlug, jobs } from "@/lib/jobs";

type Props = { params: Promise<{ jobId: string }> };

export function generateStaticParams() {
    return jobs.map((job) => ({ jobId: job.slug }));
}

export default async function ApplyPage({ params }: Props) {
    const { jobId } = await params;
    const job = getJobBySlug(jobId);
    if (!job) notFound();

    const selectedJob = {
        id: job.slug,
        slug: job.slug,
        title: job.title,
        location: job.location,
        type: job.type,
        department: job.department,
        description: job.excerpt,
    };

    return <JobApplicationForm selectedJob={selectedJob} />;
}
