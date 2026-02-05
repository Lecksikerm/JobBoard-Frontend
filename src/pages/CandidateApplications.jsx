import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applicationsApi } from '../lib/api';
import ApplicationStatusBadge from '../components/candidate/ApplicationStatusBadge';
import { useToast } from '../context/ToastContext';

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error: showError } = useToast();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await applicationsApi.getMyApplications();
            setApplications(response.data?.applications || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            showError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Link
                            to="/candidate/dashboard"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-flex items-center"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                        <p className="mt-1 text-gray-600">
                            Track and manage all your job applications
                        </p>
                    </div>

                    <Link
                        to="/jobs"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Find More Jobs
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All', count: applications.length },
                            { key: 'applied', label: 'Applied', count: applications.filter(a => a.status === 'applied').length },
                            { key: 'reviewed', label: 'Under Review', count: applications.filter(a => a.status === 'reviewed').length },
                            { key: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
                            { key: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
                            { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.key
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {f.label} ({f.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                                <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-32 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all'
                                ? 'Start applying to jobs and track your progress here'
                                : `You don't have any ${filter} applications yet`}
                        </p>
                        <Link to="/jobs" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application, index) => (
                            <motion.div
                                key={application._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                                            {application.job?.company?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {application.job?.title || 'Unknown Position'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {application.job?.company || 'Unknown Company'}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {application.job?.location || 'Remote'}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="capitalize">{application.job?.type || 'Full-time'}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Applied on {formatDate(application.appliedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <ApplicationStatusBadge status={application.status} />
                                        <Link
                                            to={`/candidate/applications/${application._id}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateApplications;