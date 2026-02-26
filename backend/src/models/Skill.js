//./backend/src/models/Skill.js
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"]
    },
    level: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Level must be either Beginner, Intermediate, or Advanced"
      },
      required: [true, "Skill level is required"]
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model("Skill", skillSchema);
