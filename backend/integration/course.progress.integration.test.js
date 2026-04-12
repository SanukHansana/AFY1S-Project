import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

// ======================================================
// COURSE PROGRESS INTEGRATION TESTS
// ======================================================

import * as courseService from "../src/services/course.service.js";
import * as enrollmentService from "../src/services/enrollment.service.js";
import * as skillService from "../src/services/skill.service.js";
import User from "../src/models/UserModels.js";
import Skill from "../src/models/Skill.js";
import Course from "../src/models/Course.js";
import Enrollment from "../src/models/Enrollment.js";

const MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/afy1s_test";

// ======================================================
// PROGRESS TRACKING INTEGRATION TESTS
// ======================================================

test("setup database connection", async () => {
  await mongoose.connect(MONGODB_URI);
});

test("cleanup database", async () => {
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
});

// ---------------- PROGRESS VALIDATION INTEGRATION ----------------
test("complete progress tracking workflow with validation", async () => {
  // Step 1: Create approved skill
  const skill = await skillService.createSkill({
    name: "Progress Testing",
    level: "Intermediate",
    description: "Testing progress tracking"
  });
  await skillService.approveSkill(skill._id);
  
  // Step 2: Create course
  const course = await courseService.createCourse({
    title: "Progress Tracking Course",
    level: "Intermediate",
    duration: 40,
    skillId: skill._id,
    skillName: skill.name,
    description: "Complete course with progress tracking"
  });
  
  // Step 3: Create user
  const user = await User.create({
    name: "Progress Test User",
    email: "progress@test.com",
    password: "test123456",
    role: "user"
  });
  
  // Step 4: Enroll user
  const enrollment = await enrollmentService.enrollInCourse({
    userId: user._id,
    courseId: course._id
  });
  
  // Step 5: Test progressive updates
  const progressSteps = [10, 25, 40, 60, 80, 95, 100];
  
  for (const progress of progressSteps) {
    const updatedEnrollment = await enrollmentService.updateProgress(enrollment._id, progress);
    assert.equal(updatedEnrollment.progress, progress);
    
    if (progress < 100) {
      assert.equal(updatedEnrollment.status, "in_progress");
    } else {
      assert.equal(updatedEnrollment.status, "completed");
      assert.ok(updatedEnrollment.completedAt);
      assert.ok(updatedEnrollment.certificateId);
    }
  }
  
  // Step 6: Verify final state
  const finalEnrollment = await enrollmentService.getEnrollmentDetails(enrollment._id);
  assert.equal(finalEnrollment.progress, 100);
  assert.equal(finalEnrollment.status, "completed");
  assert.ok(finalEnrollment.certificateId);
  assert.ok(finalEnrollment.certificateUrl);
});

// ---------------- BATCH PROGRESS UPDATES INTEGRATION ----------------
test("multiple users progress in same course", async () => {
  // Setup
  const skill = await skillService.createSkill({
    name: "Batch Progress Testing",
    level: "Beginner",
    description: "Testing multiple user progress"
  });
  await skillService.approveSkill(skill._id);
  
  const course = await courseService.createCourse({
    title: "Batch Progress Course",
    level: "Beginner",
    duration: 30,
    skillId: skill._id,
    skillName: skill.name
  });
  
  // Create multiple users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await User.create({
      name: `Batch User ${i}`,
      email: `batch${i}@test.com`,
      password: "test123456",
      role: "user"
    });
    users.push(user);
  }
  
  // Enroll all users
  const enrollments = [];
  for (const user of users) {
    const enrollment = await enrollmentService.enrollInCourse({
      userId: user._id,
      courseId: course._id
    });
    enrollments.push(enrollment);
  }
  
  // Update progress at different rates
  const progressRates = [20, 40, 60, 80, 100];
  
  for (let i = 0; i < enrollments.length; i++) {
    await enrollmentService.updateProgress(enrollments[i]._id, progressRates[i]);
  }
  
  // Verify all progress updates
  for (let i = 0; i < enrollments.length; i++) {
    const enrollment = await enrollmentService.getEnrollmentDetails(enrollments[i]._id);
    assert.equal(enrollment.progress, progressRates[i]);
    
    if (progressRates[i] === 100) {
      assert.equal(enrollment.status, "completed");
      assert.ok(enrollment.certificateId);
    } else {
      assert.equal(enrollment.status, "in_progress");
    }
  }
  
  // Verify course statistics
  const courseEnrollments = await enrollmentService.getCourseEnrollments(course._id);
  assert.equal(courseEnrollments.length, 5);
  
  const completedCount = courseEnrollments.filter(e => e.status === "completed").length;
  const inProgressCount = courseEnrollments.filter(e => e.status === "in_progress").length;
  
  assert.equal(completedCount, 1);
  assert.equal(inProgressCount, 4);
});

// ---------------- COURSE COMPLETION CERTIFICATE INTEGRATION ----------------
test("certificate generation on course completion", async () => {
  // Setup
  const skill = await skillService.createSkill({
    name: "Certificate Testing",
    level: "Advanced",
    description: "Testing certificate generation"
  });
  await skillService.approveSkill(skill._id);
  
  const course = await courseService.createCourse({
    title: "Certificate Generation Course",
    level: "Advanced",
    duration: 50,
    skillId: skill._id,
    skillName: skill.name,
    description: "Course that generates certificate"
  });
  
  const user = await User.create({
    name: "Certificate Test User",
    email: "certificate@test.com",
    password: "test123456",
    role: "user"
  });
  
  // Enroll and complete course
  const enrollment = await enrollmentService.enrollInCourse({
    userId: user._id,
    courseId: course._id
  });
  
  // Complete course
  const completedEnrollment = await enrollmentService.completeCourse(enrollment._id);
  
  // Verify certificate generation
  assert.ok(completedEnrollment.certificateId);
  assert.ok(completedEnrollment.certificateUrl);
  assert.equal(completedEnrollment.certificateId.startsWith("CERT-"), true);
  assert.equal(completedEnrollment.certificateUrl.includes("afy1s.com/verify/"), true);
  
  // Verify completion details
  assert.equal(completedEnrollment.progress, 100);
  assert.equal(completedEnrollment.status, "completed");
  assert.ok(completedEnrollment.completedAt);
  
  // Verify user can retrieve completed enrollment with certificate
  const retrievedEnrollment = await enrollmentService.getEnrollmentDetails(enrollment._id);
  assert.equal(retrievedEnrollment.certificateId, completedEnrollment.certificateId);
  assert.equal(retrievedEnrollment.certificateUrl, completedEnrollment.certificateUrl);
});

// ---------------- PROGRESS VALIDATION EDGE CASES INTEGRATION ----------------
test("progress validation edge cases and error handling", async () => {
  // Setup
  const skill = await skillService.createSkill({
    name: "Edge Case Testing",
    level: "Intermediate",
    description: "Testing edge cases"
  });
  await skillService.approveSkill(skill._id);
  
  const course = await courseService.createCourse({
    title: "Edge Case Course",
    level: "Intermediate",
    duration: 25,
    skillId: skill._id,
    skillName: skill.name
  });
  
  const user = await User.create({
    name: "Edge Case User",
    email: "edgecase@test.com",
    password: "test123456",
    role: "user"
  });
  
  const enrollment = await enrollmentService.enrollInCourse({
    userId: user._id,
    courseId: course._id
  });
  
  // Test boundary values
  const validProgressValues = [0, 1, 99, 100];
  
  for (const progress of validProgressValues) {
    if (progress > 0) { // Skip 0 as it's the initial value
      await enrollmentService.updateProgress(enrollment._id, progress);
      const updated = await enrollmentService.getEnrollmentDetails(enrollment._id);
      assert.equal(updated.progress, progress);
    }
  }
  
  // Test invalid progress values
  const invalidProgressValues = [-1, -10, 101, 150, 1000];
  
  for (const invalidProgress of invalidProgressValues) {
    await assert.rejects(async () => {
      await enrollmentService.updateProgress(enrollment._id, invalidProgress);
    }, /Invalid progress value/);
  }
  
  // Test backward progress attempts
  await enrollmentService.updateProgress(enrollment._id, 50);
  
  const backwardAttempts = [49, 25, 0];
  
  for (const backwardProgress of backwardAttempts) {
    await assert.rejects(async () => {
      await enrollmentService.updateProgress(enrollment._id, backwardProgress);
    }, /Progress can only be increased/);
  }
  
  // Test same progress attempt
  await assert.rejects(async () => {
    await enrollmentService.updateProgress(enrollment._id, 50);
  }, /Progress is already at this level/);
});

// ---------------- MULTI-COURSE PROGRESS INTEGRATION ----------------
test("user progress across multiple courses", async () => {
  // Create multiple skills
  const skills = [];
  const skillNames = ["Multi-Course Skill 1", "Multi-Course Skill 2", "Multi-Course Skill 3"];
  
  for (const skillName of skillNames) {
    const skill = await skillService.createSkill({
      name: skillName,
      level: "Intermediate",
      description: `Testing ${skillName}`
    });
    await skillService.approveSkill(skill._id);
    skills.push(skill);
  }
  
  // Create multiple courses
  const courses = [];
  for (let i = 0; i < skills.length; i++) {
    const course = await courseService.createCourse({
      title: `Multi-Course ${i + 1}`,
      level: "Intermediate",
      duration: 30 + (i * 10),
      skillId: skills[i]._id,
      skillName: skills[i].name
    });
    courses.push(course);
  }
  
  // Create user
  const user = await User.create({
    name: "Multi-Course User",
    email: "multicourse@test.com",
    password: "test123456",
    role: "user"
  });
  
  // Enroll user in all courses
  const enrollments = [];
  for (const course of courses) {
    const enrollment = await enrollmentService.enrollInCourse({
      userId: user._id,
      courseId: course._id
    });
    enrollments.push(enrollment);
  }
  
  // Update progress at different rates for each course
  const progressRates = [25, 50, 100];
  
  for (let i = 0; i < enrollments.length; i++) {
    await enrollmentService.updateProgress(enrollments[i]._id, progressRates[i]);
  }
  
  // Verify user's enrollments
  const userEnrollments = await enrollmentService.getUserEnrollments(user._id);
  assert.equal(userEnrollments.length, 3);
  
  // Verify progress in each course
  for (let i = 0; i < userEnrollments.length; i++) {
    const enrollment = userEnrollments[i];
    assert.equal(enrollment.progress, progressRates[i]);
    
    if (progressRates[i] === 100) {
      assert.equal(enrollment.status, "completed");
      assert.ok(enrollment.certificateId);
    } else {
      assert.equal(enrollment.status, "in_progress");
    }
  }
  
  // Verify overall enrollment statistics
  const stats = await enrollmentService.getEnrollmentStats();
  assert.ok(stats.totalEnrollments >= 3);
  assert.ok(stats.byStatus.completed >= 1);
  assert.ok(stats.byStatus.in_progress >= 2);
});

// ---------------- CLEANUP ----------------
test("cleanup database", async () => {
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
});

test("close database connection", async () => {
  await mongoose.connection.close();
});
