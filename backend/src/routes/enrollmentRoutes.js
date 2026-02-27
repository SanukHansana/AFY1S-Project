import express from "express";
import protect from "../middleware/authmiddleware.js";
import {
  enrollInCourse,
  updateProgress,
  completeCourse,
  getMyCourses,
  validateEnrollInCourse,
  validateUpdateProgress,
  validateCompleteCourse,
  validateGetMyCourses
} from "../controllers/enrollmentController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Enroll in a course
router.post("/enroll", validateEnrollInCourse, enrollInCourse);

// Get current user's enrollments
router.get("/my-courses", validateGetMyCourses, getMyCourses);

// Update progress for a specific enrollment
router.put("/:enrollmentId/progress", validateUpdateProgress, updateProgress);

// Complete a course
router.put("/:enrollmentId/complete", validateCompleteCourse, completeCourse);

export default router;
