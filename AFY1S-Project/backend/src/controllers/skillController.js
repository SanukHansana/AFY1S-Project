//backend/src/controllers/skillController.js
import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import { body, param, validationResult } from "express-validator";

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

// Validation rules for creating a skill
export const validateCreateSkill = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be either Beginner, Intermediate, or Advanced'),
  
  handleValidationErrors
];

// Create Skill
export const createSkill = async (req, res) => {
  try {
    const { name, description, category, level } = req.body;

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return sendResponse(res, 400, false, "Skill with this name already exists");
    }

    const skill = new Skill({
      name,
      description,
      category,
      level
    });

    const savedSkill = await skill.save();
    sendResponse(res, 201, true, "Skill created successfully", savedSkill);
  } catch (error) {
    console.error("Error creating skill:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Get All Skills with pagination and search by level
export const getAllSkills = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const level = req.query.level;
    const search = req.query.search;

    // Build query
    const query = {};
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const skills = await Skill.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalSkills = await Skill.countDocuments(query);
    const totalPages = Math.ceil(totalSkills / limit);

    sendResponse(res, 200, true, "Skills retrieved successfully", {
      skills,
      pagination: {
        currentPage: page,
        totalPages,
        totalSkills,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Validation rules for getting skill by ID
export const validateGetSkillById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID format'),
  
  handleValidationErrors
];

// Validation rules for updating a skill
export const validateUpdateSkill = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID format'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be either Beginner, Intermediate, or Advanced'),
  
  handleValidationErrors
];

// Validation rules for deleting a skill
export const validateDeleteSkill = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID format'),
  
  handleValidationErrors
];

// Get Skill by ID
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return sendResponse(res, 404, false, "Skill not found");
    }

    sendResponse(res, 200, true, "Skill retrieved successfully", skill);
  } catch (error) {
    console.error("Error fetching skill:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Update Skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, level } = req.body;

    // Check if skill exists
    const existingSkill = await Skill.findById(id);
    if (!existingSkill) {
      return sendResponse(res, 404, false, "Skill not found");
    }

    // Check if another skill with the same name exists (if name is being updated)
    if (name && name !== existingSkill.name) {
      const duplicateSkill = await Skill.findOne({ name, _id: { $ne: id } });
      if (duplicateSkill) {
        return sendResponse(res, 400, false, "Skill with this name already exists");
      }
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { name, description, category, level },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, true, "Skill updated successfully", updatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};

// Delete Skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return sendResponse(res, 404, false, "Skill not found");
    }

    await Skill.findByIdAndDelete(id);

    sendResponse(res, 200, true, "Skill deleted successfully", { id });
  } catch (error) {
    console.error("Error deleting skill:", error);
    sendResponse(res, 500, false, "Internal server error", error.message);
  }
};
