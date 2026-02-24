import express from "express";
import protect from "../middleware/authmiddleware.js";
import {
  enrollInCourse,
  updateProgress,
  completeCourse,
  getMyCourses
} from "../controllers/enrollmentController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Enroll in a course
router.post("/enroll", enrollInCourse);

// Get current user's enrollments
router.get("/my-courses", getMyCourses);

// Update progress for a specific enrollment
router.put("/:enrollmentId/progress", updateProgress);

// Complete a course
router.put("/:enrollmentId/complete", completeCourse);

export default router;
