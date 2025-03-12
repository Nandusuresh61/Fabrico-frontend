import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ProductManagement from './pages/admin/ProductManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import BrandManagement from './pages/admin/BrandManagement'


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/admin/login' element={<AdminLogin/>}/>
    <Route path='/admin/dashboard' element={<Dashboard/>}/>
    <Route path='/admin/users' element={<UserManagement/>}/>
    <Route path='/admin/products' element={<ProductManagement/>}/>
    <Route path='/admin/categories' element={<CategoryManagement/>}/>
    <Route path='/admin/brands' element={<BrandManagement/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App