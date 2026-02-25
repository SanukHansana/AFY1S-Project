import express from "express";
import protect from "../middleware/authmiddleware.js";
import authorize from "../middleware/rolemiddleware.js";

import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyToJob,
  hireFreelancer,
} from "../controllers/jobController.js";

const router = express.Router();

// Public
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected
// Create job: client/employer or admin (you can decide)
router.post("/", protect, authorize("client", "admin"), createJob);

// Update/Delete: owner check is inside controller (plus admin allowed)
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

// Apply: freelancer only
router.post("/:id/apply", protect, authorize("freelancer", "admin"), applyToJob);

// Hire: client/employer only (admin allowed)
router.post("/:id/hire", protect, authorize("client", "admin"), hireFreelancer);

export default router;