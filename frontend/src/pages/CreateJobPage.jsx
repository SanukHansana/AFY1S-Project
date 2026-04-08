//frontend/src/pages/CreateJobPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function CreateJobPage() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    skillsRequired: "",
    deadline: "",
    jobType: "Remote",
    location: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const job = await createJob(payload);
      alert("Job created successfully");
      navigate(`/jobs/${job._id}`);
    } catch (error) {
      setMessage(error.message || "Failed to create job");
    }
  };

  if (!user || (user.role !== "client" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center font-medium text-red-600">
          Only clients or admins can post jobs
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
            Client Area
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
            Post a New Job
          </h1>
          <p className="mt-2 text-gray-500">
            Create a job post and connect with freelancers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            required
          />

          <textarea
            name="description"
            placeholder="Job description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            rows="5"
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget in USD"
              value={formData.budget}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              required
            />

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <input
            type="text"
            name="skillsRequired"
            placeholder="Skills required (comma separated)"
            value={formData.skillsRequired}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Create Job
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}