import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import UserManagement from '../pages/admin/UserManagement';
import Layout from '../pages/admin/Layout';
import CategoryManagement from '../pages/admin/CategoryManagement';
import BrandManagement from '../pages/admin/BrandManagement';
import AdminProtectedRoute from './AdminProtectedRoute';
import OrderManagement from '../pages/admin/OrderManagement';
import OfferManagement from '../pages/admin/OfferManagement';
import CouponManagement from '../pages/admin/CouponManagement';
import SalesReport from '../pages/admin/SalesReport';

function AdminRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='products' element={<ProductManagement />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='categories' element={<CategoryManagement />} />
          <Route path='brands' element={<BrandManagement />} />
          <Route path='orders' element={<OrderManagement />} />
          <Route path='offers' element={<OfferManagement />} />
          <Route path='coupons' element={<CouponManagement />} />
          <Route path='sales' element={<SalesReport />} />
        </Route>
      </Route>
      
      
      <Route path='*' element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default AdminRoutes;