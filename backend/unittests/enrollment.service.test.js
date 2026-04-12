import test from "node:test";
import assert from "node:assert/strict";

// ======================================================
// MOCK SETUP (MUST BE BEFORE SERVICE IMPORT)
// ======================================================

import Enrollment from "../src/models/Enrollment.js";
import Course from "../src/models/Course.js";
import User from "../src/models/UserModels.js";

// ---------- MOCK ENROLLMENT MODEL METHODS ----------

Enrollment.find = async () => {
  return [
    { 
      _id: "1", 
      userId: "user1", 
      courseId: "course1",
      progress: 50,
      status: "in_progress",
      enrolledAt: new Date("2024-01-01"),
      completedAt: null
    },
    { 
      _id: "2", 
      userId: "user1", 
      courseId: "course2",
      progress: 100,
      status: "completed",
      enrolledAt: new Date("2024-01-01"),
      completedAt: new Date("2024-01-15")
    }
  ];
};

Enrollment.findOne = async (query) => {
  if (query.userId === "user1" && query.courseId === "course1") {
    return { 
      _id: "1", 
      userId: "user1", 
      courseId: "course1",
      progress: 50,
      status: "in_progress"
    };
  }
  return null;
};

Enrollment.findById = async (id) => {
  if (id === "1") {
    return { 
      _id: "1", 
      userId: "user1", 
      courseId: "course1",
      progress: 50,
      status: "in_progress",
      save: async function() { return this; }
    };
  }
  return null;
};

Enrollment.create = async (data) => {
  return { 
    _id: "new-enrollment", 
    ...data, 
    progress: 0,
    status: "not_started",
    enrolledAt: new Date(),
    completedAt: null
  };
};

Enrollment.findByIdAndUpdate = async (id, data) => {
  if (id === "1") {
    return { _id: id, ...data };
  }
  return null;
};

Enrollment.findByIdAndDelete = async (id) => {
  if (id === "1") {
    return { _id: id };
  }
  return null;
};

// ---------- MOCK COURSE MODEL ----------

Course.findById = async (id) => {
  if (id === "course1") {
    return { 
      _id: "course1", 
      title: "JavaScript Basics", 
      duration: 40
    };
  }
  return null;
};

// ---------- MOCK USER MODEL ----------

User.findById = async (id) => {
  if (id === "user1") {
    return { 
      _id: "user1", 
      name: "John Doe", 
      email: "john@example.com"
    };
  }
  return null;
};

// ======================================================
// IMPORT SERVICE AFTER MOCKS
// ======================================================

import * as enrollmentService from "../src/services/enrollment.service.js";

// ======================================================
// ENROLLMENT SERVICE TESTS
// ======================================================

// ---------------- ENROLL IN COURSE ----------------
test("enrollInCourse should create new enrollment", async () => {
  const enrollmentData = {
    userId: "user1",
    courseId: "course1"
  };
  
  const enrollment = await enrollmentService.enrollInCourse(enrollmentData);
  
  assert.equal(enrollment.userId, "user1");
  assert.equal(enrollment.courseId, "course1");
  assert.equal(enrollment.progress, 0);
  assert.equal(enrollment.status, "not_started");
  assert.ok(enrollment._id);
});

test("enrollInCourse should reject duplicate enrollment", async () => {
  const enrollmentData = {
    userId: "user1",
    courseId: "course1"
  };
  
  await assert.rejects(async () => {
    await enrollmentService.enrollInCourse(enrollmentData);
  }, /User already enrolled in this course/);
});

// ---------------- GET USER ENROLLMENTS ----------------
test("getUserEnrollments should return user's enrollments", async () => {
  const enrollments = await enrollmentService.getUserEnrollments("user1");
  
  assert.equal(Array.isArray(enrollments), true);
  assert.equal(enrollments.length, 2);
  assert.equal(enrollments[0].userId, "user1");
});

// ---------------- UPDATE PROGRESS ----------------
test("updateProgress should allow forward progress", async () => {
  const result = await enrollmentService.updateProgress("1", 75);
  
  assert.equal(result.progress, 75);
  assert.equal(result.status, "in_progress");
});

test("updateProgress should reject backward progress", async () => {
  await assert.rejects(async () => {
    await enrollmentService.updateProgress("1", 25);
  }, /Progress can only be increased/);
});

test("updateProgress should complete course at 100%", async () => {
  const result = await enrollmentService.updateProgress("1", 100);
  
  assert.equal(result.progress, 100);
  assert.equal(result.status, "completed");
  assert.ok(result.completedAt);
});

test("updateProgress should reject invalid progress values", async () => {
  await assert.rejects(async () => {
    await enrollmentService.updateProgress("1", -10);
  }, /Invalid progress value/);
  
  await assert.rejects(async () => {
    await enrollmentService.updateProgress("1", 150);
  }, /Invalid progress value/);
});

// ---------------- GET ENROLLMENT DETAILS ----------------
test("getEnrollmentDetails should return enrollment with course and user info", async () => {
  const details = await enrollmentService.getEnrollmentDetails("1");
  
  assert.equal(details._id, "1");
  assert.equal(details.userId, "user1");
  assert.equal(details.courseId, "course1");
  assert.ok(details.course);
  assert.ok(details.user);
});

test("getEnrollmentDetails should return null for non-existent enrollment", async () => {
  const details = await enrollmentService.getEnrollmentDetails("999");
  
  assert.equal(details, null);
});

// ---------------- COMPLETE COURSE ----------------
test("completeCourse should mark course as completed", async () => {
  const result = await enrollmentService.completeCourse("1");
  
  assert.equal(result.status, "completed");
  assert.equal(result.progress, 100);
  assert.ok(result.completedAt);
});

test("completeCourse should generate certificate", async () => {
  const result = await enrollmentService.completeCourse("1");
  
  assert.ok(result.certificateId);
  assert.ok(result.certificateUrl);
});

// ---------------- UNENROLL FROM COURSE ----------------
test("unenrollFromCourse should remove enrollment", async () => {
  const result = await enrollmentService.unenrollFromCourse("1");
  
  assert.equal(result.message, "Successfully unenrolled from course");
});

test("unenrollFromCourse should return error for non-existent enrollment", async () => {
  await assert.rejects(async () => {
    await enrollmentService.unenrollFromCourse("999");
  }, /Enrollment not found/);
});

// ---------------- GET ENROLLMENT STATISTICS ----------------
test("getEnrollmentStats should return enrollment statistics", async () => {
  // Mock countDocuments
  Enrollment.countDocuments = async (query) => {
    if (!query) return 10; // total enrollments
    if (query.status === "not_started") return 2;
    if (query.status === "in_progress") return 5;
    if (query.status === "completed") return 3;
    return 0;
  };
  
  const stats = await enrollmentService.getEnrollmentStats();
  
  assert.equal(stats.totalEnrollments, 10);
  assert.equal(stats.byStatus.not_started, 2);
  assert.equal(stats.byStatus.in_progress, 5);
  assert.equal(stats.byStatus.completed, 3);
});

// ---------------- GET COURSE ENROLLMENTS ----------------
test("getCourseEnrollments should return enrollments for specific course", async () => {
  // Mock to return enrollments for course1
  Enrollment.find = async (query) => {
    if (query.courseId === "course1") {
      return [
        { 
          _id: "1", 
          userId: "user1", 
          courseId: "course1",
          progress: 50,
          status: "in_progress"
        },
        { 
          _id: "3", 
          userId: "user2", 
          courseId: "course1",
          progress: 100,
          status: "completed"
        }
      ];
    }
    return [];
  };
  
  const enrollments = await enrollmentService.getCourseEnrollments("course1");
  
  assert.equal(enrollments.length, 2);
  assert.equal(enrollments[0].courseId, "course1");
  assert.equal(enrollments[1].courseId, "course1");
});

// ---------------- VALIDATE PROGRESS UPDATE ----------------
test("validateProgressUpdate should allow valid forward progress", async () => {
  const currentEnrollment = { progress: 50 };
  const isValid = await enrollmentService.validateProgressUpdate(currentEnrollment, 75);
  
  assert.equal(isValid, true);
});

test("validateProgressUpdate should reject backward progress", async () => {
  const currentEnrollment = { progress: 50 };
  const isValid = await enrollmentService.validateProgressUpdate(currentEnrollment, 25);
  
  assert.equal(isValid, false);
});

test("validateProgressUpdate should reject same progress", async () => {
  const currentEnrollment = { progress: 50 };
  const isValid = await enrollmentService.validateProgressUpdate(currentEnrollment, 50);
  
  assert.equal(isValid, false);
});

test("validateProgressUpdate should reject out of range progress", async () => {
  const currentEnrollment = { progress: 50 };
  
  const isValidNegative = await enrollmentService.validateProgressUpdate(currentEnrollment, -5);
  const isValidOver100 = await enrollmentService.validateProgressUpdate(currentEnrollment, 150);
  
  assert.equal(isValidNegative, false);
  assert.equal(isValidOver100, false);
});
