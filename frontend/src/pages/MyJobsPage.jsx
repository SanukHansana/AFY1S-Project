//frontend/src/pages/MyJobsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteJob, getJobs } from "../services/jobService";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function MyJobsPage() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs({ limit: 100 });

      const userId = user?._id || user?.id;

      if (user?.role === "client" || user?.role === "admin") {
        setJobs(data.jobs.filter((job) => job.employerId?._id === userId));
      } else if (user?.role === "freelancer") {
        setJobs(
          data.jobs.filter((job) =>
            job.applicants?.some((applicant) => applicant?._id === userId)
          )
        );
      } else {
        setJobs([]);
      }
    } catch (error) {
      setMessage(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteJob(id);
      setMessage("Job deleted successfully");
      fetchMyJobs();
    } catch (error) {
      setMessage(error.message || "Failed to delete job");
    }
  };

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 py-12">
          <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center font-medium text-red-600">
            Please login first
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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              {user.role === "freelancer" ? "Applied Jobs" : "My Posted Jobs"}
            </h1>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-lg font-medium text-gray-600">
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {job.category || "General"} • {job.jobType || "Remote"}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Status: <span className="font-semibold">{job.status}</span> |
                        Applicants:{" "}
                        <span className="font-semibold">
                          {job.applicants?.length || 0}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                      >
                        View
                      </Link>

                      {(user.role === "client" || user.role === "admin") && (
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
              No jobs found
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}