import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return currentUser && currentUser.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
