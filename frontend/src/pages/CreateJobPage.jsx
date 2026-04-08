//frontend/src/pages/CreateJobPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { createJob } from "../services/jobService";

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.budget) {
      setMessage("Title, description, and budget are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || "General",
        budget: Number(form.budget),
        skillsRequired: form.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        deadline: form.deadline || null,
        jobType: form.jobType,
        location: form.location.trim(),
      };

      const createdJob = await createJob(payload);
      navigate(`/jobs/${createdJob._id}`);
    } catch (error) {
      setMessage(error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              Client Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              Create Job
            </h1>
            <p className="mt-2 text-gray-600">
              Post a job so freelancers can apply.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Enter job description"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Web Development"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="500"
                  min="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Colombo / Remote"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Skills Required
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={form.skillsRequired}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate skills with commas
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Job"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}