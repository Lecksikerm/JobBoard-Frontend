import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApplicationStatusBadge from './ApplicationStatusBadge';

const RecentApplications = ({ applications, loading }) => {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays}d ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
            return date.toLocaleDateString();
        } catch {
            return 'Recently';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="h-5 sm:h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="divide-y divide-gray-100">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 sm:p-6 flex gap-3 sm:gap-4 animate-pulse">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="h-4 sm:h-5 w-32 sm:w-48 bg-gray-200 rounded" />
                                <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No applications yet</h3>
                <p className="text-sm text-gray-600 mb-4 sm:mb-6">Start applying to jobs and track your progress here</p>
                <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                    Browse Jobs
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link
                    to="/candidate/applications"
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                    View all
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="divide-y divide-gray-100">
                {applications.slice(0, 5).map((application, index) => (
                    <motion.div
                        key={application._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            {/* Company Logo */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 font-bold text-base sm:text-lg">
                                    {application.job?.company?.charAt(0) || 'C'}
                                </div>
                            </div>

                            {/* Application Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                            {application.job?.title || 'Unknown Position'}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600">
                                            <span className="flex items-center gap-1 truncate">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="truncate">{application.job?.company || 'Unknown Company'}</span>
                                            </span>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{application.job?.location || 'Remote'}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <ApplicationStatusBadge status={application.status} />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-2">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(application.appliedAt)}
                                        </span>
                                        <span className="hidden sm:inline text-gray-300">•</span>
                                        <span className="capitalize">{application.job?.type || 'Full-time'}</span>
                                    </div>

                                    <Link
                                        to={`/candidate/applications/${application._id}`}
                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentApplications;