//frontend/src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotePage from './pages/NotePage'
import Skills from './pages/Skills.jsx'
import Courses from './pages/Courses.jsx'
import CourseForm from './pages/CourseForm.jsx'
import Register from './Components/RegisterPage'
import AdminReviewDashboard from "./pages/review/AdminReviewDashboard";



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/note' element={<NotePage />} />
        <Route path='/skills' element={<Skills />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/courses/new' element={<CourseForm />} />
        <Route path='/register' element={<Register />} />
        <Route path="/reviews/dashboard" element={<AdminReviewDashboard />} />

      </Routes>
    </div>
  )
}

export default App
