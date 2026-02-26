//backend/src/controllers/jobController.js
import * as jobService from "../services/job.service.js";
import Job from "../models/Job.js";
import { convertCurrency } from "../services/exchangeRate.service.js";
// Create Job (Client/Employer)
export const createJob = async (req, res, next) => {
  try {
    // req.user comes from protect middleware (jwt payload: { id, role })
    const employerId = req.user.id;

    const job = await jobService.createJob({
      ...req.body,
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

    // ✅ currency conversion (optional)
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

    const updated = await jobService.updateJob(req.params.id, safeBody);

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