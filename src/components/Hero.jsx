import { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to jobs page with search params
        window.location.href = `/jobs?search=${searchQuery}&location=${location}`;
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        🚀 Over 10,000+ jobs available
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Find Your <span className="gradient-text">Dream Job</span>
                        <br />Today
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Connect with top employers and opportunities. Upload your CV, apply with one click,
                        and get hired faster.
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-4"
                >
                    <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <Search className="h-5 w-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Job title or keywords"
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary flex items-center justify-center space-x-2 min-w-[140px]">
                        <Search className="h-5 w-5" />
                        <span>Search Jobs</span>
                    </button>
                </motion.form>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
                >
                    {[
                        { label: 'Active Jobs', value: '12,000+', icon: Briefcase },
                        { label: 'Companies', value: '2,500+', icon: Briefcase },
                        { label: 'Job Seekers', value: '50k+', icon: Briefcase },
                        { label: 'Daily Applications', value: '3,000+', icon: Briefcase },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;