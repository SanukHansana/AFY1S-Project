import Course from "../models/Course.js";
import Skill from "../models/Skill.js";

export const getAllCourses = async () => {
  const courses = await Course.find();
  // Handle populate if it exists
  if (courses.populate) {
    return await courses.populate('skillId');
  }
  return courses;
};

export const getCourseById = async (id) => {
  return await Course.findById(id);
};

export const createCourse = async (courseData) => {
  return await Course.create(courseData);
};

export const updateCourse = async (id, updateData) => {
  const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
  if (!course) throw new Error("Course not found");
  return course;
};

export const deleteCourse = async (id) => {
  const result = await Course.findByIdAndDelete(id);
  if (!result) throw new Error("Course not found");
  return { message: "Course deleted successfully" };
};

export const getCoursesBySkill = async (skillId) => {
  return await Course.find({ skillId });
};

export const getCoursesByLevel = async (level) => {
  return await Course.find({ level });
};

export const searchCourses = async (searchTerm) => {
  return await Course.find({ 
    title: { $regex: searchTerm, $options: 'i' }
  });
};

export const getCourseStats = async () => {
  const totalCourses = await Course.countDocuments();
  const byLevel = {
    Beginner: await Course.countDocuments({ level: "Beginner" }),
    Intermediate: await Course.countDocuments({ level: "Intermediate" }),
    Advanced: await Course.countDocuments({ level: "Advanced" })
  };
  
  return { totalCourses, byLevel };
};
