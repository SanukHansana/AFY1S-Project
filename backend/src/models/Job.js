import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Job title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [80, "Category cannot exceed 80 characters"],
      default: "General",
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },

    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employer reference is required"],
      index: true,
    },

    // null until hired
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ✅ recommended for apply flow
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["open", "applied", "in-progress", "completed", "cancelled"],
      default: "open",
      index: true,
    },

    deadline: {
      type: Date,
      default: null,
      index: true,
    },

    jobType: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: [120, "Location cannot exceed 120 characters"],
      default: "",
      index: true,
    },
  },
  { timestamps: true }
);

// helpful indexes for searching/filtering
jobSchema.index({ title: "text", description: "text", category: "text" });
jobSchema.index({ createdAt: -1 });

export default mongoose.model("Job", jobSchema);