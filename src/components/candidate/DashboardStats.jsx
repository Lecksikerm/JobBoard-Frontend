import React from 'react';
import { motion } from 'framer-motion';

const DashboardStats = ({ stats, loading }) => {
    const statItems = [
        {
            title: 'Total',
            fullTitle: 'Total Applications',
            value: stats?.total || 0,
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            title: 'Reviewing',
            fullTitle: 'Under Review',
            value: stats?.reviewing || 0,
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-100'
        },
        {
            title: 'Shortlisted',
            fullTitle: 'Shortlisted',
            value: stats?.shortlisted || 0,
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-green-50',
            borderColor: 'border-green-100'
        },
        {
            title: 'Accepted',
            fullTitle: 'Accepted',
            value: stats?.accepted || 0,
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100'
        },
        {
            title: 'Rejected',
            fullTitle: 'Not Selected',
            value: stats?.rejected || 0,
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            bgColor: 'bg-red-50',
            borderColor: 'border-red-100'
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-3 sm:h-4 w-16 sm:w-24 bg-gray-200 rounded" />
                                <div className="h-6 sm:h-8 w-10 sm:w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statItems.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl p-4 sm:p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                                <span className="sm:hidden">{stat.title}</span>
                                <span className="hidden sm:inline">{stat.fullTitle}</span>
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-2`}>
                            {stat.icon}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardStats;