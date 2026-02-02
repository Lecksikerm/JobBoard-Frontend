import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Clock, Building2, Share2, Bookmark, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ApplyJobModal from './ApplyJobModal';

const JobDetailModal = ({ job, onClose, salaryFormatted }) => {
    const { user, isAuthenticated } = useAuth();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [saved, setSaved] = useState(false);

    // Close on escape key
    useState(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const companyName = job.employerId?.companyName || 'Unknown Company';

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setSaved(!saved)}
                                className={`p-2 rounded-lg transition-colors ${saved ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'}`}
                            >
                                <Bookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Company Info */}
                        <div className="flex items-start space-x-4 mb-6">
                            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-3xl font-bold text-primary-600">
                                {companyName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
                                <div className="flex items-center text-gray-600">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{companyName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Location</span>
                                </div>
                                <p className="font-semibold text-gray-900">{job.location || 'Remote'}</p>
                            </div>
                            <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Salary</span>
                                </div>
                                <p className="font-semibold text-gray-900">{salaryFormatted}</p>
                            </div>
                            <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Type</span>
                                </div>
                                <p className="font-semibold text-gray-900 capitalize">{job.jobType || 'Full-time'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                            <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">
                                {job.description || 'No description provided.'}
                            </div>
                        </div>

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-4 pt-4 border-t">
                            {isAuthenticated && user?.role === 'candidate' ? (
                                <button
                                    onClick={() => setShowApplyModal(true)}
                                    className="flex-1 btn-primary py-3 text-lg"
                                >
                                    Apply Now
                                </button>
                            ) : isAuthenticated && user?.role === 'employer' ? (
                                <button
                                    disabled
                                    className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                                >
                                    Employers cannot apply
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="flex-1 btn-primary py-3 text-lg"
                                >
                                    Sign in to Apply
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 btn-secondary py-3 text-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <ApplyJobModal
                    job={job}
                    onClose={() => setShowApplyModal(false)}
                />
            )}
        </>
    );
};

export default JobDetailModal;