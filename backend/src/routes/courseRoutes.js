import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";

const router = express.Router();

// Create a new course
router.post("/", createCourse);

// Get all courses with populated skill details and optional filtering
router.get("/", getAllCourses);

// Get a specific course by ID with populated skill details
router.get("/:id", getCourseById);

// Update a course by ID
router.put("/:id", updateCourse);

// Delete a course by ID
router.delete("/:id", deleteCourse);

export default router;
