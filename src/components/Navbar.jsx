import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Menu, X, Bell, User, LogOut, CheckCircle, Shield } from 'lucide-react'; // Added Shield
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../lib/api';
import { subscribeToNotifications, getSocket } from '../lib/socket';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user, isAuthenticated, logout, isAdmin } = useAuth(); // Added isAdmin

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FETCH EXISTING NOTIFICATIONS ON MOUNT
    useEffect(() => {
        if (isAuthenticated && user?.role === 'employer') {
            fetchNotifications();
        }
    }, [isAuthenticated, user]);

    const fetchNotifications = async () => {
        try {
            const response = await notificationsApi.getMyNotifications();
            const notifs = response.data?.notifications || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    // Socket.IO for real-time notifications
    useEffect(() => {
        if (!isAuthenticated || !user || user?.role !== 'employer') return;

        subscribeToNotifications((data) => {
            const newNotif = data.notification || data;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            if (Notification.permission === 'granted') {
                new Notification('New Job Application', {
                    body: data.message || newNotif.message,
                    icon: '/vite.svg'
                });
            }
        });

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            const socket = getSocket();
            if (socket) {
                socket.off('new_notification');
            }
        };
    }, [isAuthenticated, user]);

    const markAsRead = async () => {
        try {
            const unreadNotifs = notifications.filter(n => !n.isRead);
            for (const notif of unreadNotifs) {
                await notificationsApi.markAsRead(notif._id);
            }
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking as read:', err);
        }
        setShowNotifications(false);
    };

    // Close mobile menu when clicking a link
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                        <Briefcase className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            JobBoard
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Find Jobs
                        </Link>

                        {isAuthenticated && user?.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Dashboard
                                </Link>
                                {/* ADMIN LINK - Only show if isAdmin */}
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center gap-1">
                                        <Shield className="h-4 w-4" />
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}

                        {isAuthenticated && user?.role === 'candidate' && (
                            <Link to="/candidate/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                My Applications
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                {/* Notifications Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                                    >
                                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                                            >
                                                <div className="p-4 border-b flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={markAsRead}
                                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(notif.createdAt).toLocaleTimeString()}
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

                                <div className="flex items-center space-x-2 lg:space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-gray-700 hidden lg:block capitalize text-sm">
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
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2">
                                    Log in
                                </Link>
                                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
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
                        className="md:hidden bg-white border-t shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <Link
                                to="/jobs"
                                onClick={handleLinkClick}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                Find Jobs
                            </Link>

                            {isAuthenticated && user?.role === 'employer' && (
                                <>
                                    <Link
                                        to="/employer/dashboard"
                                        onClick={handleLinkClick}
                                        className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    {/* ADMIN LINK MOBILE */}
                                    {isAdmin && (
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={handleLinkClick}
                                           className="px-3 py-3 rounded-lg text-base font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                                        >
                                            <Shield className="h-5 w-5" />
                                            Admin Panel
                                        </Link>
                                    )}
                                </>
                            )}

                            {isAuthenticated && user?.role === 'candidate' && (
                                <Link
                                    to="/candidate/dashboard"
                                    onClick={handleLinkClick}
                                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    My Applications
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <>
                                    {/* Mobile Notifications Summary */}
                                    <div className="px-3 py-3 border-t mt-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-gray-700">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        {notifications.slice(0, 3).map((notif, idx) => (
                                            <div key={idx} className="text-sm text-gray-600 py-2 pl-2 border-l-2 border-blue-200">
                                                {notif.message}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-3 py-3 text-gray-700 font-medium border-t">
                                        Signed in as <span className="capitalize text-blue-600">{user?.role}</span>
                                        {isAdmin && <span className="ml-2 text-purple-600">(Admin)</span>}
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            handleLinkClick();
                                        }}
                                        className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-2 border-t space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={handleLinkClick}
                                        className="block px-3 py-3 rounded-lg text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-center"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/login"
                                        onClick={handleLinkClick}
                                        className="block px-3 py-3 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;