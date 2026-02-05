import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
    const actions = [
        {
            title: 'Find Jobs',
            description: 'Browse new opportunities',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            href: '/jobs',
            color: 'bg-blue-600 hover:bg-blue-700 text-white',
            textColor: 'text-white'
        },
        {
            title: 'Update Resume',
            description: 'Manage your resumes',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            href: '/candidate/resumes',
            color: 'bg-white hover:bg-gray-50 text-gray-700',
            textColor: 'text-gray-700',
            border: true
        },
        {
            title: 'Edit Profile',
            description: 'Update your information',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            href: '/candidate/profile',
            color: 'bg-white hover:bg-gray-50 text-gray-700',
            textColor: 'text-gray-700',
            border: true
        },
        {
            title: 'Notifications',
            description: 'View all alerts',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            href: '/candidate/notifications',
            color: 'bg-white hover:bg-gray-50 text-gray-700',
            textColor: 'text-gray-700',
            border: true
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.href}
                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all ${action.color} ${action.border ? 'border border-gray-200' : ''}`}
                    >
                        <div className="mb-1 sm:mb-2">{action.icon}</div>
                        <span className="text-xs sm:text-sm font-medium text-center">{action.title}</span>
                        <span className="text-[10px] sm:text-xs opacity-75 mt-0.5 text-center hidden sm:block">{action.description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;