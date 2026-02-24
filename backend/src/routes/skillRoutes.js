import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill
} from "../controllers/skillController.js";

const router = express.Router();

// Create a new skill
router.post("/", createSkill);

// Get all skills with pagination and optional search by level
router.get("/", getAllSkills);

// Get a specific skill by ID
router.get("/:id", getSkillById);

// Update a skill by ID
router.put("/:id", updateSkill);

// Delete a skill by ID
router.delete("/:id", deleteSkill);

export default router;
