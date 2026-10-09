import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobBySlug, jobs } from "@/lib/jobs";

type Props = { params: Promise<{ jobId: string }> };

export function generateStaticParams() {
    return jobs.map((job) => ({ jobId: job.slug }));
}

export default async function JobDescriptionPage({ params }: Props) {
    const { jobId } = await params;
    const job = getJobBySlug(jobId);
    if (!job) notFound();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

                <div className="mx-auto max-w-4xl px-6 pb-8 pt-20">
                    {/* Back Navigation */}
                    <div className="my-6">
                        <Link
                            href="/careers"
                            className="group inline-flex items-center gap-2 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
                        >
                            <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            <span>Back to Careers</span>
                        </Link>
                    </div>

                    {/* Job Header Card */}
                    <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                                    {job.title}
                                </h1>
                                <div className="mb-4 flex flex-wrap gap-3">
                                    <span
                                        className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 capitalize">
                                        {job.location}
                                    </span>
                                    <span
                                        className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 capitalize">
                                        {job.type}
                                    </span>
                                    <span
                                        className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 capitalize">
                                        {job.department}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
                                    <div>
                                        <span className="block text-gray-500">Salary Range</span>
                                        <p className="text-lg font-semibold text-gray-900">{job.salaryRange || 'Competitive'}</p>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Posted Date</span>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Job ID</span>
                                        <p className="font-semibold text-gray-900 uppercase">{job.slug}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 lg:ml-8 lg:mt-0">
                                <Link
                                    href={`/careers/apply/${job.id}`}
                                    className="inline-block transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                                >
                                    Apply Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Job Content Section */}
                    <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 pt-0 shadow-lg">
                        <div className="prose prose-lg max-w-none">
                            <div className="leading-relaxed text-gray-700">
                                {job.description.map((paragraph) => <p key={paragraph} className="mb-5">{paragraph}</p>)}
                                <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">What you will work on</h2>
                                <ul className="list-disc space-y-3 pl-6">
                                    {job.responsibilities.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Apply CTA Footer */}
                    <div
                        className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
                        <h2 className="mb-4 text-3xl font-bold">Ready to Join AltHire AI?</h2>
                        <p className="mb-6 text-xl opacity-90">
                            Join us in revolutionizing the recruitment landscape through innovative AI technology.
                        </p>
                        <Link
                            href={`/careers/apply/${job.slug || job.id}`}
                            className="inline-block transform rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl"
                        >
                            Submit Application
                        </Link>
                    </div>
                </div>
            </div>
        );
}
