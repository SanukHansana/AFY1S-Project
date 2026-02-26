//./backend/src/models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Course title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill reference is required"]
    },
    duration: {
      type: Number,
      required: [true, "Course duration is required"],
      min: [1, "Duration must be at least 1 hour"],
      max: [1000, "Duration cannot exceed 1000 hours"]
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model("Course", courseSchema);
