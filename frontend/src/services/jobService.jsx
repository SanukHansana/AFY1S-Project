//frontend/src/services/jobService.jsx
const API_BASE = "http://localhost:5001/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getJobs = async (params = {}) => {
  const query = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== "" &&
      params[key] !== undefined &&
      params[key] !== null
    ) {
      query.append(key, params[key]);
    }
  });

  const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data;
};

export const getJobById = async (id, currency = "") => {
  const url = currency
    ? `${API_BASE}/jobs/${id}?currency=${currency}`
    : `${API_BASE}/jobs/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch job");
  }

  return data;
};

export const createJob = async (jobData) => {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create job");
  }

  return data;
};

export const updateJob = async (id, jobData) => {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update job");
  }

  return data;
};

export const deleteJob = async (id) => {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    throw new Error(data.message || "Failed to delete job");
  }

  return true;
};

export const applyToJob = async (id) => {
  const res = await fetch(`${API_BASE}/jobs/${id}/apply`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to apply to job");
  }

  return data;
};

export const hireFreelancer = async (id, freelancerId) => {
  const res = await fetch(`${API_BASE}/jobs/${id}/hire`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ freelancerId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to hire freelancer");
  }

  return data;
};