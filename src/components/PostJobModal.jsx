import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus, Minus } from 'lucide-react';
import { jobsApi } from '../lib/api';

const PostJobModal = ({ job, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        salaryRange: '',
        requirements: [''],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                description: job.description || '',
                location: job.location || '',
                jobType: job.jobType || 'full-time',
                salaryRange: job.salaryRange ? `${job.salaryRange.min}-${job.salaryRange.max}` : '',
                requirements: job.requirements?.length > 0 ? job.requirements : [''],
            });
        }
    }, [job]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const addRequirement = () => {
        setFormData({ ...formData, requirements: [...formData.requirements, ''] });
    };

    const removeRequirement = (idx) => {
        const newReqs = formData.requirements.filter((_, i) => i !== idx);
        setFormData({ ...formData, requirements: newReqs });
    };

    const updateRequirement = (idx, value) => {
        const newReqs = formData.requirements.map((req, i) => i === idx ? value : req);
        setFormData({ ...formData, requirements: newReqs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                requirements: formData.requirements.filter(r => r.trim() !== ''),
            };

            if (job) {
                await jobsApi.update(job._id, data);
            } else {
                await jobsApi.create(data);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {job ? 'Edit Job' : 'Post New Job'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="e.g., Senior Frontend Developer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g., New York, NY or Remote"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                        <input
                            type="text"
                            name="salaryRange"
                            value={formData.salaryRange}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="e.g., 80000-120000 or 50000 (for exact amount)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter as min-max or single number</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                        <div className="space-y-2">
                            {formData.requirements.map((req, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => updateRequirement(idx, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g., 3+ years React experience"
                                    />
                                    {formData.requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(idx)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Requirement
                        </button>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary flex items-center justify-center space-x-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>{job ? 'Update Job' : 'Post Job'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PostJobModal;