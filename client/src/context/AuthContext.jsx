import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login, logout, register } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = () => {
            const userData = getCurrentUser();
            setUser(userData);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const data = await login(email, password);
            setUser(data.user);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    const handleRegister = async (userData) => {
        try {
            const data = await register(userData);
            return data;
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout, handleRegister }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
