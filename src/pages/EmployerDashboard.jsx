import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, Loader2, ChevronDown, ChevronUp, Download, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { jobsApi, employerApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import PostJobModal from '../components/PostJobModal';
import { useToast } from '../context/ToastContext';


const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [expandedJob, setExpandedJob] = useState(null);
    const { success, error: showError } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all jobs and filter by employer
            const jobsRes = await jobsApi.getAll({ limit: 100 });
            const allJobs = jobsRes.data.jobs || [];

            // Filter jobs where employerId matches current user
            const myJobs = allJobs.filter(job => {
                const jobEmployerId = job.employerId?._id || job.employerId;
                return jobEmployerId === user?.id;
            });

            setJobs(myJobs);

            // Fetch applications
            const appsRes = await employerApi.getApplications();
            setApplications(appsRes.data.jobs || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            await jobsApi.delete(jobId);
            setJobs(jobs.filter(j => j._id !== jobId));
            success('Job deleted successfully');
        } catch (error) {
            showError('Failed to delete job');
        }
    };

    const updateApplicationStatus = async (appId, status) => {
        try {
            await employerApi.updateApplicationStatus(appId, status);
            fetchData();

            const statusMessages = {
                reviewed: 'Application marked as reviewed',
                shortlisted: 'Candidate shortlisted successfully',
                accepted: 'Candidate accepted! 🎉',
                rejected: 'Candidate rejected'
            };

            success(statusMessages[status] || 'Status updated');
        } catch (error) {
            showError('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-blue-100 text-blue-700',
            reviewed: 'bg-yellow-100 text-yellow-700',
            shortlisted: 'bg-green-100 text-green-700',
            accepted: 'bg-green-500 text-white',
            rejected: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const stats = [
        { label: 'Active Jobs', value: jobs.length, icon: Briefcase },
        { label: 'Total Applications', value: applications.reduce((acc, job) => acc + job.applications.length, 0), icon: Users },
        { label: 'New Today', value: 0, icon: Clock },
    ];

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

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
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
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

                {/* Jobs List with Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-bold text-gray-900">My Job Listings & Applications</h2>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="p-12 text-center">
                            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                            <p className="text-gray-600 mb-4">Start by posting your first job opening</p>
                            <button onClick={() => setShowPostModal(true)} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700">
                                Post a Job
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {jobs.map((job) => {
                                const jobApps = applications.find(a => a.jobId.toString() === job._id.toString());
                                const appCount = jobApps ? jobApps.applications.length : 0;
                                const isExpanded = expandedJob === job._id;

                                return (
                                    <div key={job._id} className="border-b last:border-b-0">
                                        {/* Job Header */}
                                        <div
                                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => setExpandedJob(isExpanded ? null : job._id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                        {appCount > 0 && (
                                                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                                {appCount} applicant{appCount !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1">{job.location} • {job.jobType}</p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{job.requirements?.length || 0} requirements</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingJob(job);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(job._id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Applications Section - FIXED ANIMATION */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && jobApps && jobApps.applications.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div className="bg-gray-50 border-t">
                                                        <div className="p-6">
                                                            <h4 className="font-semibold text-gray-900 mb-4">Applicants</h4>
                                                            <div className="space-y-4">
                                                                {jobApps.applications.map((app) => (
                                                                    <div key={app._id} className="bg-white rounded-lg p-4 border border-gray-200">
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex items-start space-x-4">
                                                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                                                    <User className="h-5 w-5 text-primary-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold text-gray-900">
                                                                                        {app.candidate?.fullName || 'Unknown Candidate'}
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-500">{app.candidate?.email}</p>
                                                                                    <p className="text-sm text-gray-400 mt-1">
                                                                                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                                                                                    </p>
                                                                                    {app.coverLetter && (
                                                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                                                            "{app.coverLetter}"
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col items-end space-y-2">
                                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(app.status)}`}>
                                                                                    {app.status}
                                                                                </span>
                                                                                <div className="flex space-x-2">
                                                                                    <a
                                                                                        href={app.resumeURL}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                                        title="Download Resume"
                                                                                    >
                                                                                        <Download className="h-4 w-4" />
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Status Actions */}
                                                                        <div className="mt-4 pt-4 border-t flex space-x-2">
                                                                            {app.status === 'applied' && (
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => updateApplicationStatus(app._id, 'reviewed')}
                                                                                        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                                                                                    >
                                                                                        Mark Reviewed
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                                                                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                                                                    >
                                                                                        Shortlist
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                            {app.status === 'reviewed' && (
                                                                                <button
                                                                                    onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                                                                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                                                                >
                                                                                    Shortlist
                                                                                </button>
                                                                            )}
                                                                            {(app.status === 'applied' || app.status === 'reviewed' || app.status === 'shortlisted') && (
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                                                                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                                                                    >
                                                                                        Accept
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                                                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                                                                    >
                                                                                        Reject
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals - Only render when needed */}
            {showPostModal && (
                <PostJobModal
                    onClose={() => setShowPostModal(false)}
                    onSuccess={() => {
                        success('Job posted successfully!');
                        fetchData();
                        setShowPostModal(false);
                    }}
                />
            )}
            {editingJob && (
                <PostJobModal
                    job={editingJob}
                    onClose={() => setEditingJob(null)}
                    onSuccess={() => {
                        success('Job updated successfully!');
                        fetchData();
                        setEditingJob(null);
                    }}
                />
            )}
        </div>
    );
};

export default EmployerDashboard;