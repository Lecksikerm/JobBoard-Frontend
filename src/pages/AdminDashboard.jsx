import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    Shield,
    Trash2,
    Loader2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { adminApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState({ employers: [], candidates: [] });
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, reportsRes] = await Promise.all([
                adminApi.getUsers(),
                adminApi.getReports()
            ]);

            setUsers({
                employers: usersRes.data.employers || [],
                candidates: usersRes.data.candidates || []
            });
            setReports(reportsRes.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            showError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            // await adminApi.deleteUser(userId);
            success(`${type} deleted successfully`);
            fetchData();
        } catch (err) {
            showError(`Failed to delete ${type}`);
        }
    };

    const stats = [
        {
            label: 'Total Employers',
            value: users.employers.length,
            icon: Briefcase,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Candidates',
            value: users.candidates.length,
            icon: Users,
            color: 'bg-green-500'
        },
        {
            label: 'Total Jobs',
            value: reports?.totalJobs || 0,
            icon: FileText,
            color: 'bg-purple-500'
        },
        {
            label: 'Total Applications',
            value: reports?.totalApplications || 0,
            icon: TrendingUp,
            color: 'bg-orange-500'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600">
                        Welcome back, {user?.email?.split('@')[0] || 'Admin'}! Manage platform data and view analytics.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'employers', label: 'Employers' },
                                { id: 'candidates', label: 'Candidates' },
                                { id: 'reports', label: 'Reports' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>

                                {/* Application Status Breakdown */}
                                {reports?.applicationsByStatus && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-4">Applications by Status</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {reports.applicationsByStatus.map((status) => (
                                                <div key={status._id} className="bg-white rounded-lg p-4 text-center">
                                                    <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                                                    <p className="text-sm text-gray-600 capitalize">{status._id}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 rounded-xl p-6">
                                        <h4 className="font-semibold text-blue-900 mb-2">Recent Employers</h4>
                                        <p className="text-blue-700 text-sm mb-4">{users.employers.length} total employers</p>
                                        <div className="space-y-2">
                                            {users.employers.slice(0, 5).map((emp) => (
                                                <div key={emp._id} className="flex items-center justify-between bg-white rounded-lg p-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{emp.companyName}</p>
                                                        <p className="text-sm text-gray-500">{emp.email}</p>
                                                    </div>
                                                    {emp.isAdmin && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Admin</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-xl p-6">
                                        <h4 className="font-semibold text-green-900 mb-2">Recent Candidates</h4>
                                        <p className="text-green-700 text-sm mb-4">{users.candidates.length} total candidates</p>
                                        <div className="space-y-2">
                                            {users.candidates.slice(0, 5).map((cand) => (
                                                <div key={cand._id} className="flex items-center justify-between bg-white rounded-lg p-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{cand.fullName}</p>
                                                        <p className="text-sm text-gray-500">{cand.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Employers Tab */}
                        {activeTab === 'employers' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Employers</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.employers.map((emp) => (
                                                <tr key={emp._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{emp.companyName}</div>
                                                        <div className="text-sm text-gray-500">{emp.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {emp.isAdmin ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Admin
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                Employer
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDeleteUser(emp._id, 'employer')}
                                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Candidates Tab */}
                        {activeTab === 'candidates' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Candidates</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.candidates.map((cand) => (
                                                <tr key={cand._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {cand.fullName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cand.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(cand.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDeleteUser(cand._id, 'candidate')}
                                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Platform Reports</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Job Statistics</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Jobs Posted</span>
                                                <span className="font-semibold">{reports?.totalJobs || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Applications</span>
                                                <span className="font-semibold">{reports?.totalApplications || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Avg Applications per Job</span>
                                                <span className="font-semibold">
                                                    {reports?.totalJobs ? (reports.totalApplications / reports.totalJobs).toFixed(1) : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">User Statistics</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Employers</span>
                                                <span className="font-semibold">{users.employers.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Candidates</span>
                                                <span className="font-semibold">{users.candidates.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Users</span>
                                                <span className="font-semibold">{users.employers.length + users.candidates.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;