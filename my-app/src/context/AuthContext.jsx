import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, memberAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth state on mount using cookies (no localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try verifying admin session via cookie
        const adminRes = await authAPI.verifyAdmin();
        if (adminRes.data?.success && adminRes.data?.admin) {
          setAdmin(adminRes.data.admin);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Admin cookie not valid or not present, try member
      }

      try {
        // Try verifying member session via cookie
        const memberRes = await memberAPI.getProfile();
        if (memberRes.data?.success && memberRes.data?.member) {
          setMember(memberRes.data.member);
        }
      } catch (err) {
        // No valid session - user is not logged in
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.adminLogin({ email, password });
      // Cookie is set automatically by the backend response (httpOnly)
      // We just store the admin data in state
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
      // Cookie is set automatically by the backend response (httpOnly)
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
      // Clear state - cookies are cleared by the backend
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
