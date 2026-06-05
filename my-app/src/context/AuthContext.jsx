import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (adminToken) {
          const response = await authAPI.verifyAdmin();
          setAdmin(response.data.admin);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.adminLogin({ email, password });
      localStorage.setItem('adminToken', response.data.token);
      setAdmin(response.data.admin);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    loading,
    error,
    isAdminLoggedIn: !!admin,
    adminLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
