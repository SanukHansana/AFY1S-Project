import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { createJob, getJobById, updateJob } from "../services/jobService";

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 3000;
const MAX_CATEGORY_LENGTH = 80;
const MAX_LOCATION_LENGTH = 120;
const BUDGET_INPUT_PATTERN = /^\d*(\.\d{0,2})?$/;
const BUDGET_VALUE_PATTERN = /^\d+(\.\d{1,2})?$/;

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

const getTodayDateString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

const sanitizeSkills = (value) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    )
  );

const preventInvalidBudgetKeys = (event) => {
  if (["-", "+", "e", "E"].includes(event.key)) {
    event.preventDefault();
  }
};

const validateJobForm = (form) => {
  const title = form.title.trim();
  const description = form.description.trim();
  const category = form.category.trim();
  const location = form.location.trim();
  const budgetText = form.budget.trim();
  const todayDate = getTodayDateString();
  const fieldErrors = {};
  const skillsRequired = sanitizeSkills(form.skillsRequired);

  if (!title) {
    fieldErrors.title = "Job title is required";
  } else if (title.length > MAX_TITLE_LENGTH) {
    fieldErrors.title = `Job title cannot exceed ${MAX_TITLE_LENGTH} characters`;
  }

  if (!description) {
    fieldErrors.description = "Job description is required";
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (category.length > MAX_CATEGORY_LENGTH) {
    fieldErrors.category = `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters`;
  }

  const budgetValue = Number(budgetText);

  if (budgetText === "") {
    fieldErrors.budget = "Budget is required";
  } else if (!BUDGET_VALUE_PATTERN.test(budgetText)) {
    fieldErrors.budget = "Budget must contain only numbers with up to 2 decimal places";
  } else if (!Number.isFinite(budgetValue) || budgetValue < 0) {
    fieldErrors.budget = "Budget must be a valid non-negative number";
  }

  if (!["Remote", "On-site", "Hybrid"].includes(form.jobType)) {
    fieldErrors.jobType = "Please select a valid job type";
  }

  if (location.length > MAX_LOCATION_LENGTH) {
    fieldErrors.location = `Location cannot exceed ${MAX_LOCATION_LENGTH} characters`;
  } else if (form.jobType !== "Remote" && !location) {
    fieldErrors.location = "Location is required for on-site and hybrid jobs";
  }

  if (!form.deadline) {
    fieldErrors.deadline = "Deadline is required";
  } else if (form.deadline < todayDate) {
    fieldErrors.deadline = "Deadline must be today or a future date";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return {
    fieldErrors: {},
    payload: {
      title,
      description,
      category: category || "General",
      budget: budgetValue,
      skillsRequired,
      deadline: form.deadline,
      jobType: form.jobType,
      location,
    },
  };
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [canManageJob, setCanManageJob] = useState(!isEditMode);
  const [jobStatus, setJobStatus] = useState("");
  const todayDate = getTodayDateString();
  const getInputClassName = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
      fieldErrors[fieldName]
        ? "border-red-300 bg-red-50 text-red-900 placeholder:text-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-300 focus:border-pink-400 focus:ring-pink-100"
    }`;
  const getFieldMessageClassName = (fieldName) =>
    `mt-1 text-xs ${fieldErrors[fieldName] ? "text-red-600" : "text-gray-500"}`;

  useEffect(() => {
    if (!isEditMode) {
      setPageLoading(false);
      setCanManageJob(true);
      setForm(initialForm);
      setFieldErrors({});
      setHasSubmitted(false);
      setMessage("");
      setJobStatus("");
      return;
    }

    const loadJobForEdit = async () => {
      try {
        setPageLoading(true);
        setMessage("");
        setFieldErrors({});
        setHasSubmitted(false);
        setCanManageJob(false);

        const job = await getJobById(id);
        const isOwner =
          user?.role === "admin" || job.employerId?._id === userId;

        if (!isOwner) {
          setMessage("You can only edit jobs you created.");
          return;
        }

        setForm(mapJobToForm(job));
        setFieldErrors({});
        setHasSubmitted(false);
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
    const { name, value } = e.target;
    const nextValue =
      name === "budget" && value !== "" && !BUDGET_INPUT_PATTERN.test(value)
        ? null
        : value;

    if (nextValue === null) {
      return;
    }

    const nextForm = {
      ...form,
      [name]: nextValue,
    };

    setForm(nextForm);
    setMessage("");

    if (hasSubmitted) {
      setFieldErrors(validateJobForm(nextForm).fieldErrors);
      return;
    }

    setFieldErrors((prev) => {
      if (!prev[name] && !(name === "jobType" && prev.location)) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];

      if (name === "jobType") {
        delete nextErrors.location;
      }

      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const { fieldErrors: nextFieldErrors, payload } = validateJobForm(form);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setFieldErrors({});

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

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5">
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
                maxLength={MAX_TITLE_LENGTH}
                aria-invalid={Boolean(fieldErrors.title)}
                aria-describedby="title-message"
                className={getInputClassName("title")}
              />
              <p id="title-message" className={getFieldMessageClassName("title")}>
                {fieldErrors.title || `Up to ${MAX_TITLE_LENGTH} characters`}
              </p>
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
                maxLength={MAX_DESCRIPTION_LENGTH}
                aria-invalid={Boolean(fieldErrors.description)}
                aria-describedby="description-message"
                className={getInputClassName("description")}
              />
              <p
                id="description-message"
                className={getFieldMessageClassName("description")}
              >
                {fieldErrors.description || `Up to ${MAX_DESCRIPTION_LENGTH} characters`}
              </p>
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
                  maxLength={MAX_CATEGORY_LENGTH}
                  aria-invalid={Boolean(fieldErrors.category)}
                  aria-describedby="category-message"
                  className={getInputClassName("category")}
                />
                <p
                  id="category-message"
                  className={getFieldMessageClassName("category")}
                >
                  {fieldErrors.category || `Optional, up to ${MAX_CATEGORY_LENGTH} characters`}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Budget (USD)
                </label>
                <input
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  onKeyDown={preventInvalidBudgetKeys}
                  placeholder="500"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={Boolean(fieldErrors.budget)}
                  aria-describedby="budget-message"
                  className={getInputClassName("budget")}
                />
                <p id="budget-message" className={getFieldMessageClassName("budget")}>
                  {fieldErrors.budget || "Required. Numbers only, up to 2 decimal places"}
                </p>
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
                  aria-invalid={Boolean(fieldErrors.jobType)}
                  aria-describedby="jobType-message"
                  className={getInputClassName("jobType")}
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <p id="jobType-message" className={getFieldMessageClassName("jobType")}>
                  {fieldErrors.jobType || "Select how this job will be carried out"}
                </p>
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
                  maxLength={MAX_LOCATION_LENGTH}
                  aria-invalid={Boolean(fieldErrors.location)}
                  aria-describedby="location-message"
                  className={getInputClassName("location")}
                />
                <p
                  id="location-message"
                  className={getFieldMessageClassName("location")}
                >
                  {fieldErrors.location ||
                    (form.jobType === "Remote"
                      ? `Optional, up to ${MAX_LOCATION_LENGTH} characters`
                      : "Required for on-site and hybrid jobs")}
                </p>
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
                  className={getInputClassName("skillsRequired")}
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
                  min={todayDate}
                  aria-invalid={Boolean(fieldErrors.deadline)}
                  aria-describedby="deadline-message"
                  className={getInputClassName("deadline")}
                />
                <p
                  id="deadline-message"
                  className={getFieldMessageClassName("deadline")}
                >
                  {fieldErrors.deadline || "Required. Deadline can be today or a future date only"}
                </p>
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
