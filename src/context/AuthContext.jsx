import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';
import { initializeSocket, disconnectSocket } from '../lib/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();

        // Cleanup socket on unmount
        return () => {
            disconnectSocket();
        };
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode JWT to get user info (temporary solution until you add /auth/me endpoint)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userData = {
                    id: payload.id,
                    role: payload.role,
                };

                setUser(userData);
                setIsAuthenticated(true);

                // Initialize socket connection for real-time notifications
                initializeSocket(payload.id);

            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password, role) => {
        try {
            const loginFn = role === 'employer'
                ? authApi.loginEmployer
                : authApi.loginCandidate;

            const response = await loginFn({ email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData = {
                id: payload.id,
                role: payload.role,
                email,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);

            // Initialize socket connection for real-time notifications
            initializeSocket(payload.id);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (data, role) => {
        try {
            const registerFn = role === 'employer'
                ? authApi.registerEmployer
                : authApi.registerCandidate;

            const response = await registerFn(data);
            const { token } = response.data;

            localStorage.setItem('token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData = {
                id: payload.id,
                role: payload.role,
                email: data.email,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);

            // Initialize socket connection for real-time notifications
            initializeSocket(payload.id);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        // Disconnect socket before clearing auth data
        disconnectSocket();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            register,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};