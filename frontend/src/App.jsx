//frontend/src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotePage from './pages/NotePage'
import Skills from './pages/Skills.jsx'
import Courses from './pages/Courses.jsx'
import CourseForm from './pages/CourseForm.jsx'
import MyCourses from './pages/MyCourses.jsx'
import Register from './Components/RegisterPage'
import Login from './Components/LoginPage'
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
        <Route path='/my-courses' element={<MyCourses />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/reviews/dashboard" element={<AdminReviewDashboard />} />
        
        {/* Redirect old route to new route */}
        <Route path='/create-course' element={<Navigate to="/courses/new" replace />} />

      </Routes>
    </div>
  )
}

export default App
