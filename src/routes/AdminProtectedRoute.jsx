import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const { admin } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.user); 


  if (user) {
    return <Navigate to="/" replace />;
  }
  
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;