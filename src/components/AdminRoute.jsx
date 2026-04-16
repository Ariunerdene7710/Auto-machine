import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error('Та нэвтэрч орно уу');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Танд админ эрх байхгүй байна');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;