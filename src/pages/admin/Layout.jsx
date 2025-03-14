// src/pages/admin/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout'; // Adjust the path as needed

function Layout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default Layout;