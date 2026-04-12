import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

// ======================================================
// INTEGRATION TEST SETUP
// ======================================================

// Import actual services (no mocks)
import * as skillService from "../src/services/skill.service.js";
import * as courseService from "../src/services/course.service.js";
import * as enrollmentService from "../src/services/enrollment.service.js";
import User from "../src/models/UserModels.js";
import Skill from "../src/models/Skill.js";
import Course from "../src/models/Course.js";
import Enrollment from "../src/models/Enrollment.js";

// Test database setup
const MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/afy1s_test";

// ======================================================
// INTEGRATION TESTS
// ======================================================

// Test Setup and Teardown
test("setup database connection", async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to test database");
});

test("cleanup database before tests", async () => {
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
});

// ---------------- SKILL CREATION + COURSE CREATION INTEGRATION ----------------
test("create skill and then create course using that skill", async () => {
  // Step 1: Create a skill
  const skillData = {
    name: "React Testing",
    level: "Intermediate",
    description: "React testing with Jest"
  };
  
  const createdSkill = await skillService.createSkill(skillData);
  assert.ok(createdSkill._id);
  assert.equal(createdSkill.status, "pending");
  
  // Step 2: Approve the skill (needed for course creation)
  const approvedSkill = await skillService.approveSkill(createdSkill._id);
  assert.equal(approvedSkill.status, "approved");
  
  // Step 3: Create a course using the approved skill
  const courseData = {
    title: "React Testing Masterclass",
    level: "Intermediate",
    duration: 30,
    skillId: approvedSkill._id,
    skillName: approvedSkill.name,
    description: "Learn React testing"
  };
  
  const createdCourse = await courseService.createCourse(courseData);
  assert.ok(createdCourse._id);
  assert.equal(createdCourse.skillId, approvedSkill._id);
  assert.equal(createdCourse.skillName, approvedSkill.name);
});

// ---------------- USER ENROLLMENT WORKFLOW INTEGRATION ----------------
test("complete user enrollment workflow: skill -> course -> enrollment", async () => {
  // Step 1: Create and approve a skill
  const skill = await skillService.createSkill({
    name: "Node.js Integration",
    level: "Advanced",
    description: "Node.js backend development"
  });
  await skillService.approveSkill(skill._id);
  
  // Step 2: Create a course for that skill
  const course = await courseService.createCourse({
    title: "Node.js Backend Development",
    level: "Advanced",
    duration: 40,
    skillId: skill._id,
    skillName: skill.name,
    description: "Complete Node.js course"
  });
  
  // Step 3: Create a test user
  const userData = {
    name: "Integration Test User",
    email: "integration@test.com",
    password: "test123456",
    role: "user"
  };
  
  const user = await User.create(userData);
  assert.ok(user._id);
  
  // Step 4: Enroll user in the course
  const enrollmentData = {
    userId: user._id,
    courseId: course._id
  };
  
  const enrollment = await enrollmentService.enrollInCourse(enrollmentData);
  assert.equal(enrollment.userId, user._id);
  assert.equal(enrollment.courseId, course._id);
  assert.equal(enrollment.progress, 0);
  assert.equal(enrollment.status, "not_started");
  
  // Step 5: Update progress multiple times
  await enrollmentService.updateProgress(enrollment._id, 25);
  await enrollmentService.updateProgress(enrollment._id, 50);
  await enrollmentService.updateProgress(enrollment._id, 75);
  
  // Verify progress updates
  const updatedEnrollment = await enrollmentService.getEnrollmentDetails(enrollment._id);
  assert.equal(updatedEnrollment.progress, 75);
  assert.equal(updatedEnrollment.status, "in_progress");
  
  // Step 6: Complete the course
  const completedEnrollment = await enrollmentService.completeCourse(enrollment._id);
  assert.equal(completedEnrollment.progress, 100);
  assert.equal(completedEnrollment.status, "completed");
  assert.ok(completedEnrollment.certificateId);
  assert.ok(completedEnrollment.completedAt);
});

// ---------------- SKILL APPROVAL WORKFLOW INTEGRATION ----------------
test("skill approval workflow: create -> approve -> use in course", async () => {
  // Step 1: User creates a skill (pending status)
  const skillData = {
    name: "Vue.js Testing",
    level: "Intermediate",
    description: "Vue.js testing frameworks"
  };
  
  const pendingSkill = await skillService.createSkill(skillData);
  assert.equal(pendingSkill.status, "pending");
  
  // Step 2: Admin approves the skill
  const approvedSkill = await skillService.approveSkill(pendingSkill._id);
  assert.equal(approvedSkill.status, "approved");
  
  // Step 3: Skill should now appear in approved skills list
  const approvedSkills = await skillService.getApprovedSkills();
  const foundSkill = approvedSkills.find(s => s._id.toString() === approvedSkill._id.toString());
  assert.ok(foundSkill);
  assert.equal(foundSkill.status, "approved");
  
  // Step 4: Course can be created using approved skill
  const courseData = {
    title: "Vue.js Testing Course",
    level: "Intermediate",
    duration: 25,
    skillId: approvedSkill._id,
    skillName: approvedSkill.name
  };
  
  const course = await courseService.createCourse(courseData);
  assert.equal(course.skillId, approvedSkill._id);
  
  // Step 5: Course should be findable by skill
  const coursesBySkill = await courseService.getCoursesBySkill(approvedSkill._id);
  assert.ok(coursesBySkill.length > 0);
  const foundCourse = coursesBySkill.find(c => c._id.toString() === course._id.toString());
  assert.ok(foundCourse);
});

// ---------------- ENROLLMENT VALIDATION INTEGRATION ----------------
test("enrollment validation: prevent duplicates and enforce forward-only progress", async () => {
  // Step 1: Setup skill and course
  const skill = await skillService.createSkill({
    name: "Python Testing",
    level: "Beginner",
    description: "Python testing basics"
  });
  await skillService.approveSkill(skill._id);
  
  const course = await courseService.createCourse({
    title: "Python Testing Basics",
    level: "Beginner",
    duration: 20,
    skillId: skill._id,
    skillName: skill.name
  });
  
  // Step 2: Create user
  const user = await User.create({
    name: "Validation Test User",
    email: "validation@test.com",
    password: "test123456",
    role: "user"
  });
  
  // Step 3: First enrollment should succeed
  const enrollment1 = await enrollmentService.enrollInCourse({
    userId: user._id,
    courseId: course._id
  });
  assert.ok(enrollment1._id);
  
  // Step 4: Duplicate enrollment should fail
  await assert.rejects(async () => {
    await enrollmentService.enrollInCourse({
      userId: user._id,
      courseId: course._id
    });
  }, /User already enrolled in this course/);
  
  // Step 5: Forward progress should work
  await enrollmentService.updateProgress(enrollment1._id, 30);
  await enrollmentService.updateProgress(enrollment1._id, 60);
  
  // Step 6: Backward progress should fail
  await assert.rejects(async () => {
    await enrollmentService.updateProgress(enrollment1._id, 40);
  }, /Progress can only be increased/);
  
  // Step 7: Invalid progress should fail
  await assert.rejects(async () => {
    await enrollmentService.updateProgress(enrollment1._id, 150);
  }, /Invalid progress value/);
  
  await assert.rejects(async () => {
    await enrollmentService.updateProgress(enrollment1._id, -10);
  }, /Invalid progress value/);
});

// ---------------- MULTI-USER ENROLLMENT INTEGRATION ----------------
test("multiple users enrolling in same course", async () => {
  // Step 1: Setup skill and course
  const skill = await skillService.createSkill({
    name: "JavaScript Multi-User",
    level: "All Levels",
    description: "JavaScript for multiple users"
  });
  await skillService.approveSkill(skill._id);
  
  const course = await courseService.createCourse({
    title: "JavaScript Multi-User Course",
    level: "All Levels",
    duration: 35,
    skillId: skill._id,
    skillName: skill.name
  });
  
  // Step 2: Create multiple users
  const users = [];
  for (let i = 1; i <= 3; i++) {
    const user = await User.create({
      name: `Multi-User Test ${i}`,
      email: `multiuser${i}@test.com`,
      password: "test123456",
      role: "user"
    });
    users.push(user);
  }
  
  // Step 3: Enroll all users in the same course
  const enrollments = [];
  for (const user of users) {
    const enrollment = await enrollmentService.enrollInCourse({
      userId: user._id,
      courseId: course._id
    });
    enrollments.push(enrollment);
  }
  
  assert.equal(enrollments.length, 3);
  
  // Step 4: Update progress for each user at different rates
  await enrollmentService.updateProgress(enrollments[0]._id, 25);
  await enrollmentService.updateProgress(enrollments[1]._id, 50);
  await enrollmentService.updateProgress(enrollments[2]._id, 75);
  
  // Step 5: Get course enrollments and verify
  const courseEnrollments = await enrollmentService.getCourseEnrollments(course._id);
  assert.equal(courseEnrollments.length, 3);
  
  // Step 6: Complete one user's course
  const completedEnrollment = await enrollmentService.completeCourse(enrollments[2]._id);
  assert.equal(completedEnrollment.status, "completed");
  assert.ok(completedEnrollment.certificateId);
  
  // Step 7: Verify enrollment statistics
  const stats = await enrollmentService.getEnrollmentStats();
  assert.ok(stats.totalEnrollments >= 3);
  assert.ok(stats.byStatus.completed >= 1);
});

// ---------------- CLEANUP ----------------
test("cleanup database after tests", async () => {
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  console.log("Database cleaned up");
});

test("close database connection", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
});
