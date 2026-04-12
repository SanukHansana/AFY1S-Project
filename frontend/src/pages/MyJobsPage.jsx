import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteJob, getJobs } from "../services/jobService";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import JobImageBanner from "../Components/JobImageBanner";

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const getEntityId = (entity) => {
  if (!entity) {
    return "";
  }

  if (typeof entity === "string") {
    return entity;
  }

  return entity._id || entity.id || "";
};

const decodeTokenPayload = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
};

const getCurrentUserSnapshot = (token) => {
  const storedUser = getStoredUser();
  const tokenPayload = decodeTokenPayload(token);
  const tokenUserId = tokenPayload?.id || tokenPayload?._id || "";
  const storedUserId = getEntityId(storedUser);
  const resolvedUserId = tokenUserId || storedUserId;
  const resolvedRole = tokenPayload?.role || storedUser?.role || "";

  if (!resolvedUserId && !resolvedRole && !storedUser) {
    return null;
  }

  return {
    ...storedUser,
    _id: storedUser?._id || resolvedUserId,
    id: storedUser?.id || resolvedUserId,
    role: resolvedRole,
  };
};

export default function MyJobsPage() {
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [currentUser, setCurrentUser] = useState(() =>
    getCurrentUserSnapshot(token)
  );

  const loadAllJobs = async () => {
    const firstPage = await getJobs({ page: 1, limit: 100 });
    const totalPages = firstPage.pagination?.totalPages || 1;

    if (totalPages <= 1) {
      return firstPage.jobs || [];
    }

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        getJobs({ page: index + 2, limit: 100 })
      )
    );

    return [
      ...(firstPage.jobs || []),
      ...remainingPages.flatMap((pageData) => pageData.jobs || []),
    ];
  };

  const filterJobsForUser = (allJobs, user) => {
    const userId = getEntityId(user);

    if (!userId) {
      return [];
    }

    if (user?.role === "client" || user?.role === "admin") {
      return allJobs.filter((job) => getEntityId(job.employerId) === userId);
    }

    if (user?.role === "freelancer") {
      return allJobs.filter((job) =>
        job.applicants?.some((applicant) => getEntityId(applicant) === userId)
      );
    }

    return [];
  };

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setMessage("");
      const activeUser = getCurrentUserSnapshot(token);

      setCurrentUser(activeUser);

      const allJobs = await loadAllJobs();
      setJobs(filterJobsForUser(allJobs, activeUser));
    } catch (error) {
      setJobs([]);
      setMessage(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteJob(id);
      setMessage("Job deleted successfully");
      await fetchMyJobs();
    } catch (error) {
      setMessage(error.message || "Failed to delete job");
    } finally {
      setDeletingId("");
    }
  };

  if (!token) {
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
              {currentUser?.role === "freelancer"
                ? "Applied Jobs"
                : "My Posted Jobs"}
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
                  className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm"
                >
                  <JobImageBanner
                    image={job.image}
                    title={job.title}
                    badge={job.jobType || "Remote"}
                    meta={`${job.category || "General"} | ${
                      job.location || "No location"
                    }`}
                    heightClass="h-40"
                  />

                  <div className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {job.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {job.category || "General"} | {job.jobType || "Remote"}
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

                        {(currentUser?.role === "client" ||
                          currentUser?.role === "admin") && (
                          <>
                            <Link
                              to={`/jobs/${job._id}/edit`}
                              className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-100"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(job._id)}
                              disabled={deletingId === job._id}
                              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === job._id ? "Deleting..." : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
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
