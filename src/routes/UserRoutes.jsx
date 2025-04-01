import React from 'react'
import { Route, Routes } from 'react-router'
import Index from '../pages/users/Index'
import UserSignup from '../pages/users/UserSignup'
import UserLogin from '../pages/users/UserLogin'
import ProductDetail from '../pages/users/ProductDetail'
import Products from '../pages/users/Products'
import NotFound from '../pages/users/NotFound'
import ProtectedRoute from './ProtectedRoute'
import UserProfile from '../pages/users/UserProfile'
import OTPVerification from '../pages/users/OTPVerification'
import ForgotPassword from '../pages/users/ForgotPassword'
import ForgotOTP from '../pages/users/ForgotOTP'
import ResetPassword from '../pages/users/ResetPassword'
import ResetPasswordProtectedRoute from './ResetPasswordProtectedRoute'

import Cart from '../pages/users/Cart'
import Wishlist from '../pages/users/Wishlist'
import Checkout from '../pages/users/Checkout'
import OrderSuccess from '../pages/users/OrderSuccess'
import Orders from '../pages/users/Profile/Orders'
import Wallet from '../pages/users/Profile/Wallet'

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/otp-verification' element={<OTPVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/forgot-otp' element={<ForgotOTP />} />

        <Route element={<ResetPasswordProtectedRoute />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/products' element={<Products />} />
        <Route path='/*' element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>
      </Routes>
    </>
  )
}

export default UserRoutes