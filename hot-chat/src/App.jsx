import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
