import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error(error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    const updateProfile = async (userData) => {
        try {
            const res = await api.put('/auth/profile', userData);
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Profile update failed' };
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const res = await api.post('/auth/profile/wishlist', { productId });
            const updatedUser = { ...user, wishlist: res.data.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to update wishlist' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, updateProfile, toggleWishlist }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
