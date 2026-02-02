import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, Loader2 } from 'lucide-react';
import { jobsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import PostJobModal from '../components/PostJobModal';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            // You may need to create this endpoint or filter from all jobs
            const response = await jobsApi.getAll({ employerId: user?.id });
            setJobs(response.data.jobs || response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            await jobsApi.delete(jobId);
            setJobs(jobs.filter(j => j._id !== jobId));
        } catch (error) {
            alert('Failed to delete job');
        }
    };

    const stats = [
        { label: 'Active Jobs', value: jobs.length, icon: Briefcase },
        { label: 'Total Applications', value: 0, icon: Users },
        { label: 'Views', value: 0, icon: Eye },
    ];

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
                    </div>
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Post New Job</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                                    <stat.icon className="h-6 w-6 text-primary-600" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-bold text-gray-900">My Job Listings</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="p-12 text-center">
                            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                            <p className="text-gray-600 mb-4">Start by posting your first job opening</p>
                            <button onClick={() => setShowPostModal(true)} className="btn-primary">
                                Post a Job
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {jobs.map((job) => (
                                <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{job.location} • {job.jobType}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{job.requirements?.length || 0} requirements</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingJob(job)}
                                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showPostModal && (
                <PostJobModal
                    onClose={() => setShowPostModal(false)}
                    onSuccess={fetchMyJobs}
                />
            )}

            {editingJob && (
                <PostJobModal
                    job={editingJob}
                    onClose={() => setEditingJob(null)}
                    onSuccess={fetchMyJobs}
                />
            )}
        </div>
    );
};

export default EmployerDashboard;