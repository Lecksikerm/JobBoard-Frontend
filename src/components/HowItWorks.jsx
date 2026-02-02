import { motion } from 'framer-motion';
import { UserPlus, Search, FileUp, Bell, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: 'Create Account',
        desc: 'Sign up as a candidate or employer in seconds',
        color: 'bg-blue-500'
    },
    {
        icon: Search,
        title: 'Find or Post Jobs',
        desc: 'Browse thousands of jobs or post your openings',
        color: 'bg-purple-500'
    },
    {
        icon: FileUp,
        title: 'Apply with CV',
        desc: 'Upload your resume and apply with one click',
        color: 'bg-pink-500'
    },
    {
        icon: Bell,
        title: 'Get Notified',
        desc: 'Employers receive instant application alerts',
        color: 'bg-orange-500'
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600">Simple steps to your next career move</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                    <CheckCircle className="h-8 w-8 text-primary-200" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;