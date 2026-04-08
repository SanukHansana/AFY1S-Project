import { useEffect, useState } from "react";
import JobCard from "../Components/JobCard";
import JobFilters from "../Components/JobFilters";
import { getJobs } from "../services/jobService";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

const initialFilters = {
  search: "",
  category: "",
  skill: "",
  location: "",
  jobType: "",
  status: "",
};

export default function JobsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [jobsData, setJobsData] = useState({ jobs: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("LKR");
  const [page, setPage] = useState(1);

  const fetchAllJobs = async (
    customPage = page,
    customFilters = filters,
    customCurrency = currency
  ) => {
    try {
      setLoading(true);
      setMessage("");

      const params = {
        ...customFilters,
        page: customPage,
        limit: 6,
      };

      if (customCurrency) {
        params.currency = customCurrency;
      }

      const data = await getJobs(params);
      setJobsData(data);
    } catch (error) {
      setMessage(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs(1, filters, currency);
  }, [currency]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    setPage(1);
    fetchAllJobs(1, filters, currency);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setCurrency("LKR");
    setPage(1);
    fetchAllJobs(1, initialFilters, "LKR");
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    fetchAllJobs(newPage, filters, currency);
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <span className="rounded-full border border-pink-200 bg-pink-50 px-4 py-1 text-sm font-semibold text-pink-700">
              Job Marketplace
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">
              Browse Jobs
            </h1>
            <p className="mt-2 text-gray-600">
              Find opportunities based on your skills and preferred work style
            </p>
          </div>

          <JobFilters
            filters={filters}
            onChange={handleChange}
            onSearch={handleSearch}
            onReset={handleReset}
            currency={currency}
            setCurrency={setCurrency}
          />

          {message && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {message}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-lg font-medium text-gray-600">
              Loading jobs...
            </div>
          ) : jobsData.jobs?.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {jobsData.jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {jobsData.pagination?.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    disabled={!jobsData.pagination?.hasPrev}
                    onClick={() => goToPage(page - 1)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                    Page {jobsData.pagination?.currentPage} of{" "}
                    {jobsData.pagination?.totalPages}
                  </span>

                  <button
                    disabled={!jobsData.pagination?.hasNext}
                    onClick={() => goToPage(page + 1)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
              No jobs found
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}