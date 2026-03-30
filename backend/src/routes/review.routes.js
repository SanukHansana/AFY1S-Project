// backend/src/routes/review.routes.js

import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// Public
router.get("/", getReviews);
router.get("/:id", getReview);

// Protected
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;