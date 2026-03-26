//frontend/src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotePage from './pages/NotePage'
import Skills from './pages/Skills.jsx'
import Register from './Components/RegisterPage'



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/note' element={<NotePage />} />
        <Route path='/skills' element={<Skills />} />
        <Route path='/register' element={<Register />} />

      </Routes>
    </div>
  )
}

export default App
