import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ResetPasswordProtectedRoute = () => {
  const { forgotOtpVerified } = useSelector((state) => state.user);
  
  return forgotOtpVerified ? <Outlet /> : <Navigate to="/forgot-password" replace />;
};

export default ResetPasswordProtectedRoute; 