import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

// No auth for now
router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
