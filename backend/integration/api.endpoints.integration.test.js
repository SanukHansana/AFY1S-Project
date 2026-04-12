import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../src/server.js"; // Import Express app
import request from "supertest";

// ======================================================
// API ENDPOINTS INTEGRATION TESTS
// ======================================================

const MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/afy1s_test";

// ======================================================
// API INTEGRATION TESTS
// ======================================================

test("setup database connection", async () => {
  await mongoose.connect(MONGODB_URI);
});

test("cleanup database", async () => {
  const User = mongoose.connection.collection('users');
  const Skill = mongoose.connection.collection('skills');
  const Course = mongoose.connection.collection('courses');
  const Enrollment = mongoose.connection.collection('enrollments');
  
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
});

// ---------------- SKILL API ENDPOINTS INTEGRATION ----------------
test("POST /api/skills - create skill endpoint", async () => {
  const skillData = {
    name: "API Testing Skill",
    level: "Intermediate",
    description: "Testing skill creation via API"
  };
  
  const response = await request(app)
    .post("/api/skills")
    .send(skillData)
    .expect(201);
  
  assert.ok(response.body._id);
  assert.equal(response.body.name, skillData.name);
  assert.equal(response.body.status, "pending");
});

test("GET /api/skills - get all skills endpoint", async () => {
  // First create a skill
  await request(app)
    .post("/api/skills")
    .send({
      name: "API List Skill",
      level: "Beginner",
      description: "Testing skill listing"
    });
  
  const response = await request(app)
    .get("/api/skills")
    .expect(200);
  
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
  const foundSkill = response.body.find(s => s.name === "API List Skill");
  assert.ok(foundSkill);
});

test("PUT /api/skills/:id/approve - approve skill endpoint", async () => {
  // Create a skill first
  const createResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "API Approve Skill",
      level: "Advanced",
      description: "Testing skill approval"
    });
  
  const skillId = createResponse.body._id;
  
  // Approve the skill
  const response = await request(app)
    .put(`/api/skills/${skillId}/approve`)
    .expect(200);
  
  assert.equal(response.body.status, "approved");
});

test("GET /api/skills/pending - get pending skills endpoint", async () => {
  // Create a pending skill
  await request(app)
    .post("/api/skills")
    .send({
      name: "Pending API Skill",
      level: "Intermediate",
      description: "Testing pending skills endpoint"
    });
  
  const response = await request(app)
    .get("/api/skills/pending")
    .expect(200);
  
  assert.ok(Array.isArray(response.body));
  const pendingSkills = response.body.filter(s => s.status === "pending");
  assert.ok(pendingSkills.length > 0);
});

// ---------------- COURSE API ENDPOINTS INTEGRATION ----------------
test("POST /api/courses - create course endpoint", async () => {
  // First create and approve a skill
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Course API Skill",
      level: "Intermediate",
      description: "Skill for course API testing"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  // Create course using the approved skill
  const courseData = {
    title: "API Testing Course",
    level: "Intermediate",
    duration: 35,
    skillId: skillResponse.body._id,
    skillName: skillResponse.body.name,
    description: "Testing course creation via API"
  };
  
  const response = await request(app)
    .post("/api/courses")
    .send(courseData)
    .expect(201);
  
  assert.ok(response.body._id);
  assert.equal(response.body.title, courseData.title);
  assert.equal(response.body.skillId, courseData.skillId);
});

test("GET /api/courses - get all courses endpoint", async () => {
  const response = await request(app)
    .get("/api/courses")
    .expect(200);
  
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
});

test("GET /api/courses/by-skill/:skillId - get courses by skill endpoint", async () => {
  // Create skill and course
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Skill Filter Test",
      level: "Beginner",
      description: "Testing skill filtering"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Filtered Course",
      level: "Beginner",
      duration: 20,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  const response = await request(app)
    .get(`/api/courses/by-skill/${skillResponse.body._id}`)
    .expect(200);
  
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
  assert.equal(response.body[0].skillId, skillResponse.body._id);
});

// ---------------- ENROLLMENT API ENDPOINTS INTEGRATION ----------------
test("POST /api/enrollments - enroll in course endpoint", async () => {
  // Create and approve skill
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Enrollment API Skill",
      level: "Intermediate",
      description: "Skill for enrollment API testing"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  // Create course
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Enrollment API Course",
      level: "Intermediate",
      duration: 30,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  // Create user
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Enrollment Test User",
      email: "enrollment@test.com",
      password: "test123456",
      role: "user"
    });
  
  // Enroll user in course
  const enrollmentData = {
    userId: userResponse.body._id,
    courseId: courseResponse.body._id
  };
  
  const response = await request(app)
    .post("/api/enrollments")
    .send(enrollmentData)
    .expect(201);
  
  assert.ok(response.body._id);
  assert.equal(response.body.userId, enrollmentData.userId);
  assert.equal(response.body.courseId, enrollmentData.courseId);
  assert.equal(response.body.progress, 0);
  assert.equal(response.body.status, "not_started");
});

test("PUT /api/enrollments/:id/progress - update progress endpoint", async () => {
  // Setup user, skill, course, and enrollment
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Progress API Skill",
      level: "Advanced",
      description: "Skill for progress API testing"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Progress API Course",
      level: "Advanced",
      duration: 40,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Progress Test User",
      email: "progress@test.com",
      password: "test123456",
      role: "user"
    });
  
  const enrollmentResponse = await request(app)
    .post("/api/enrollments")
    .send({
      userId: userResponse.body._id,
      courseId: courseResponse.body._id
    });
  
  // Update progress
  const response = await request(app)
    .put(`/api/enrollments/${enrollmentResponse.body._id}/progress`)
    .send({ progress: 50 })
    .expect(200);
  
  assert.equal(response.body.progress, 50);
  assert.equal(response.body.status, "in_progress");
});

test("PUT /api/enrollments/:id/complete - complete course endpoint", async () => {
  // Setup complete workflow
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Completion API Skill",
      level: "Expert",
      description: "Skill for completion API testing"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Completion API Course",
      level: "Expert",
      duration: 50,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Completion Test User",
      email: "completion@test.com",
      password: "test123456",
      role: "user"
    });
  
  const enrollmentResponse = await request(app)
    .post("/api/enrollments")
    .send({
      userId: userResponse.body._id,
      courseId: courseResponse.body._id
    });
  
  // Complete the course
  const response = await request(app)
    .put(`/api/enrollments/${enrollmentResponse.body._id}/complete`)
    .expect(200);
  
  assert.equal(response.body.progress, 100);
  assert.equal(response.body.status, "completed");
  assert.ok(response.body.certificateId);
  assert.ok(response.body.certificateUrl);
  assert.ok(response.body.completedAt);
});

test("GET /api/enrollments/user/:userId - get user enrollments endpoint", async () => {
  // Create user with multiple enrollments
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Multi Enrollment User",
      email: "multi@test.com",
      password: "test123456",
      role: "user"
    });
  
  // Create skills and courses
  for (let i = 1; i <= 3; i++) {
    const skillResponse = await request(app)
      .post("/api/skills")
      .send({
        name: `Multi Skill ${i}`,
        level: "Intermediate",
        description: `Skill ${i} for multi enrollment testing`
      });
    
    await request(app)
      .put(`/api/skills/${skillResponse.body._id}/approve`);
    
    const courseResponse = await request(app)
      .post("/api/courses")
      .send({
        title: `Multi Course ${i}`,
        level: "Intermediate",
        duration: 25,
        skillId: skillResponse.body._id,
        skillName: skillResponse.body.name
      });
    
    await request(app)
      .post("/api/enrollments")
      .send({
        userId: userResponse.body._id,
        courseId: courseResponse.body._id
      });
  }
  
  // Get user enrollments
  const response = await request(app)
    .get(`/api/enrollments/user/${userResponse.body._id}`)
    .expect(200);
  
  assert.ok(Array.isArray(response.body));
  assert.equal(response.body.length, 3);
  
  // Verify course population
  for (const enrollment of response.body) {
    assert.ok(enrollment.courseId);
    assert.ok(enrollment.courseId.title);
    assert.equal(enrollment.userId, userResponse.body._id);
  }
});

// ---------------- ERROR HANDLING INTEGRATION ----------------
test("POST /api/enrollments - duplicate enrollment error handling", async () => {
  // Setup
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Duplicate Test Skill",
      level: "Beginner",
      description: "Testing duplicate enrollment"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Duplicate Test Course",
      level: "Beginner",
      duration: 20,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Duplicate Test User",
      email: "duplicate@test.com",
      password: "test123456",
      role: "user"
    });
  
  const enrollmentData = {
    userId: userResponse.body._id,
    courseId: courseResponse.body._id
  };
  
  // First enrollment should succeed
  await request(app)
    .post("/api/enrollments")
    .send(enrollmentData)
    .expect(201);
  
  // Second enrollment should fail
  const response = await request(app)
    .post("/api/enrollments")
    .send(enrollmentData)
    .expect(400);
  
  assert.ok(response.body.error);
  assert.ok(response.body.error.includes("already enrolled"));
});

test("PUT /api/enrollments/:id/progress - backward progress error handling", async () => {
  // Setup enrollment
  const skillResponse = await request(app)
    .post("/api/skills")
    .send({
      name: "Backward Progress Skill",
      level: "Intermediate",
      description: "Testing backward progress error"
    });
  
  await request(app)
    .put(`/api/skills/${skillResponse.body._id}/approve`);
  
  const courseResponse = await request(app)
    .post("/api/courses")
    .send({
      title: "Backward Progress Course",
      level: "Intermediate",
      duration: 30,
      skillId: skillResponse.body._id,
      skillName: skillResponse.body.name
    });
  
  const userResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Backward Progress User",
      email: "backward@test.com",
      password: "test123456",
      role: "user"
    });
  
  const enrollmentResponse = await request(app)
    .post("/api/enrollments")
    .send({
      userId: userResponse.body._id,
      courseId: courseResponse.body._id
    });
  
  // Update progress to 50
  await request(app)
    .put(`/api/enrollments/${enrollmentResponse.body._id}/progress`)
    .send({ progress: 50 })
    .expect(200);
  
  // Try to update backward to 25 - should fail
  const response = await request(app)
    .put(`/api/enrollments/${enrollmentResponse.body._id}/progress`)
    .send({ progress: 25 })
    .expect(400);
  
  assert.ok(response.body.error);
  assert.ok(response.body.error.includes("can only be increased"));
});

// ---------------- CLEANUP ----------------
test("cleanup database", async () => {
  const User = mongoose.connection.collection('users');
  const Skill = mongoose.connection.collection('skills');
  const Course = mongoose.connection.collection('courses');
  const Enrollment = mongoose.connection.collection('enrollments');
  
  await User.deleteMany({});
  await Skill.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
});

test("close database connection", async () => {
  await mongoose.connection.close();
});
