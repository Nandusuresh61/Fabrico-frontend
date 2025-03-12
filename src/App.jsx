import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<AdminLogin/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App