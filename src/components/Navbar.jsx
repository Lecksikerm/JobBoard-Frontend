import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Menu, X, Bell, User, LogOut, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { subscribeToNotifications, getSocket } from '../lib/socket';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Socket.IO Notifications
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Subscribe to real-time notifications
        subscribeToNotifications((data) => {
            console.log('New notification received:', data);

            // Add to notifications list
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Optional: Show browser notification if permitted
            if (Notification.permission === 'granted') {
                new Notification('New Job Application', {
                    body: data.message,
                    icon: '/vite.svg' // or your logo
                });
            }
        });

        // Request browser notification permission (optional)
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Cleanup on unmount
        return () => {
            const socket = getSocket();
            if (socket) {
                socket.off('new_notification');
            }
        };
    }, [isAuthenticated, user]);

    const markAsRead = () => {
        setUnreadCount(0);
        setShowNotifications(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Briefcase className="h-8 w-8 text-primary-600" />
                        <span className="text-2xl font-bold gradient-text">JobBoard</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/jobs" className="text-gray-600 hover:text-primary-600 font-medium">Find Jobs</Link>

                        {isAuthenticated && user?.role === 'employer' && (
                            <Link to="/employer/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                                Dashboard
                            </Link>
                        )}

                        {isAuthenticated && user?.role === 'candidate' && (
                            <Link to="/candidate/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                                My Applications
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Notifications Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                                    >
                                        <Bell className="h-6 w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                                            >
                                                <div className="p-4 border-b flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={markAsRead}
                                                            className="text-xs text-primary-600 hover:text-primary-700"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <p className="p-4 text-center text-gray-500 text-sm">No notifications yet</p>
                                                    ) : (
                                                        notifications.map((notif, idx) => (
                                                            <div key={idx} className="p-4 border-b hover:bg-gray-50 transition-colors">
                                                                <div className="flex items-start space-x-3">
                                                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <CheckCircle className="h-4 w-4 text-primary-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date().toLocaleTimeString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <span className="font-medium text-gray-700 hidden lg:block capitalize">
                                            {user?.role}
                                        </span>
                                    </div>

                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="btn-secondary">Log in</Link>
                                <Link to="/login" className="btn-primary">Sign up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-effect border-t"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50">
                                Find Jobs
                            </Link>

                            {isAuthenticated && user?.role === 'employer' && (
                                <Link to="/employer/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50">
                                    Dashboard
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <>
                                    {/* Mobile Notifications */}
                                    <div className="px-3 py-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        {notifications.slice(0, 3).map((notif, idx) => (
                                            <div key={idx} className="text-sm text-gray-600 py-1 pl-2 border-l-2 border-primary-200">
                                                {notif.message}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-3 py-2 text-gray-700 font-medium border-t">
                                        Signed in as <span className="capitalize">{user?.role}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 font-semibold">
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;