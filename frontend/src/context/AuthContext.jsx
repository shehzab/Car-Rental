import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        setCurrentUser(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error loading user', err);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      // Save token and set current user
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.data);
      setError(null);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password
      });

      // Save token and set current user
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.data);
      setError(null);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/update-profile', profileData);
      
      // Update currentUser in context
      setCurrentUser(response.data.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);