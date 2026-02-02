import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Filter, X, Loader2 } from 'lucide-react';
import { jobsApi } from '../lib/api';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';

const JobsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalJobs: 0
    });

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        jobType: searchParams.get('jobType') || '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [filters, pagination.page]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const activeFilters = {
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
                page: pagination.page,
                limit: 9
            };

            const response = await jobsApi.getAll(activeFilters);

            // Handle your backend response structure
            if (response.data.jobs) {
                setJobs(response.data.jobs);
                setPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    totalJobs: response.data.totalJobs
                });
            } else {
                setJobs(response.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // Mock data for testing
            setJobs([
                {
                    _id: '1',
                    title: 'Senior Frontend Developer',
                    description: 'We are looking for an experienced React developer...',
                    companyName: 'TechCorp',
                    employerId: { companyName: 'TechCorp' },
                    location: 'Remote',
                    jobType: 'full-time',
                    salaryRange: { min: 120000, max: 150000 },
                    requirements: ['React', 'TypeScript', 'Node.js'],
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change

        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        setFilters({ keyword: '', location: '', jobType: '' });
        setSearchParams({});
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatSalary = (salaryRange) => {
        if (!salaryRange) return 'Negotiable';
        const { min, max } = salaryRange;
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `From $${min.toLocaleString()}`;
        if (max) return `Up to $${max.toLocaleString()}`;
        return 'Negotiable';
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
                    <p className="text-gray-600 mb-6">{pagination.totalJobs} jobs available</p>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Job title or keywords"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center space-x-2 px-6 py-2.5 border rounded-lg transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                <select
                                    value={filters.jobType}
                                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div className="md:col-span-3 flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Clear all filters</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    salaryFormatted={formatSalary(job.salaryRange)}
                                    onClick={() => setSelectedJob(job)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8 flex justify-center space-x-2">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-600">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    salaryFormatted={formatSalary(selectedJob.salaryRange)}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    );
};

export default JobsPage;