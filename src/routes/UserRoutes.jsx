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


function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/otp-verification' element={<OTPVerification/>}/>
        
        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/products' element={<Products />} />
        <Route path='/*' element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<UserProfile />} />
          {/* <Route path='/wishlist' element={<WishList />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/dashboard' element={<UserDashboard />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default UserRoutes