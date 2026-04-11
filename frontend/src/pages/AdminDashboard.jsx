import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API_BASE_URL from "../config/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Use config for API URL
});

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const usersPerPage = 5;
  const token = localStorage.getItem("token");

  // Dark mode persistence
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch courses
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data?.jobs || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ── REVIEWS ──────────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Support both array and { data: [...] } shapes
      setReviews(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleUpdateReview = async () => {
    try {
      await API.put(
        `/reviews/${editingReview._id}`,
        {
          rating: editingReview.rating,
          comment: editingReview.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated");
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (activeTab === "courses") fetchCourses();
    if (activeTab === "jobs") fetchJobs();
    if (activeTab === "reviews") fetchReviews();
  }, [activeTab]);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Delete course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted");
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Delete job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await API.put(`/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User updated");
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  // Update course
  const handleUpdateCourse = async () => {
    try {
      await API.put(`/courses/${editingCourse._id}`, editingCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course updated");
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Update job
  const handleUpdateJob = async () => {
    try {
      await API.put(`/jobs/${editingJob._id}`, editingJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job updated");
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Filter
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Pagination
  const indexOfLast = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLast - usersPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Chart
  const chartData = {
    labels: ["Users", "Admins"],
    datasets: [
      {
        label: "Stats",
        data: [users.length, users.filter((u) => u.role === "admin").length],
        backgroundColor: ["#6366f1", "#8b5cf6"],
      },
    ],
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");

  // Redirect to login page
  window.location.href = "/";
};

  return (
    <div className={darkMode ? "dark" : ""}>
      <Toaster />

      <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-gray-900 dark:text-gray-100">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-[#020617] border-r border-[#e2e8f0] dark:border-[#1e293b] p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
              SkillConnect
            </h2>

            <nav className="space-y-2">
              {["dashboard", "users", "jobs", "courses", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition ${
                    activeTab === tab
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-[#1e293b]"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
                
              ))}
            </nav>
          </div>

         <div className="space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full bg-[#f1f5f9] dark:bg-[#1e293b] py-2 rounded-xl hover:opacity-80"
          >
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <header className="bg-white dark:bg-[#020617] border-b border-[#e2e8f0] dark:border-[#1e293b] px-6 py-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#f1f5f9] dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 placeholder-gray-500 px-4 py-2 rounded-xl w-80 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Admin</span>
              <div className="w-9 h-9 bg-indigo-500 rounded-full"></div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-6 space-y-6 overflow-y-auto">

            {loading && (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            )}

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { title: "Users", value: users.length },
                    { title: "Admins", value: users.filter((u) => u.role === "admin").length },
                    { title: "Jobs", value: jobs.length },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] p-6 rounded-2xl shadow-sm"
                    >
                      <p className="text-gray-600 dark:text-gray-400">{c.title}</p>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                        {c.value}
                      </h2>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] p-6 rounded-2xl shadow-sm">
                  <Bar data={chartData} />
                </div>
              </>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">👥 Users</h2>

                <div className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f1f5f9] dark:bg-[#1e293b] text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center p-4 text-gray-600 dark:text-gray-400">
                            No users found
                          </td>
                        </tr>
                      )}
                      {currentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-t border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => setEditingUser({ ...user })}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white/90 dark:bg-[#020617]/90 backdrop-blur-lg border border-gray-200 dark:border-[#1e293b] animate-fadeIn">
                      
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Edit User
                        </h2>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-400 hover:text-red-500 text-lg"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="name"
                          value={editingUser.name}
                          onChange={handleEditChange}
                          placeholder="Name"
                          className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />

                        <input
                          type="email"
                          name="email"
                          value={editingUser.email}
                          onChange={handleEditChange}
                          placeholder="Email"
                          className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />

                        <select
                          name="role"
                          value={editingUser.role}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        >
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                          <option value="freelancer">Freelancer</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-[#1e293b] dark:hover:bg-[#334155] text-gray-800 dark:text-gray-200 transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleUpdate}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGINATION */}
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1 ? "bg-indigo-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* JOBS */}
            {activeTab === "jobs" && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">💼 Jobs</h2>

                <div className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f1f5f9] dark:bg-[#1e293b] text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-4 text-left">Title</th>
                        <th className="p-4 text-left">Employer</th>
                        <th className="p-4 text-left">Budget</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Location</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center p-4 text-gray-600 dark:text-gray-400">No jobs found</td>
                        </tr>
                      )}
                      {jobs.map((job) => (
                        <tr key={job._id} className="border-t border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]">
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{job.title}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{job.employerId?.name || "No Employer"}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{job.budget} {job.baseCurrency}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{job.status}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{job.location}</td>
                          <td className="p-4 flex gap-3">
                            <button onClick={() => setEditingJob({ ...job, employerId: job.employerId?._id || null })} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Edit</button>
                            <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:text-red-700 dark:text-red-400">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingJob && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl w-96 space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Job</h2>
                      <input type="text" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" placeholder="Title" />
                      <textarea value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" placeholder="Description" />
                      <input type="number" value={editingJob.budget} onChange={(e) => setEditingJob({ ...editingJob, budget: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" placeholder="Budget" />
                      <input type="text" value={editingJob.location} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" placeholder="Location" />
                      <select value={editingJob.status} onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]">
                        <option value="open">Open</option>
                        <option value="applied">Applied</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setEditingJob(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        <button onClick={handleUpdateJob} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* COURSES */}
            {activeTab === "courses" && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">📚 Courses</h2>

                <div className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f1f5f9] dark:bg-[#1e293b] text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-4 text-left">Title</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-left">Skills</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center p-4 text-gray-600 dark:text-gray-400">No courses found</td>
                        </tr>
                      )}
                      {courses.map((course) => (
                        <tr key={course._id} className="border-t border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]">
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{course.title}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{course.description}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{course.skillId?.name || "No skill"}</td>
                          <td className="p-4 flex gap-3">
                            <button onClick={() => setEditingCourse({ ...course })} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Edit</button>
                            <button onClick={() => handleDeleteCourse(course._id)} className="text-red-500 hover:text-red-700 dark:text-red-400">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingCourse && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl w-96 space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Course</h2>
                      <input type="text" name="title" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" />
                      <textarea name="description" value={editingCourse.description} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" />
                      <input type="number" name="duration" value={editingCourse.duration} onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]" />
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setEditingCourse(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        <button
                          onClick={async () => {
                            try {
                              await API.put(
                                `/courses/${editingCourse._id}`,
                                { title: editingCourse.title, description: editingCourse.description, duration: editingCourse.duration, skillId: editingCourse.skillId?._id || editingCourse.skillId },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              toast.success("Course updated");
                              setEditingCourse(null);
                              fetchCourses();
                            } catch (err) {
                              console.error(err);
                              toast.error("Update failed");
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
            {activeTab === "reviews" && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">⭐ Reviews</h2>

                <div className="bg-white dark:bg-[#020617] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f1f5f9] dark:bg-[#1e293b] text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-4 text-left">Reviewer</th>
                        <th className="p-4 text-left">Rating</th>
                        <th className="p-4 text-left">Comment</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center p-4 text-gray-600 dark:text-gray-400">
                            No reviews found
                          </td>
                        </tr>
                      )}
                      {reviews.map((review) => (
                        <tr
                          key={review._id}
                          className="border-t border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {review.reviewerId?.name || review.reviewer?.name || "Anonymous"}
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </span>
                          </td>

                          <td className="p-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {review.comment}
                          </td>

                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => setEditingReview({ ...review })}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* EDIT REVIEW MODAL */}
                {editingReview && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl w-96 space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Review</h2>

                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Rating (1–5)</label>
                        <select
                          value={editingReview.rating}
                          onChange={(e) =>
                            setEditingReview({ ...editingReview, rating: Number(e.target.value) })
                          }
                          className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} {"★".repeat(n)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Comment</label>
                        <textarea
                          value={editingReview.comment}
                          onChange={(e) =>
                            setEditingReview({ ...editingReview, comment: e.target.value })
                          }
                          rows={4}
                          className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]"
                          placeholder="Review comment..."
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingReview(null)}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateReview}
                          className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* ─────────────────────────────────────────────────────────────────── */}

          </main>
        </div>
      </div>
    </div>
  );
}

