import JobReviewSection from "../Components/reviews/JobReviewSection";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import JobImageBanner from "../Components/JobImageBanner";
import {
  applyToJob,
  deleteJob,
  getJobById,
  hireFreelancer,
  updateJob,
} from "../services/jobService";

const getEntityId = (entity) => {
  if (!entity) {
    return "";
  }

  if (typeof entity === "string") {
    return entity;
  }

  return entity._id || entity.id || "";
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const userToken = localStorage.getItem("token");

  const [job, setJob] = useState(null);
  const [currency, setCurrency] = useState("LKR");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await getJobById(id, currency);
      setJob(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [id, currency]);

  const handleApply = async () => {
    try {
      setActionLoading(true);
      await applyToJob(id);
      setMessage("Applied successfully");
      await fetchJob();
    } catch (error) {
      setMessage(error.message || "Failed to apply");
    } finally {
      setActionLoading(false);
    }
  };

  const handleHire = async (freelancerId) => {
    try {
      setActionLoading(true);
      await hireFreelancer(id, freelancerId);
      setMessage("Freelancer hired successfully");
      await fetchJob();
    } catch (error) {
      setMessage(error.message || "Failed to hire freelancer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setActionLoading(true);
      await updateJob(id, { status });
      setMessage(`Job status updated to ${status}`);
      await fetchJob();
    } catch (error) {
      setMessage(error.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteJob(id);
      navigate("/my-jobs");
    } catch (error) {
      setMessage(error.message || "Failed to delete job");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <p className="mt-10 text-center text-lg">Loading job details...</p>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <NavBar />
        <p className="mt-10 text-center text-red-500">Job not found</p>
        <Footer />
      </>
    );
  }

  const userId = getEntityId(user);

  const isFreelancer = user?.role === "freelancer";
  const isAdmin = user?.role === "admin";
  const canApplyRole = isFreelancer || isAdmin;

  const isClientOwner =
    user &&
    (user.role === "client" || user.role === "admin") &&
    (getEntityId(job.employerId) === userId || user.role === "admin");

  const alreadyApplied = job.applicants?.some(
    (applicant) => getEntityId(applicant) === userId
  );

  const canApply =
    canApplyRole &&
    !alreadyApplied &&
    !job.freelancerId &&
    ["open", "applied"].includes(job.status) &&
    getEntityId(job.employerId) !== userId;

  const displayedBudget =
    job.budgetConverted?.amount != null
      ? `${job.budgetConverted.currency} ${job.budgetConverted.amount}`
      : `${job.baseCurrency || "USD"} ${job.budget}`;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="mt-2 text-gray-500">
                {job.category} | {job.jobType} | {job.location || "No location"}
              </p>
            </div>

            <div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-lg border p-2"
              >
                <option value="">USD</option>
                <option value="LKR">LKR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {isClientOwner && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/jobs/${job._id}/edit`}
                className={`rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-100 ${
                  actionLoading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                Edit Job
              </Link>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Delete Job"}
              </button>
            </div>
          )}

          {message && (
            <p className="mt-4 text-center font-medium text-blue-600">
              {message}
            </p>
          )}

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <JobImageBanner
              image={job.image}
              title={job.title}
              badge={job.jobType || "Remote"}
              meta={`${job.category || "General"} | ${
                job.location || "No location"
              }`}
              heightClass="h-72"
            />
          </div>

          <div className="mt-6">
            <p className="mb-4 text-gray-700">{job.description}</p>

            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
              <p>
                <span className="font-semibold">Budget:</span> {displayedBudget}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {job.status}
              </p>
              <p>
                <span className="font-semibold">Employer:</span>{" "}
                {job.employerId?.name} ({job.employerId?.email})
              </p>
              <p>
                <span className="font-semibold">Deadline:</span>{" "}
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="mt-5">
              <h2 className="mb-2 text-lg font-bold">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.length > 0 ? (
                  job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </div>

            {canApply && (
              <button
                onClick={handleApply}
                disabled={actionLoading}
                className="mt-6 rounded-lg bg-green-500 px-5 py-2 text-white hover:bg-green-600 disabled:opacity-60"
              >
                {actionLoading ? "Applying..." : "Apply to Job"}
              </button>
            )}

            {canApplyRole && alreadyApplied && (
              <p className="mt-4 font-medium text-green-600">
                You have already applied for this job
              </p>
            )}

            {canApplyRole &&
              !alreadyApplied &&
              ["in-progress", "completed", "cancelled"].includes(job.status) && (
                <p className="mt-4 font-medium text-red-500">
                  You cannot apply because this job is {job.status}
                </p>
              )}
          </div>

          {isClientOwner && job.freelancerId && (
            <div className="mt-8 rounded-xl border border-purple-200 bg-purple-50 p-4">
              <h3 className="mb-3 text-lg font-bold">Change Job Status</h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={actionLoading || job.status === "in-progress"}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Mark In Progress
                </button>

                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={actionLoading || job.status === "completed"}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={actionLoading || job.status === "cancelled"}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  Cancel Job
                </button>
              </div>
            </div>
          )}

          <hr className="my-8" />

          <h2 className="mb-4 text-xl font-bold">Applicants</h2>

          {job.applicants?.length > 0 ? (
            <div className="space-y-4">
              {job.applicants.map((applicant) => (
                <div
                  key={applicant._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border p-4 md:flex-row"
                >
                  <div>
                    <p className="font-semibold">{applicant.name}</p>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm text-gray-500">{applicant.role}</p>
                  </div>

                  {isClientOwner && !job.freelancerId && (
                    <button
                      onClick={() => handleHire(applicant._id)}
                      disabled={actionLoading}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
                    >
                      {actionLoading ? "Processing..." : "Hire"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No applicants yet</p>
          )}

          {job.freelancerId && (
            <>
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="font-bold text-green-700">Assigned Freelancer</p>
                <p className="text-green-700">
                  {job.freelancerId.name} ({job.freelancerId.email})
                </p>
              </div>

              <JobReviewSection jobId={job._id} token={userToken} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
