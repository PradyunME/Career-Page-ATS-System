"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SelectedJob = {
    id: string;
    slug?: string;
    title: string;
    location: string;
    type: string;
    department: string;
    description: string;
};

export default function JobApplicationForm({ selectedJob }: { selectedJob: SelectedJob }) {
    const router = useRouter();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        if (!resumeFile) {
            setErrorMessage("Please attach your resume before submitting.");
            return;
        }
        setIsLoading(true);
        const htmlForm = e.currentTarget;
        const submission = new FormData(htmlForm);
        submission.set("jobSlug", selectedJob.slug || selectedJob.id);
        try {
            const response = await fetch("/api/applications", { method: "POST", body: submission });
            const result = await response.json() as { success?: boolean; message?: string };
            if (!response.ok || !result.success) {
                setErrorMessage(result.message || "Your application could not be delivered. Please try again later.");
                return;
            }
            setIsSuccess(true);
            setIsSubmitted(true);
        } catch {
            setErrorMessage("Could not reach the application server. Check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted && isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100">
                    <div className="text-green-500 text-6xl mb-6">✓</div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Application Sent!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">Your application for <strong>{selectedJob.title}</strong> was sent to the configured hiring inbox.</p>
                    <button onClick={() => router.push('/careers')}
                            className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Back to Careers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 pt-28">
            <div className="mx-auto max-w-4xl px-6">
                <button onClick={() => router.push('/careers')}
                        className="text-blue-600 mb-6 flex items-center gap-2 font-medium hover:underline">
                    ← Back to Careers
                </button>

                <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                    <div className="flex gap-3 mb-4">
                        <span
                            className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedJob.department}</span>
                        <span
                            className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedJob.location}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-blue-200 pl-4">{selectedJob.description}</p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">Application Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Details Section */}
                        <div className="space-y-6">
                            {/*<h3 className="text-lg font-semibold text-blue-800">1. Personal Information</h3>*/}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input type="text" name="fullName" required
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address
                                        *</label>
                                    <input type="email" name="email" required
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" name="phone"
                                       className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="+1 (555) 000-0000"/>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="space-y-6">
                            {/*<h3 className="text-lg font-semibold text-blue-800">2. Professional Profiles</h3>*/}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn
                                        Profile</label>
                                    <input type="url" name="linkedinUrl"
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                           placeholder="https://linkedin.com/..."/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub
                                        Profile</label>
                                    <input type="url" name="githubUrl"
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                           placeholder="https://github.com/..."/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio
                                        Website</label>
                                    <input type="url" name="portfolioUrl"
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                           placeholder="https://yourportfolio.com"/>
                                </div>
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-6">
                            {/*<h3 className="text-lg font-semibold text-blue-800">3. Role Fit</h3>*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience
                                    *</label>
                                <textarea name="previousExperience" required rows={4}
                                          className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                          placeholder="Summarize your relevant background..."/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                <textarea name="coverLetter" rows={5}
                                          className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                          placeholder="Tell us why you are a great fit for AltHire AI..."/>
                            </div>
                        </div>

                        {/* Logistics Section */}
                        <div className="space-y-6">
                            {/*<h3 className="text-lg font-semibold text-blue-800">4. Logistics</h3>*/}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability
                                        Date</label>
                                    <input type="date" name="availabilityDate"
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected
                                        Salary</label>
                                    <input type="text" name="expectedSalary"
                                           className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                           placeholder="e.g. $100k - $120k"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period
                                        *</label>
                                    <select name="noticePeriod" required
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="">Select notice period</option>
                                        <option value="immediate">Immediate</option>
                                        <option value="1_week">1 Week</option>
                                        <option value="2_weeks">2 Weeks</option>
                                        <option value="1_month">1 Month</option>
                                        <option value="2_months">2 Months</option>
                                        <option value="3_months">3 Months</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div
                            className="bg-blue-50/50 border-2 border-dashed border-blue-200 p-8 rounded-2xl text-center">
                            <label className="block text-lg font-bold text-blue-900 mb-2">Resume / CV *</label>
                            <p className="text-sm text-blue-600 mb-4">Accepted: PDF, DOC, DOCX (Max 10MB)</p>
                            <input type="file" name="resume" required accept=".pdf,.doc,.docx"
                                   onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                   className="mx-auto block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                        </div>

                        <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                            <label>Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                        </div>

                        <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                            <input type="checkbox" name="consent" value="yes" required className="mt-1 accent-blue-600" />
                            <span>I understand this portfolio demo emails my application details and resume to the inbox configured by the site owner. <strong className="text-red-600">*</strong></span>
                        </label>

                        {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{errorMessage}</p>}

                        {/* Form Actions */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-400"
                            >
                                {isLoading ? "Sending Application..." : "Submit My Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}