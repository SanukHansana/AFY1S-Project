//frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import Skills from "./pages/Skills.jsx";
import Courses from "./pages/Courses.jsx";
import CourseForm from "./pages/CourseForm.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import Register from "./Components/RegisterPage";
import AdminReviewDashboard from "./pages/review/AdminReviewDashboard";
import Login from "./Components/LoginPage";
import PrivateRoute from "./Components/PrivateRoute";
import RoleRoute from "./Components/RoleRoute";

// job page imports
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CreateJobPage from "./pages/CreateJobPage";
import MyJobsPage from "./pages/MyJobsPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/note" element={<NotePage />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/new" element={<CourseForm />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reviews/dashboard" element={<AdminReviewDashboard />} />
        <Route path="/login" element={<Login />} />

        {/* job routes */}
        <Route path="/jobs" element={<JobsPage />} />

        <Route
          path="/jobs/create"
          element={
            <RoleRoute allowedRoles={["client", "admin"]}>
              <CreateJobPage />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/:id/edit"
          element={
            <RoleRoute allowedRoles={["client", "admin"]}>
              <CreateJobPage />
            </RoleRoute>
          }
        />

        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        <Route
          path="/my-jobs"
          element={
            <PrivateRoute>
              <MyJobsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
