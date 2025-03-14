// src/routes/AdminProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const { admin } = useSelector((state) => state.admin); // Adjust based on your Redux store structure
  
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;