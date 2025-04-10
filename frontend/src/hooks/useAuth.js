import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    currentUser: auth.currentUser,
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    loading: auth.loading,
    error: auth.error,
    register: auth.register,
    login: auth.login,
    logout: auth.logout,
    updateProfile: auth.updateProfile
  };
};

export default useAuth;