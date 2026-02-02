import { MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job, salaryFormatted, onClick }) => {
    const companyName = job.employerId?.companyName || job.companyName || 'Unknown Company';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-2xl font-bold text-primary-600">
                    {companyName.charAt(0).toUpperCase()}
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full capitalize">
                    {job.jobType || 'Full-time'}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                {job.title}
            </h3>

            <div className="flex items-center text-gray-600 mb-3">
                <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{companyName}</span>
            </div>

            <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{salaryFormatted}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {(job.requirements || []).slice(0, 3).map((skill, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md truncate max-w-[100px]"
                    >
                        {skill}
                    </span>
                ))}
                {(job.requirements || []).length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{job.requirements.length - 3}
                    </span>
                )}
            </div>

            <button className="w-full py-2 rounded-lg bg-primary-50 text-primary-600 font-semibold text-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                View Details
            </button>
        </motion.div>
    );
};

export default JobCard;