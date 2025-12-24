import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, getMe } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            console.log('🔐 Attempting login for:', email);
            const data = await loginApi(email, password);
            console.log('✅ Login API response:', data);

            // Check response structure
            if (data.status !== 'berhasil') {
                throw new Error(data.pesan || 'Login gagal');
            }

            const accessToken = data.authorization?.token || data.access_token;
            console.log('🔑 Token received:', accessToken ? 'YES' : 'NO');

            if (!accessToken) {
                throw new Error('Token tidak ditemukan dalam response');
            }

            // Save token
            setToken(accessToken);
            localStorage.setItem('token', accessToken);
            console.log('💾 Token saved to localStorage');

            // Get user data
            let userData = data.user;
            console.log('👤 User data from login:', userData);

            if (!userData) {
                console.log('⚠️ No user data in login response, fetching from /me');
                userData = await getMe();
                console.log('👤 User data from /me:', userData);
            }

            if (!userData) {
                throw new Error('Data user tidak ditemukan');
            }

            // Save user
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Login successful! User:', userData.name, 'Role:', userData.role);

            return true;
        } catch (error) {
            console.error("❌ Login failed:", error);
            console.error("Error details:", error.response?.data);

            // Clean up on error
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            console.error('Logout API error (ignored):', e);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('👋 Logged out successfully');
        }
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
