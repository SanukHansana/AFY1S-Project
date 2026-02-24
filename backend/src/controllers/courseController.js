import mongoose from "mongoose";
import Course from "../models/Course.js";
import Skill from "../models/Skill.js";

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// Create Course with skillId validation
export const createCourse = async (req, res) => {
  try {
    const { title, description, skillId, duration } = req.body;

    // Validate skillId exists
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return sendResponse(res, 400, false, "Invalid skill ID format");
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return sendResponse(res, 404, false, "Skill not found");
    }

    // Check if course with same title already exists for this skill
    const existingCourse = await Course.findOne({ title, skillId });
    if (existingCourse) {
      return sendResponse(res, 400, false, "Course with this title already exists for this skill");
    }

    const course = new Course({
      title,
      description,
      skillId,
      duration
    });

    const savedCourse = await course.save();
    
    // Populate skill details for response
    const populatedCourse = await Course.findById(savedCourse._id).populate('skillId', 'name level category');
    
    sendResponse(res, 201, true, "Course created successfully", populatedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Get All Courses with populated skill details
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skillId = req.query.skillId;
    const search = req.query.search;

    // Build query
    const query = {};
    
    if (skillId) {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        return sendResponse(res, 400, false, "Invalid skill ID format");
      }
      query.skillId = skillId;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const courses = await Course.find(query)
      .populate('skillId', 'name level category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limit);

    sendResponse(res, 200, true, "Courses retrieved successfully", {
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Get Course by ID with populated skill details
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid course ID format");
    }

    const course = await Course.findById(id).populate('skillId', 'name level category description');

    if (!course) {
      return sendResponse(res, 404, false, "Course not found");
    }

    sendResponse(res, 200, true, "Course retrieved successfully", course);
  } catch (error) {
    console.error("Error fetching course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Update Course with skillId validation
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skillId, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid course ID format");
    }

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return sendResponse(res, 404, false, "Course not found");
    }

    // Validate skillId if provided
    if (skillId) {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        return sendResponse(res, 400, false, "Invalid skill ID format");
      }

      const skill = await Skill.findById(skillId);
      if (!skill) {
        return sendResponse(res, 404, false, "Skill not found");
      }

      // Check for duplicate title if title is being updated
      if (title && (title !== existingCourse.title || skillId !== existingCourse.skillId.toString())) {
        const duplicateCourse = await Course.findOne({ 
          title, 
          skillId, 
          _id: { $ne: id } 
        });
        if (duplicateCourse) {
          return sendResponse(res, 400, false, "Course with this title already exists for this skill");
        }
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description, skillId, duration },
      { new: true, runValidators: true }
    ).populate('skillId', 'name level category');

    sendResponse(res, 200, true, "Course updated successfully", updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid course ID format");
    }

    const course = await Course.findById(id);

    if (!course) {
      return sendResponse(res, 404, false, "Course not found");
    }

    await Course.findByIdAndDelete(id);

    sendResponse(res, 200, true, "Course deleted successfully", { id });
  } catch (error) {
    console.error("Error deleting course:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};
