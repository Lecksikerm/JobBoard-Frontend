import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { applicationsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/candidate/DashboardStats';
import RecentApplications from '../components/candidate/RecentApplications';
import QuickActions from '../components/candidate/QuickActions';
import { useToast } from '../context/ToastContext';


const CandidateDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { success, error: showError } = useToast();

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationsApi.getMyApplications();
            const apps = response.data?.applications || [];
            setApplications(apps);

            const calculatedStats = {
                total: apps.length,
                applied: apps.filter(a => a.status === 'applied').length,
                reviewing: apps.filter(a => a.status === 'reviewed').length,
                shortlisted: apps.filter(a => a.status === 'shortlisted').length,
                accepted: apps.filter(a => a.status === 'accepted').length,
                rejected: apps.filter(a => a.status === 'rejected').length
            };
            setStats(calculatedStats);
            setError(null);
        } catch (err) {
            console.error('Error fetching applications:', err);
            showError('Failed to load your applications. Please try again.');
            setError('Failed to load your applications. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Mobile optimized */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! <span className="hidden sm:inline">👋</span>
                    </h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                        Here's what's happening with your job search
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm sm:text-base">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{error}</span>
                        <button
                            onClick={fetchApplications}
                            className="text-sm font-medium hover:underline whitespace-nowrap"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Stats Overview - Responsive grid */}
                <DashboardStats stats={stats} loading={loading} />

                {/* Main Content Grid - Stack on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
                    {/* Recent Applications - Full width on mobile */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <RecentApplications applications={applications} loading={loading} />
                    </div>

                    {/* Sidebar - Moves to top on mobile */}
                    <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                        <QuickActions />

                        {/* Application Status Breakdown */}
                        {!loading && stats && stats.total > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Status Overview</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    {[
                                        { label: 'Applied', count: stats.applied, color: 'bg-blue-500' },
                                        { label: 'Under Review', count: stats.reviewing, color: 'bg-yellow-500' },
                                        { label: 'Shortlisted', count: stats.shortlisted, color: 'bg-green-500' },
                                        { label: 'Accepted', count: stats.accepted, color: 'bg-purple-500' },
                                        { label: 'Not Selected', count: stats.rejected, color: 'bg-red-500' }
                                    ].map((item) => (
                                        item.count > 0 && (
                                            <div key={item.label} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${item.color}`} />
                                                    <span className="text-sm text-gray-600">{item.label}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                                            </div>
                                        )
                                    ))}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 sm:mt-6">
                                    <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden flex">
                                        {stats.applied > 0 && (
                                            <div
                                                className="h-full bg-blue-500 transition-all"
                                                style={{ width: `${(stats.applied / stats.total) * 100}%` }}
                                            />
                                        )}
                                        {stats.reviewing > 0 && (
                                            <div
                                                className="h-full bg-yellow-500 transition-all"
                                                style={{ width: `${(stats.reviewing / stats.total) * 100}%` }}
                                            />
                                        )}
                                        {stats.shortlisted > 0 && (
                                            <div
                                                className="h-full bg-green-500 transition-all"
                                                style={{ width: `${(stats.shortlisted / stats.total) * 100}%` }}
                                            />
                                        )}
                                        {stats.accepted > 0 && (
                                            <div
                                                className="h-full bg-purple-500 transition-all"
                                                style={{ width: `${(stats.accepted / stats.total) * 100}%` }}
                                            />
                                        )}
                                        {stats.rejected > 0 && (
                                            <div
                                                className="h-full bg-red-500 transition-all"
                                                style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        {stats.total} total application{stats.total !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tips Card */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pro Tip
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-100 mb-3 sm:mb-4">
                                Complete your profile to increase your chances of getting noticed by employers.
                            </p>
                            <button className="text-xs sm:text-sm font-medium bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
                                Complete Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;