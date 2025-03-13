import React from 'react'
import { Route, Routes } from 'react-router'

function AdminRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/' element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='products' element={<Products />} />
        <Route path='users' element={<Users />} />
      </Route>
      <Route path='/*' element={<NotFound redirectPageType={'admin'} />} />
      {/* <Route path='/signup' element={<AdminSignUp/>} /> */}
    </Routes>
  )
}

export default AdminRoutes