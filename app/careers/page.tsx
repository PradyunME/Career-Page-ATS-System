import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { jobs } from "@/lib/jobs";

export const metadata: Metadata = {
    title: 'AltHire Career Page — Portfolio Demo',
    description: 'Portfolio demonstration of a career listing page and email-based application workflow.',
    openGraph: {
        title: 'AltHire Career Page — Portfolio Demo',
        description: 'A career-page frontend with a new, standalone email application backend.',
    },
};

export const revalidate = 60;
export default function CareersPage() {
    // Portfolio-safe sample data replaces the private production CMS connection.

    return (
        <div
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-montserrat">
            {/* Decorative Background Elements */}
            <div
                className="absolute left-0 top-0 h-96 w-96 -translate-x-48 -translate-y-48 rounded-full bg-gradient-to-br from-blue-100/30 to-transparent"></div>
            <div
                className="absolute right-0 top-1/3 h-80 w-80 translate-x-40 rounded-full bg-gradient-to-bl from-indigo-100/40 to-transparent"></div>

            <div className="relative mx-auto max-w-6xl px-6 py-12">
                <div id="portfolio-demo" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Portfolio demo: these are sample positions, not live vacancies. Application submissions are emailed to the recipient configured by the site owner.</div>
                {/* Hero & Culture Section */}
                <section className="mb-20 pt-16">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
                        <div className="text-center lg:w-1/2 lg:text-left">
                            <h1 className="mb-8 text-5xl font-bold leading-tight text-blue-800">
                                Join AltHire AI
                            </h1>
                            <p className="mb-6 text-xl leading-relaxed text-gray-600">
                                Empower the future of fair, transparent hiring using AI-driven tools.
                            </p>
                            <div
                                className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 lg:mx-0"></div>
                        </div>

                        <div
                            className="hidden h-64 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600 lg:block"></div>

                        <div className="lg:w-1/2">
                            <div
                                className="rounded-3xl border border-gray-100 bg-white/70 p-8 shadow-lg backdrop-blur-sm">
                                <h2 className="mb-6 text-center text-3xl font-semibold text-blue-700 lg:text-left">
                                    Culture & Environment
                                </h2>
                                <p className="leading-relaxed text-gray-700">
                                    We value diversity, continuous learning, and work-life balance.
                                    Our remote-first team thrives on open communication, trust, and shared purpose
                                    in revolutionizing the hiring process.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions Grid */}
                <section id="positions" className="mb-20">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-semibold text-blue-700">Open Positions</h2>
                        <p className="text-lg text-gray-600">Join our innovative team and make an impact</p>
                    </div>

                    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="group rounded-2xl border border-blue-200 bg-white/80 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                            >
                                <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-6">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                        <h3 className="text-xl font-semibold leading-tight text-gray-900 group-hover:text-blue-700">
                                            {job.title}
                                        </h3>
                                        <span
                                            className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 font-mono text-xs text-gray-600">
                      {job.slug || 'JOB'}
                    </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                      {job.location}
                    </span>
                                        <span
                                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                      {job.type}
                    </span>
                                        <span
                                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                      {job.department}
                    </span>
                                    </div>
                                    {job.excerpt && (
                                        <p className="text-gray-700 line-clamp-6">
                                            {job.excerpt}
                                        </p>
                                    )}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Salary:</span>
                                                <p className="font-medium text-gray-900">{job.salaryRange || 'Competitive'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Posted:</span>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/careers/job/${job.slug || job.id}`}
                                        className="block text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                                    >
                                        View Details & Apply
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mb-20">
                    <div className="rounded-3xl border border-gray-100 bg-white/70 p-10 shadow-lg backdrop-blur-sm">
                        <h2 className="mb-8 text-center text-3xl font-semibold text-blue-700">What Our Team Says</h2>
                        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                            <blockquote className="border-l-4 border-blue-600 pl-6 text-lg italic text-gray-700">
                                "AltHire has been a game-changer for my career! The support from the team and the
                                culture of innovation inspire me every day."
                                <footer className="mt-4 font-semibold not-italic text-blue-700">— Pradyun
                                    Srivastava</footer>
                            </blockquote>
                            <blockquote className="border-l-4 border-blue-600 pl-6 text-lg italic text-gray-700">
                                "Working remotely has allowed me to balance my personal and professional life like never
                                before."
                                <footer className="mt-4 font-semibold not-italic text-blue-700">— Harishankar
                                    Kumar</footer>
                            </blockquote>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}