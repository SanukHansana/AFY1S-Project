//frontend/src/Components/JobFilters.jsx
export default function JobFilters({
  filters,
  onChange,
  onSearch,
  onReset,
  currency,
  setCurrency,
}) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">Filter Jobs</h2>
        <p className="text-sm text-gray-500">
          Search jobs by keyword, skill, category, location, and status
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <input
          type="text"
          name="search"
          placeholder="Search jobs"
          value={filters.search}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />

        <input
          type="text"
          name="skill"
          placeholder="Skill"
          value={filters.skill}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />

        <select
          name="jobType"
          value={filters.jobType}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        >
          <option value="">All Job Types</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="applied">Applied</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        >
          <option value="">USD</option>
          <option value="LKR">LKR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onSearch}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
        >
          Apply Filters
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-gray-300 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}