import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { createJob, getJobById, updateJob } from "../services/jobService";

const initialForm = {
  title: "",
  description: "",
  category: "",
  budget: "",
  skillsRequired: "",
  deadline: "",
  jobType: "Remote",
  location: "",
};

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return new Date(value).toISOString().split("T")[0];
};

const mapJobToForm = (job) => ({
  title: job.title || "",
  description: job.description || "",
  category: job.category || "",
  budget: job.budget != null ? String(job.budget) : "",
  skillsRequired: Array.isArray(job.skillsRequired)
    ? job.skillsRequired.join(", ")
    : "",
  deadline: formatDateForInput(job.deadline),
  jobType: job.jobType || "Remote",
  location: job.location || "",
});

export default function CreateJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const userId = user?._id || user?.id;

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [canManageJob, setCanManageJob] = useState(!isEditMode);
  const [jobStatus, setJobStatus] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      setPageLoading(false);
      setCanManageJob(true);
      setForm(initialForm);
      setJobStatus("");
      return;
    }

    const loadJobForEdit = async () => {
      try {
        setPageLoading(true);
        setMessage("");
        setCanManageJob(false);

        const job = await getJobById(id);
        const isOwner =
          user?.role === "admin" || job.employerId?._id === userId;

        if (!isOwner) {
          setMessage("You can only edit jobs you created.");
          return;
        }

        setForm(mapJobToForm(job));
        setJobStatus(job.status || "open");
        setCanManageJob(true);
      } catch (error) {
        setMessage(error.message || "Failed to load job details");
      } finally {
        setPageLoading(false);
      }
    };

    loadJobForEdit();
  }, [id, isEditMode, user?.role, userId]);

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

    const budgetValue = Number(form.budget);

    if (Number.isNaN(budgetValue) || budgetValue < 0) {
      setMessage("Budget must be a valid non-negative number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || "General",
        budget: budgetValue,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        deadline: form.deadline || null,
        jobType: form.jobType,
        location: form.location.trim(),
      };

      const savedJob = isEditMode
        ? await updateJob(id, payload)
        : await createJob(payload);

      navigate(`/jobs/${savedJob._id}`);
    } catch (error) {
      setMessage(
        error.message || (isEditMode ? "Failed to update job" : "Failed to create job")
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <NavBar />

        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-purple-100 bg-white p-6 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-600">
              Loading job details...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  if (isEditMode && !canManageJob) {
    return (
      <>
        <NavBar />

        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-extrabold text-gray-900">Edit Job</h1>
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {message || "This job cannot be edited right now."}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/my-jobs")}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Back to My Jobs
              </button>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              {isEditMode ? "Job Management" : "Client Dashboard"}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              {isEditMode ? "Edit Job" : "Create Job"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditMode
                ? "Update the details of your posted job."
                : "Post a job so freelancers can apply."}
            </p>
            {isEditMode && (
              <p className="mt-2 text-sm font-medium text-gray-500">
                Current status: <span className="capitalize">{jobStatus || "open"}</span>
              </p>
            )}
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
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Job"
                    : "Create Job"}
              </button>

              <button
                type="button"
                onClick={() => navigate(isEditMode ? `/jobs/${id}` : "/jobs")}
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
