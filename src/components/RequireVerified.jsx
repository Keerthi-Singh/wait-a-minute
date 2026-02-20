import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RequireVerified = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a loader

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated but not verified, send to verify flow
  if (user.email && user.emailVerified === false) {
    return <Navigate to="/auth/verify" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireVerified;
