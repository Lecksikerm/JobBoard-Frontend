import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <Briefcase className="h-8 w-8 text-primary-500" />
                            <span className="text-2xl font-bold text-white">JobBoard</span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6">
                            Connecting talented professionals with their dream careers.
                            Your next opportunity is just a click away.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">For Candidates</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/jobs" className="hover:text-primary-500 transition-colors">Browse Jobs</Link></li>
                            <li><Link to="/companies" className="hover:text-primary-500 transition-colors">Browse Companies</Link></li>
                            <li><Link to="/salary" className="hover:text-primary-500 transition-colors">Salary Guide</Link></li>
                            <li><Link to="/career-advice" className="hover:text-primary-500 transition-colors">Career Advice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/post-job" className="hover:text-primary-500 transition-colors">Post a Job</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary-500 transition-colors">Pricing</Link></li>
                            <li><Link to="/talent-search" className="hover:text-primary-500 transition-colors">Talent Search</Link></li>
                            <li><Link to="/ats" className="hover:text-primary-500 transition-colors">ATS Integration</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>support@jobboard.com</li>
                            <li>+1 (555) 123-4567</li>
                            <li>123 Career Street</li>
                            <li>San Francisco, CA 94102</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} JobBoard. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;