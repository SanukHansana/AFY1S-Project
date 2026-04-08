//frontend/src/Components/JobCard.jsx
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const displayedBudget =
    job?.budgetConverted?.amount != null
      ? `${job.budgetConverted.currency} ${job.budgetConverted.amount}`
      : `${job.baseCurrency || "USD"} ${job.budget}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {job.category || "General"} • {job.jobType || "Remote"} •{" "}
              {job.location || "No location"}
            </p>
          </div>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold capitalize text-purple-700">
            {job.status}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">
          {job.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {job.skillsRequired?.length > 0 ? (
            job.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No skills listed</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Budget:</span> {displayedBudget}
          </p>
          <p>
            <span className="font-semibold">Applicants:</span>{" "}
            {job.applicants?.length || 0}
          </p>
          <p className="col-span-2">
            <span className="font-semibold">Employer:</span>{" "}
            {job.employerId?.name || "Unknown"}
          </p>
          <p className="col-span-2">
            <span className="font-semibold">Deadline:</span>{" "}
            {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="mt-5 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}