import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ProductManagement from './pages/admin/ProductManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import BrandManagement from './pages/admin/BrandManagement'
import { Settings } from './pages/admin/Settings'
import UserLogin from './pages/users/UserLogin'
import UserSignup from './pages/users/UserSignup'
import Index from './pages/users'
import Products from './pages/users/Products'
import UserProfile from './pages/users/UserProfile'
import ProductDetail from './pages/users/ProductDetail'
import ResetPassword from './pages/users/ResetPassword'
import OTPVerification from './pages/users/OTPVerification'
import ForgotPassword from './pages/users/ForgotPassword'
import NotFound from './pages/users/NotFound'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* UserRoutes */}
      <Route path='/' element={<Index />} />
      <Route path='/login' element={<UserLogin />} />
      <Route path='/signup' element={<UserSignup />} />
      <Route path='/products' element={<Products />} />
      <Route path='/profile' element={<UserProfile />} />
      <Route path='/productDetail' element={<ProductDetail />} />
      <Route path='/reset' element={<ResetPassword />} />
      <Route path='/otp' element={<OTPVerification />} />
      <Route path='/forgot' element={<ForgotPassword />} />
      <Route path='/notfound' element={<NotFound />} />
      {/* AdminRoutes */}
    <Route path='/admin/login' element={<AdminLogin/>}/>
    <Route path='/admin/dashboard' element={<Dashboard/>}/>
    <Route path='/admin/users' element={<UserManagement/>}/>
    <Route path='/admin/products' element={<ProductManagement/>}/>
    <Route path='/admin/categories' element={<CategoryManagement/>}/>
    <Route path='/admin/brands' element={<BrandManagement/>}/>
    <Route path='/admin/settings' element={<Settings/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App