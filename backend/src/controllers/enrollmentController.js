//backend/src/controllers/enrollmentController.js
import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/UserModels.js";
import { body, param, query, validationResult } from "express-validator";

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    return sendResponse(res, 400, false, "Validation failed", errorMessages);
  }
  next();
};

// Validation rules for enrolling in a course
export const validateEnrollInCourse = [
  body('courseId')
    .isMongoId()
    .withMessage('Invalid course ID format'),
  
  handleValidationErrors
];

// Validation rules for updating progress
export const validateUpdateProgress = [
  param('enrollmentId')
    .isMongoId()
    .withMessage('Invalid enrollment ID format'),
  
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be a number between 0 and 100'),
  
  handleValidationErrors
];

// Validation rules for completing a course
export const validateCompleteCourse = [
  param('enrollmentId')
    .isMongoId()
    .withMessage('Invalid enrollment ID format'),
  
  handleValidationErrors
];

// Validation rules for getting my courses
export const validateGetMyCourses = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Enrolled', 'Completed'])
    .withMessage('Status must be either Enrolled or Completed'),
  
  handleValidationErrors
];

// Validation rules for unenrolling from a course
export const validateUnenrollFromCourse = [
  param('enrollmentId')
    .isMongoId()
    .withMessage('Invalid enrollment ID format'),
  
  handleValidationErrors
];

// Validation rules for getting enrollment details
export const validateGetEnrollmentDetails = [
  param('enrollmentId')
    .isMongoId()
    .withMessage('Invalid enrollment ID format'),
  
  handleValidationErrors
];

// Enroll in Course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Get user from auth middleware

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return sendResponse(res, 404, false, "Course not found");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Check if user is already enrolled (business rule: User cannot enroll twice)
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return sendResponse(res, 400, false, "User is already enrolled in this course");
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      progress: 0,
      status: "Enrolled"
    });

    const savedEnrollment = await enrollment.save();
    
    // Populate course and user details for response
    const populatedEnrollment = await Enrollment.findById(savedEnrollment._id)
      .populate('courseId', 'title description duration')
      .populate('userId', 'name email');

    sendResponse(res, 201, true, "Successfully enrolled in course", populatedEnrollment);
  } catch (error) {
    console.error("Error enrolling in course:", error);
    
    // Handle duplicate key error (from unique index)
    if (error.code === 11000) {
      return sendResponse(res, 400, false, "User is already enrolled in this course");
    }
    
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Update Progress
export const updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id; // Get user from auth middleware

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return sendResponse(res, 404, false, "Enrollment not found");
    }

    // Business rule: Only enrolled user can update progress
    if (enrollment.userId.toString() !== userId) {
      return sendResponse(res, 403, false, "You can only update your own enrollment progress");
    }

    // Update progress and handle completion logic
    const updateData = { progress };
    
    // Business rule: If progress reaches 100, automatically set status to Completed and set completedAt
    if (progress === 100) {
      updateData.status = "Completed";
      updateData.completedAt = new Date();
    } else {
      // If progress is less than 100 and status was completed, reset to enrolled
      if (enrollment.status === "Completed") {
        updateData.status = "Enrolled";
        updateData.completedAt = null;
      }
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('courseId', 'title description duration')
     .populate('userId', 'name email');

    sendResponse(res, 200, true, "Progress updated successfully", updatedEnrollment);
  } catch (error) {
    console.error("Error updating progress:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Complete Course
export const completeCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id; // Get user from auth middleware

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return sendResponse(res, 404, false, "Enrollment not found");
    }

    // Business rule: Only enrolled user can complete course
    if (enrollment.userId.toString() !== userId) {
      return sendResponse(res, 403, false, "You can only complete your own enrolled course");
    }

    // Update enrollment to completed status
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        progress: 100,
        status: "Completed",
        completedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('courseId', 'title description duration')
     .populate('userId', 'name email');

    sendResponse(res, 200, true, "Course completed successfully", updatedEnrollment);
  } catch (error) {
    console.error("Error completing course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Get My Courses
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Get user from auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // Optional filter by status

    // Build query
    const query = { userId };
    
    if (status && ["Enrolled", "Completed"].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'courseId',
        select: 'title description duration',
        populate: {
          path: 'skillId',
          select: 'name level category'
        }
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalEnrollments = await Enrollment.countDocuments(query);
    const totalPages = Math.ceil(totalEnrollments / limit);

    sendResponse(res, 200, true, "Enrollments retrieved successfully", {
      enrollments,
      pagination: {
        currentPage: page,
        totalPages,
        totalEnrollments,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Unenroll from Course
export const unenrollFromCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id; // Get user from auth middleware

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return sendResponse(res, 404, false, "Enrollment not found");
    }

    // Business rule: Only enrolled user can unenroll
    if (enrollment.userId.toString() !== userId) {
      return sendResponse(res, 403, false, "You can only unenroll from your own enrolled course");
    }

    // Delete the enrollment
    await Enrollment.findByIdAndDelete(enrollmentId);

    sendResponse(res, 200, true, "Successfully unenrolled from course");
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Get Enrollment Details
export const getEnrollmentDetails = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id; // Get user from auth middleware

    // Find enrollment with populated course details
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('courseId', 'title description duration')
      .populate('courseId.skillId', 'name level category')
      .populate('userId', 'name email');

    if (!enrollment) {
      return sendResponse(res, 404, false, "Enrollment not found");
    }

    // Business rule: Only enrolled user can view their own enrollment details
    if (enrollment.userId.toString() !== userId) {
      return sendResponse(res, 403, false, "You can only view your own enrollment details");
    }

    sendResponse(res, 200, true, "Enrollment details retrieved successfully", enrollment);
  } catch (error) {
    console.error("Error fetching enrollment details:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};
