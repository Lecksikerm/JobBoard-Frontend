import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, User, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'employer'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { success, error: showError } = useToast();
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        fullName: '',
        name: '',
        companyName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;

        if (isLogin) {
            result = await login(formData.email, formData.password, activeTab);
        } else {
            const data = activeTab === 'employer' ? {
                name: formData.name,
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password,
            } : {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
            };

            result = await register(data, activeTab);
        }

        setLoading(false);

        if (result.success) {
            success(`Welcome${isLogin ? ' back' : ''}! Logged in as ${activeTab}`);
            navigate(activeTab === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
        } else {
            showError(result.error || 'Authentication failed');
            setError(result.error);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12 px-4">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-primary-600 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-primary-100">
                            {isLogin ? 'Sign in to your account' : 'Join thousands of professionals'}
                        </p>
                    </div>

                    <div className="p-6">
                        {/* Role Selection Tabs */}
                        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('candidate')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'candidate'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                <span>Candidate</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('employer')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'employer'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Building2 className="h-4 w-4" />
                                <span>Employer</span>
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Employer Name - Register Only */}
                            {!isLogin && activeTab === 'employer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}

                            {/* Company Name - Employer Register Only */}
                            {!isLogin && activeTab === 'employer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="companyName"
                                            required
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Full Name - Candidate Register Only */}
                            {!isLogin && activeTab === 'candidate' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        minLength="6"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                )}
                            </button>
                        </form>

                        {/* Toggle Login/Register */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-primary-600 font-semibold hover:text-primary-700"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>

                        {/* Back to Home */}
                        <div className="mt-4 text-center">
                            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;