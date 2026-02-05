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
        return () => disconnectSocket();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userData = {
                    id: payload.id,
                    role: payload.role,
                    isAdmin: payload.isAdmin || false, 
                };

                // Merge with saved user data if exists
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    setUser({ ...parsed, ...userData });
                } else {
                    setUser(userData);
                }

                setIsAuthenticated(true);
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
                isAdmin: payload.isAdmin || false, 
                email,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            initializeSocket(payload.id);

            return { success: true, isAdmin: userData.isAdmin };
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
                isAdmin: payload.isAdmin || false, 
                email: data.email,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            initializeSocket(payload.id);

            return { success: true, isAdmin: userData.isAdmin };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
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
            isAdmin: user?.isAdmin || false, 
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
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};