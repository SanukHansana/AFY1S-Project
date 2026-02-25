import mongoose from "mongoose";
import Job from "../models/Job.js";

export const createJob = async (data) => {
  return await Job.create(data);
};

export const getJobs = async (filter, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const skip = (Number(page) - 1) * Number(limit);

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const jobs = await Job.find(filter)
    .populate("employerId", "name email role")
    .populate("freelancerId", "name email role")
    .skip(skip)
    .limit(Number(limit))
    .sort(sort);

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalJobs: total,
      hasNext: Number(page) * Number(limit) < total,
      hasPrev: Number(page) > 1,
    },
  };
};

export const getJobById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return await Job.findById(id)
    .populate("employerId", "name email role")
    .populate("freelancerId", "name email role")
    .populate("applicants", "name email role");
};

export const updateJob = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return await Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("employerId", "name email role")
    .populate("freelancerId", "name email role")
    .populate("applicants", "name email role");
};

export const deleteJob = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Job.findByIdAndDelete(id);
};

// Freelancer applies to job
export const applyToJob = async (jobId, freelancerUserId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) return null;

  const job = await Job.findById(jobId);
  if (!job) return null;

  // can't apply to closed workflows
  if (["completed", "cancelled"].includes(job.status)) {
    const err = new Error("Cannot apply to a completed/cancelled job");
    err.statusCode = 400;
    throw err;
  }

  // employer can't apply to own job
  if (job.employerId.toString() === freelancerUserId) {
    const err = new Error("Employer cannot apply to their own job");
    err.statusCode = 400;
    throw err;
  }

  // already hired someone
  if (job.freelancerId) {
    const err = new Error("This job already has a hired freelancer");
    err.statusCode = 400;
    throw err;
  }

  const alreadyApplied = job.applicants.some(
    (id) => id.toString() === freelancerUserId
  );

  if (!alreadyApplied) job.applicants.push(freelancerUserId);

  // if at least 1 applicant -> applied
  if (job.applicants.length > 0 && job.status === "open") {
    job.status = "applied";
  }

  await job.save();

  return await Job.findById(jobId)
    .populate("employerId", "name email role")
    .populate("freelancerId", "name email role")
    .populate("applicants", "name email role");
};

// Employer hires one applicant
export const hireFreelancer = async (jobId, freelancerId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) return null;
  if (!mongoose.Types.ObjectId.isValid(freelancerId)) return null;

  const job = await Job.findById(jobId);
  if (!job) return null;

  if (job.freelancerId) {
    const err = new Error("Freelancer already assigned to this job");
    err.statusCode = 400;
    throw err;
  }

  const isApplicant = job.applicants.some(
    (id) => id.toString() === freelancerId
  );

  if (!isApplicant) {
    const err = new Error("This freelancer has not applied to the job");
    err.statusCode = 400;
    throw err;
  }

  job.freelancerId = freelancerId;
  job.status = "in-progress";
  await job.save();

  return await Job.findById(jobId)
    .populate("employerId", "name email role")
    .populate("freelancerId", "name email role")
    .populate("applicants", "name email role");
};