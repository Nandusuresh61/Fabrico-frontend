import React from 'react'
import { Route, Routes } from 'react-router'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import ProductManagement from '../pages/admin/ProductManagement'
import UserManagement from '../pages/admin/UserManagement'
import Layout from '../pages/admin/Layout'
import CategoryManagement from '../pages/admin/CategoryManagement'
import BrandManagement from '../pages/admin/BrandManagement'

function AdminRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/' element={<Layout />}>
        {/* Fix: Add explicit path for Dashboard */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='products' element={<ProductManagement />} />
        <Route path='users' element={<UserManagement />} />
        <Route path='categories' element={<CategoryManagement />} />
        <Route path='brands' element={<BrandManagement />} />
      </Route>
      {/* Fix: Uncomment the Not Found route if needed */}
      {/* <Route path='/*' element={<NotFound redirectPageType={'admin'} />} /> */}
    </Routes>
  )
}

export default AdminRoutes
