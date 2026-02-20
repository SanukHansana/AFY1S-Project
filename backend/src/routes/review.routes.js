import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import protect from "../middleware/authmiddleware.js";
import authorize from "../middleware/rolemiddleware.js";
import Review from "../models/review.model.js";

const router = express.Router();

// Public routes
router.get("/", getReviews);
router.get("/:id", getReview);

// Protected routes
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);

// Owner or admin can delete
router.delete("/:id", protect, deleteReview);

// If you want admin-only delete instead:
// router.delete("/:id", protect, authorize("admin"), deleteReview);

export default router;