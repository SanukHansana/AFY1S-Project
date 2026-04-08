//frontend/src/pages/JobDetailsPage.jsx
import JobReviewSection from "../Components/reviews/JobReviewSection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import {
  applyToJob,
  getJobById,
  hireFreelancer,
  updateJob,
} from "../services/jobService";

export default function JobDetailsPage() {
  const { id } = useParams();

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

  const userId = user?._id || user?.id;

  const isFreelancer = user?.role === "freelancer";
  const isAdmin = user?.role === "admin";
  const canApplyRole = isFreelancer || isAdmin;

  const isClientOwner =
    user &&
    (user.role === "client" || user.role === "admin") &&
    (job.employerId?._id === userId || user.role === "admin");

  const alreadyApplied = job.applicants?.some(
    (applicant) => applicant._id === userId
  );

  const canApply =
    canApplyRole &&
    !alreadyApplied &&
    !job.freelancerId &&
    ["open", "applied"].includes(job.status) &&
    job.employerId?._id !== userId;

  const displayedBudget =
    job.budgetConverted?.amount != null
      ? `${job.budgetConverted.currency} ${job.budgetConverted.amount}`
      : `${job.baseCurrency || "USD"} ${job.budget}`;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-gray-500 mt-2">
                {job.category} • {job.jobType} • {job.location || "No location"}
              </p>
            </div>

            <div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="">USD</option>
                <option value="LKR">LKR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-center font-medium text-blue-600">
              {message}
            </p>
          )}

          <div className="mt-6">
            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
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
              <h2 className="text-lg font-bold mb-2">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.length > 0 ? (
                  job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
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
                className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {actionLoading ? "Applying..." : "Apply to Job"}
              </button>
            )}

            {canApplyRole && alreadyApplied && (
              <p className="mt-4 text-green-600 font-medium">
                You have already applied for this job
              </p>
            )}

            {canApplyRole &&
              !alreadyApplied &&
              ["in-progress", "completed", "cancelled"].includes(job.status) && (
                <p className="mt-4 text-red-500 font-medium">
                  You cannot apply because this job is {job.status}
                </p>
              )}
          </div>

          {isClientOwner && job.freelancerId && (
            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-3">Change Job Status</h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={actionLoading || job.status === "in-progress"}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Mark In Progress
                </button>

                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={actionLoading || job.status === "completed"}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={actionLoading || job.status === "cancelled"}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel Job
                </button>
              </div>
            </div>
          )}

          <hr className="my-8" />

          <h2 className="text-xl font-bold mb-4">Applicants</h2>

          {job.applicants?.length > 0 ? (
            <div className="space-y-4">
              {job.applicants.map((applicant) => (
                <div
                  key={applicant._id}
                  className="border rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4"
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
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
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-bold text-green-700">Assigned Freelancer</p>
                <p className="text-green-700">
                  {job.freelancerId.name} ({job.freelancerId.email})
                </p>
              </div>

              <JobReviewSection
                jobId={job._id}
                token={userToken}
              />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}