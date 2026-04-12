//backend/src/controllers/jobController.js
import * as jobService from "../services/job.service.js";
import { convertCurrency } from "../services/exchangeRate.service.js";

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 3000;
const MAX_CATEGORY_LENGTH = 80;
const MAX_LOCATION_LENGTH = 120;
const MAX_IMAGE_DATA_LENGTH = 1100000;
const BUDGET_PATTERN = /^\d+(\.\d{1,2})?$/;
const IMAGE_DATA_URL_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
const IMAGE_URL_PATTERN = /^https?:\/\/\S+$/i;
const JOB_TYPES = ["Remote", "On-site", "Hybrid"];
const JOB_STATUSES = ["open", "applied", "in-progress", "completed", "cancelled"];

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

const isValidJobImage = (value) =>
  IMAGE_DATA_URL_PATTERN.test(value) || IMAGE_URL_PATTERN.test(value);

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDateString = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const validateAndSanitizeJobPayload = (
  payload,
  { isCreate = false, currentJob = null } = {}
) => {
  const errors = [];
  const sanitized = {};

  if (isCreate || hasOwn(payload, "title")) {
    const title = String(payload.title ?? "").trim();

    if (!title) {
      errors.push("Job title is required");
    } else if (title.length > MAX_TITLE_LENGTH) {
      errors.push(`Job title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    } else {
      sanitized.title = title;
    }
  }

  if (isCreate || hasOwn(payload, "description")) {
    const description = String(payload.description ?? "").trim();

    if (!description) {
      errors.push("Job description is required");
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
      );
    } else {
      sanitized.description = description;
    }
  }

  if (isCreate || hasOwn(payload, "category")) {
    const category = String(payload.category ?? "").trim();

    if (category.length > MAX_CATEGORY_LENGTH) {
      errors.push(`Category cannot exceed ${MAX_CATEGORY_LENGTH} characters`);
    } else {
      sanitized.category = category || "General";
    }
  }

  if (isCreate || hasOwn(payload, "budget")) {
    const budgetText = String(payload.budget ?? "").trim();
    const budget = Number(budgetText);

    if (payload.budget === "" || payload.budget === null || payload.budget === undefined) {
      errors.push("Budget is required");
    } else if (!BUDGET_PATTERN.test(budgetText)) {
      errors.push("Budget must contain only numbers with up to 2 decimal places");
    } else if (!Number.isFinite(budget) || budget < 0) {
      errors.push("Budget must be a valid non-negative number");
    } else {
      sanitized.budget = budget;
    }
  }

  if (isCreate || hasOwn(payload, "skillsRequired")) {
    const skillsRequired = payload.skillsRequired ?? [];

    if (!Array.isArray(skillsRequired)) {
      errors.push("Skills required must be provided as a list");
    } else {
      sanitized.skillsRequired = Array.from(
        new Set(
          skillsRequired
            .map((skill) => String(skill).trim())
            .filter(Boolean)
        )
      );
    }
  }

  if (hasOwn(payload, "image")) {
    const image = String(payload.image ?? "").trim();

    if (!image) {
      sanitized.image = "";
    } else if (image.length > MAX_IMAGE_DATA_LENGTH) {
      errors.push("Job image is too large");
    } else if (!isValidJobImage(image)) {
      errors.push("Job image must be a valid uploaded image");
    } else {
      sanitized.image = image;
    }
  }

  if (isCreate || hasOwn(payload, "deadline")) {
    if (payload.deadline === null || payload.deadline === "") {
      errors.push("Deadline is required");
    } else {
      const dateString = normalizeDateString(payload.deadline);

      if (!dateString) {
        errors.push("Deadline must be a valid date");
      } else if (dateString < getTodayDateString()) {
        errors.push("Deadline must be today or a future date");
      } else {
        sanitized.deadline = dateString;
      }
    }
  }

  if (hasOwn(payload, "jobType")) {
    if (!JOB_TYPES.includes(payload.jobType)) {
      errors.push("Job type must be Remote, On-site, or Hybrid");
    } else {
      sanitized.jobType = payload.jobType;
    }
  } else if (isCreate) {
    sanitized.jobType = "Remote";
  }

  if (isCreate || hasOwn(payload, "location")) {
    const location = String(payload.location ?? "").trim();

    if (location.length > MAX_LOCATION_LENGTH) {
      errors.push(`Location cannot exceed ${MAX_LOCATION_LENGTH} characters`);
    } else {
      sanitized.location = location;
    }
  }

  if (!isCreate && hasOwn(payload, "status")) {
    if (!JOB_STATUSES.includes(payload.status)) {
      errors.push("Status is not valid for this job");
    } else {
      sanitized.status = payload.status;
    }
  }

  const effectiveJobType = hasOwn(payload, "jobType")
    ? sanitized.jobType
    : currentJob?.jobType || "Remote";
  const effectiveLocation = hasOwn(payload, "location")
    ? sanitized.location
    : currentJob?.location || "";

  if (
    ["On-site", "Hybrid"].includes(effectiveJobType) &&
    !String(effectiveLocation ?? "").trim()
  ) {
    errors.push("Location is required for on-site and hybrid jobs");
  }

  return { errors, sanitized };
};

// Create Job (Client/Employer)
export const createJob = async (req, res, next) => {
  try {
    // req.user comes from protect middleware (jwt payload: { id, role })
    const employerId = req.user.id;
    const { errors, sanitized } = validateAndSanitizeJobPayload(req.body, {
      isCreate: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    const job = await jobService.createJob({
      ...sanitized,
      employerId,
      status: "open",
      freelancerId: null,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};



// Get All Jobs (Public with filters + pagination)
export const getJobs = async (req, res, next) => {
  try {
    const filter = {};

    // filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.jobType) filter.jobType = req.query.jobType;
    if (req.query.location)
      filter.location = { $regex: req.query.location, $options: "i" };

    // skill filter: ?skill=react  (matches skillsRequired array)
    if (req.query.skill) {
      filter.skillsRequired = { $in: [req.query.skill] };
    }

    // search: ?search=designer (text index + fallback regex)
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const result = await jobService.getJobs(filter, req.query);

    //currency conversion (optional)
    const targetCurrency = req.query.currency; // ex: LKR, EUR
    if (!targetCurrency) {
      return res.status(200).json(result);
    }

    // Convert each job's USD budget -> target currency
    const convertedJobs = await Promise.all(
      result.jobs.map(async (job) => {
        const conversion = await convertCurrency({
          amount: job.budget,
          from: "USD",
          to: targetCurrency,
        });

        return {
          ...job.toObject(),
          budgetConverted: {
            currency: targetCurrency,
            amount: conversion.convertedAmount,
            rate: conversion.rate,
            fetchedAt: conversion.fetchedAt,
            cached: conversion.cached,
          },
        };
      })
    );

    res.status(200).json({
      ...result,
      jobs: convertedJobs,
      conversionBase: "USD",
      conversionTarget: targetCurrency,
    });
  } catch (err) {
    next(err);
  }
};





// Get Single Job
export const getJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const targetCurrency = req.query.currency; // optional
    if (!targetCurrency) return res.json(job);

    const conversion = await convertCurrency({
      amount: job.budget,
      from: "USD",
      to: targetCurrency,
    });

    res.json({
      ...job.toObject(),
      budgetConverted: {
        currency: targetCurrency,
        amount: conversion.convertedAmount,
        rate: conversion.rate,
        fetchedAt: conversion.fetchedAt,
        cached: conversion.cached,
      },
      conversionBase: "USD",
    });
  } catch (err) {
    next(err);
  }
};

// Update Job (Owner employer or Admin)
export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const isOwner = job.employerId?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // prevent changing employerId directly
    const { employerId, applicants, freelancerId, ...safeBody } = req.body;
    const { errors, sanitized } = validateAndSanitizeJobPayload(safeBody, {
      currentJob: job,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    const updated = await jobService.updateJob(req.params.id, sanitized);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete Job (Owner employer or Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const isOwner = job.employerId?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await jobService.deleteJob(req.params.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Freelancer apply to a job (Freelancer only)
export const applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const freelancerUserId = req.user.id;

    const updated = await jobService.applyToJob(jobId, freelancerUserId);

    if (!updated) return res.status(404).json({ message: "Job not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Employer hires a freelancer (Owner employer only, or Admin)
export const hireFreelancer = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const { freelancerId } = req.body;

    const job = await jobService.getJobById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const isOwner = job.employerId?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await jobService.hireFreelancer(jobId, freelancerId);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
