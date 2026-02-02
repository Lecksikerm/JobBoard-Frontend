import { motion } from 'framer-motion';
import { Building2, Users, Zap, ArrowRight } from 'lucide-react';

const EmployerCTA = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Looking to Hire Top Talent?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Post your job openings to millions of monthly users. Get quality applications
                            delivered straight to your dashboard with real-time notifications.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { icon: Users, label: '50k+ Active Users', desc: 'Monthly job seekers' },
                                { icon: Zap, label: 'Instant Alerts', desc: 'Real-time notifications' },
                                { icon: Building2, label: 'Top Companies', desc: 'Fortune 500 trust us' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <item.icon className="h-6 w-6 text-primary-200" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{item.label}</div>
                                        <div className="text-sm text-primary-200">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors inline-flex items-center space-x-2 shadow-lg">
                            <span>Post a Job for Free</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4">
                                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold">New Application Received!</div>
                                    <div className="text-sm text-primary-200">Senior Developer position</div>
                                </div>
                                <span className="ml-auto text-xs bg-green-400 text-white px-2 py-1 rounded-full">New</span>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-gray-900">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full"></div>
                                    <div>
                                        <div className="font-bold">Sarah Johnson</div>
                                        <div className="text-sm text-gray-500">Applied 2 minutes ago</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Experience:</span>
                                        <span className="font-medium">5 years</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Match Score:</span>
                                        <span className="font-medium text-green-600">95%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EmployerCTA;