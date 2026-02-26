//./backend/src/models/Enrollment.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"]
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"]
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"]
    },
    status: {
      type: String,
      enum: {
        values: ["Enrolled", "Completed"],
        message: "Status must be either Enrolled or Completed"
      },
      default: "Enrolled"
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true 
  }
);

// Add compound index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
