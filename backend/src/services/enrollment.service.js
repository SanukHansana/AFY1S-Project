import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/UserModels.js";

export const enrollInCourse = async (enrollmentData) => {
  const existingEnrollment = await Enrollment.findOne({
    userId: enrollmentData.userId,
    courseId: enrollmentData.courseId
  });
  
  if (existingEnrollment) {
    throw new Error("User already enrolled in this course");
  }
  
  return await Enrollment.create({
    ...enrollmentData,
    progress: 0,
    status: "not_started",
    enrolledAt: new Date()
  });
};

export const getUserEnrollments = async (userId) => {
  return await Enrollment.find({ userId }).populate('courseId');
};

export const updateProgress = async (enrollmentId, newProgress) => {
  if (newProgress < 0 || newProgress > 100) {
    throw new Error("Invalid progress value");
  }
  
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new Error("Enrollment not found");
  
  if (newProgress < enrollment.progress) {
    throw new Error("Progress can only be increased, not decreased");
  }
  
  if (newProgress === enrollment.progress) {
    throw new Error("Progress is already at this level");
  }
  
  enrollment.progress = newProgress;
  
  if (newProgress === 100) {
    enrollment.status = "completed";
    enrollment.completedAt = new Date();
    // Generate certificate
    enrollment.certificateId = `CERT-${Date.now()}`;
    enrollment.certificateUrl = `https://afy1s.com/verify/${enrollment.certificateId}`;
  } else {
    enrollment.status = "in_progress";
  }
  
  await enrollment.save();
  return enrollment;
};

export const getEnrollmentDetails = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate('courseId')
    .populate('userId');
  return enrollment;
};

export const completeCourse = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new Error("Enrollment not found");
  
  enrollment.progress = 100;
  enrollment.status = "completed";
  enrollment.completedAt = new Date();
  enrollment.certificateId = `CERT-${Date.now()}`;
  enrollment.certificateUrl = `https://afy1s.com/verify/${enrollment.certificateId}`;
  
  await enrollment.save();
  return enrollment;
};

export const unenrollFromCourse = async (enrollmentId) => {
  const result = await Enrollment.findByIdAndDelete(enrollmentId);
  if (!result) throw new Error("Enrollment not found");
  return { message: "Successfully unenrolled from course" };
};

export const getEnrollmentStats = async () => {
  const totalEnrollments = await Enrollment.countDocuments();
  const byStatus = {
    not_started: await Enrollment.countDocuments({ status: "not_started" }),
    in_progress: await Enrollment.countDocuments({ status: "in_progress" }),
    completed: await Enrollment.countDocuments({ status: "completed" })
  };
  
  return { totalEnrollments, byStatus };
};

export const getCourseEnrollments = async (courseId) => {
  return await Enrollment.find({ courseId }).populate('userId');
};

export const validateProgressUpdate = async (currentEnrollment, newProgress) => {
  if (newProgress < 0 || newProgress > 100) return false;
  if (newProgress < currentEnrollment.progress) return false;
  if (newProgress === currentEnrollment.progress) return false;
  return true;
};
