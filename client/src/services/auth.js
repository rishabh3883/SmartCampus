import API from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Store minimal user details
    }
    return data;
};

export const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
