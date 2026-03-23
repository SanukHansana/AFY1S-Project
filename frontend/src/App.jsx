//frontend/src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotePage from './pages/NotePage'
import AdminReviewDashboard from "./pages/review/AdminReviewDashboard";



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/note' element={<NotePage />} />
        <Route path="/reviews/dashboard" element={<AdminReviewDashboard />} />

      </Routes>
    </div>
  )
}

export default App
