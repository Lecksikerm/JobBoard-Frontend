import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applicationsApi, jobsApi } from '../lib/api';
import ApplicationStatusBadge from '../components/candidate/ApplicationStatusBadge';
import { useToast } from '../context/ToastContext';

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const { error: showError } = useToast();
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplicationDetails();
    }, [id]);

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);

            const response = await applicationsApi.getMyApplication(id);
            const application = response.data?.application;

            if (!application) {
                setError('Application not found');
                return;
            }

            setApplication(application);
        } catch (err) {
            console.error('Error fetching application:', err);
            showError('Failed to load application details');
            setError('Failed to load application details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 bg-gray-200 rounded" />
                        <div className="h-64 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
                        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {error || 'Application Not Found'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            The application you're looking for doesn't exist or you don't have access to it.
                        </p>
                        <button
                            onClick={() => navigate('/candidate/applications')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Applications
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Applications
                    </button>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 font-bold text-3xl flex-shrink-0">
                                    {application.job?.company?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {application.job?.title || 'Unknown Position'}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                                        <span className="flex items-center gap-1 font-medium">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            {application.job?.company || 'Lecksikerm Consult'}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {application.job?.location || 'Remote'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <ApplicationStatusBadge status={application.status} />
                                <span className="text-sm text-gray-500">
                                    Applied {formatDate(application.appliedAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column - Job Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Job Details
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Job Type</span>
                                            <span className="font-medium text-gray-900 capitalize">{application.job?.type || 'Full-time'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Location</span>
                                            <span className="font-medium text-gray-900">{application.job?.location || 'Remote'}</span>
                                        </div>
                                        {application.job?.salary && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Salary</span>
                                                <span className="font-medium text-green-600">{application.job.salary}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Posted</span>
                                            <span className="font-medium text-gray-900">
                                                {application.job?.postedAt ? formatDate(application.job.postedAt) : 'Recently'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Description Preview */}
                                {application.job?.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-6">
                                                {application.job.description}
                                            </p>
                                            <Link
                                                to={`/jobs/${application.job?._id}`}
                                                className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                View Full Job Posting
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Application Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Your Application
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Application ID</span>
                                            <span className="font-mono text-sm text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                                #{application._id?.slice(-8).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Submitted</span>
                                            <span className="font-medium text-gray-900">{formatDate(application.appliedAt)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Current Status</span>
                                            <ApplicationStatusBadge status={application.status} />
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                {application.coverLetter && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Cover Letter</h3>
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {application.coverLetter}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Resume */}
                                {application.resumeURL && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Resume</h3>
                                        <a
                                            href={application.resumeURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                    View Resume
                                                </p>
                                                <p className="text-sm text-gray-500">PDF Document</p>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}

                                {/* Timeline/Status Info */}
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        What's Next?
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                        {application.status === 'applied' && "Your application has been submitted. The employer will review it soon. You'll be notified of any updates."}
                                        {application.status === 'reviewed' && "The employer has reviewed your application. They may contact you soon for next steps."}
                                        {application.status === 'shortlisted' && "Congratulations! You've been shortlisted. The employer will contact you for an interview soon."}
                                        {application.status === 'accepted' && "Congratulations! You've been accepted for this position. Check your email for next steps."}
                                        {application.status === 'rejected' && "Unfortunately, you were not selected for this position. Don't get discouraged - keep applying!"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplicationDetail;