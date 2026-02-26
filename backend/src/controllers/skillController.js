//backend/src/controllers/skillController.js
import mongoose from "mongoose";
import Skill from "../models/Skill.js";

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

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

// Get Skill by ID
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid skill ID format");
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid skill ID format");
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid skill ID format");
    }

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
