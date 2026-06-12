import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, memberAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const memberToken = localStorage.getItem('memberToken');

        if (adminToken) {
          const response = await authAPI.verifyAdmin();
          setAdmin(response.data.admin);
        } else if (memberToken) {
          const response = await memberAPI.getProfile();
          setMember(response.data.member);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('memberToken');
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

  const memberLogin = async (fullName, phoneNumber) => {
    try {
      setError(null);
      const response = await memberAPI.login({ fullName, phoneNumber });
      localStorage.setItem('memberToken', response.data.token);
      setMember(response.data.member);
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
      localStorage.removeItem('memberToken');
      setAdmin(null);
      setMember(null);
    }
  };

  const value = {
    admin,
    member,
    loading,
    error,
    isAdminLoggedIn: !!admin,
    isMemberLoggedIn: !!member,
    adminLogin,
    memberLogin,
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
