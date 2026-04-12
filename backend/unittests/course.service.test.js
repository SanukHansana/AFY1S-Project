import test from "node:test";
import assert from "node:assert/strict";

// ======================================================
// MOCK SETUP (MUST BE BEFORE SERVICE IMPORT)
// ======================================================

import Course from "../src/models/Course.js";
import Skill from "../src/models/Skill.js";

// ---------- MOCK COURSE MODEL METHODS ----------

Course.find = async () => {
  const courses = [
    { 
      _id: "1", 
      title: "JavaScript Basics", 
      level: "Beginner",
      duration: 40,
      skillId: "1",
      skillName: "JavaScript"
    },
    { 
      _id: "2", 
      title: "React Advanced", 
      level: "Advanced",
      duration: 60,
      skillId: "2", 
      skillName: "React"
    }
  ];
  
  // Return mock query object with populate method
  return {
    populate: () => Promise.resolve(courses)
  };
};

Course.findById = async (id) => {
  if (id === "1") {
    return { 
      _id: "1", 
      title: "JavaScript Basics", 
      level: "Beginner",
      duration: 40,
      skillId: "1",
      skillName: "JavaScript"
    };
  }
  return null;
};

Course.create = async (data) => {
  return { _id: "new-course-id", ...data };
};

Course.findByIdAndUpdate = async (id, data) => {
  if (id === "1") {
    return { _id: id, ...data };
  }
  return null;
};

Course.findByIdAndDelete = async (id) => {
  if (id === "1") {
    return { _id: id };
  }
  return null;
};

// ---------- MOCK SKILL MODEL FOR POPULATION ----------

Skill.findById = async (id) => {
  if (id === "1") {
    return { _id: "1", name: "JavaScript", level: "Intermediate" };
  }
  return null;
};

// ======================================================
// IMPORT SERVICE AFTER MOCKS
// ======================================================

import * as courseService from "../src/services/course.service.js";

// ======================================================
// COURSE SERVICE TESTS
// ======================================================

// ---------------- GET ALL COURSES ----------------
test("getAllCourses should return array of courses", async () => {
  const courses = await courseService.getAllCourses();
  
  assert.equal(Array.isArray(courses), true);
  assert.equal(courses.length, 2);
  assert.equal(courses[0].title, "JavaScript Basics");
});

// ---------------- GET COURSE BY ID ----------------
test("getCourseById should return course when found", async () => {
  const course = await courseService.getCourseById("1");
  
  assert.equal(course._id, "1");
  assert.equal(course.title, "JavaScript Basics");
  assert.equal(course.level, "Beginner");
});

test("getCourseById should return null when not found", async () => {
  const course = await courseService.getCourseById("999");
  
  assert.equal(course, null);
});

// ---------------- CREATE COURSE ----------------
test("createCourse should create new course", async () => {
  const courseData = {
    title: "Python Fundamentals",
    level: "Beginner",
    duration: 50,
    skillId: "1",
    skillName: "Python",
    description: "Learn Python programming basics"
  };
  
  const course = await courseService.createCourse(courseData);
  
  assert.equal(course.title, "Python Fundamentals");
  assert.equal(course.level, "Beginner");
  assert.equal(course.duration, 50);
  assert.ok(course._id);
});

// ---------------- UPDATE COURSE ----------------
test("updateCourse should update course data", async () => {
  const updateData = {
    title: "JavaScript Basics Updated",
    duration: 45
  };
  
  const updated = await courseService.updateCourse("1", updateData);
  
  assert.equal(updated.title, "JavaScript Basics Updated");
  assert.equal(updated.duration, 45);
});

test("updateCourse should return error for non-existent course", async () => {
  await assert.rejects(async () => {
    await courseService.updateCourse("999", { title: "Test" });
  }, /Course not found/);
});

// ---------------- DELETE COURSE ----------------
test("deleteCourse should remove course", async () => {
  const result = await courseService.deleteCourse("1");
  
  assert.equal(result.message, "Course deleted successfully");
});

test("deleteCourse should return error for non-existent course", async () => {
  await assert.rejects(async () => {
    await courseService.deleteCourse("999");
  }, /Course not found/);
});

// ---------------- GET COURSES BY SKILL ----------------
test("getCoursesBySkill should return courses for specific skill", async () => {
  // Mock to return only JavaScript courses
  Course.find = async (query) => {
    if (query.skillId === "1") {
      return [
        { 
          _id: "1", 
          title: "JavaScript Basics", 
          level: "Beginner",
          duration: 40,
          skillId: "1"
        },
        { 
          _id: "3", 
          title: "JavaScript Advanced", 
          level: "Advanced",
          duration: 60,
          skillId: "1"
        }
      ];
    }
    return [];
  };
  
  const courses = await courseService.getCoursesBySkill("1");
  
  assert.equal(courses.length, 2);
  assert.equal(courses[0].skillId, "1");
  assert.equal(courses[1].skillId, "1");
});

// ---------------- GET COURSES BY LEVEL ----------------
test("getCoursesByLevel should return courses for specific level", async () => {
  // Mock to return only beginner courses
  Course.find = async (query) => {
    if (query.level === "Beginner") {
      return [
        { 
          _id: "1", 
          title: "JavaScript Basics", 
          level: "Beginner",
          duration: 40
        },
        { 
          _id: "4", 
          title: "Python Basics", 
          level: "Beginner",
          duration: 50
        }
      ];
    }
    return [];
  };
  
  const courses = await courseService.getCoursesByLevel("Beginner");
  
  assert.equal(courses.length, 2);
  assert.equal(courses[0].level, "Beginner");
  assert.equal(courses[1].level, "Beginner");
});

// ---------------- SEARCH COURSES ----------------
test("searchCourses should find courses by title", async () => {
  // Mock search functionality
  Course.find = async (query) => {
    if (query.title && query.title.$regex) {
      return [
        { 
          _id: "1", 
          title: "JavaScript Basics", 
          level: "Beginner",
          duration: 40
        }
      ];
    }
    return [];
  };
  
  const courses = await courseService.searchCourses("JavaScript");
  
  assert.equal(courses.length, 1);
  assert.equal(courses[0].title, "JavaScript Basics");
});

// ---------------- GET COURSE STATISTICS ----------------
test("getCourseStats should return course statistics", async () => {
  // Mock countDocuments
  Course.countDocuments = async (query) => {
    if (!query) return 5; // total courses
    if (query.level === "Beginner") return 2;
    if (query.level === "Intermediate") return 2;
    if (query.level === "Advanced") return 1;
    return 0;
  };
  
  const stats = await courseService.getCourseStats();
  
  assert.equal(stats.totalCourses, 5);
  assert.equal(stats.byLevel.Beginner, 2);
  assert.equal(stats.byLevel.Intermediate, 2);
  assert.equal(stats.byLevel.Advanced, 1);
});
