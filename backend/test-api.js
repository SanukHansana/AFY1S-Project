// Test API Endpoints Script
// Run with: node test-api.js

import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

// Test data
let testSkillId = null;
let testCourseId = null;
let testUserId = null;
let authToken = null;

// Generate unique names for testing
const timestamp = Date.now();
const uniqueSkillName = `JavaScript Testing ${timestamp}`;
const uniqueCourseTitle = `JavaScript Testing Course ${timestamp}`;

// Helper function to make requests
const apiRequest = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    // Check if response is HTML (error page)
    if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<html>')) {
      return { 
        success: false, 
        error: 'Server returned HTML error page - check server configuration',
        status: error.response?.status || 500,
        html: error.response.data.substring(0, 200) + '...'
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Test functions
const testSkillsCRUD = async () => {
  console.log('\n=== TESTING SKILLS CRUD ===');
  
  // CREATE Skill
  console.log('\n1. Creating skill...');
  const createSkillResult = await apiRequest('POST', '/skills', {
    name: uniqueSkillName,
    description: 'Test skill for JavaScript',
    category: 'Programming',
    level: 'Intermediate'
  });
  
  if (createSkillResult.success) {
    testSkillId = createSkillResult.data.data._id;
    console.log('✅ Skill created:', createSkillResult.data.data.name);
  } else {
    console.log('❌ Skill creation failed:', createSkillResult.error);
    return;
  }
  
  // GET All Skills
  console.log('\n2. Getting all skills...');
  const getAllSkillsResult = await apiRequest('GET', '/skills');
  if (getAllSkillsResult.success) {
    console.log('✅ Skills retrieved:', getAllSkillsResult.data.data.skills.length, 'skills found');
  } else {
    console.log('❌ Get skills failed:', getAllSkillsResult.error);
  }
  
  // GET Skill by ID
  console.log('\n3. Getting skill by ID...');
  const getSkillResult = await apiRequest('GET', `/skills/${testSkillId}`);
  if (getSkillResult.success) {
    console.log('✅ Skill retrieved:', getSkillResult.data.data.name);
  } else {
    console.log('❌ Get skill by ID failed:', getSkillResult.error);
  }
  
  // UPDATE Skill
  console.log('\n4. Updating skill...');
  const updateSkillResult = await apiRequest('PUT', `/skills/${testSkillId}`, {
    name: 'JavaScript Testing (Updated)',
    description: 'Updated test skill description',
    category: 'Programming',
    level: 'Advanced'
  });
  
  if (updateSkillResult.success) {
    console.log('✅ Skill updated:', updateSkillResult.data.data.name);
  } else {
    console.log('❌ Skill update failed:', updateSkillResult.error);
  }
};

const testCoursesCRUD = async () => {
  console.log('\n=== TESTING COURSES CRUD ===');
  
  if (!testSkillId) {
    console.log('❌ No test skill ID available. Run skills test first.');
    return;
  }
  
  // CREATE Course
  console.log('\n1. Creating course...');
  const createCourseResult = await apiRequest('POST', '/courses', {
    title: uniqueCourseTitle,
    description: 'Comprehensive JavaScript testing course',
    skillId: testSkillId,
    duration: 40
  });
  
  if (createCourseResult.success) {
    testCourseId = createCourseResult.data.data._id;
    console.log('✅ Course created:', createCourseResult.data.data.title);
  } else {
    console.log('❌ Course creation failed:', createCourseResult.error);
    return;
  }
  
  // GET All Courses
  console.log('\n2. Getting all courses...');
  const getAllCoursesResult = await apiRequest('GET', '/courses');
  if (getAllCoursesResult.success) {
    console.log('✅ Courses retrieved:', getAllCoursesResult.data.data.courses.length, 'courses found');
  } else {
    console.log('❌ Get courses failed:', getAllCoursesResult.error);
  }
  
  // GET Course by ID
  console.log('\n3. Getting course by ID...');
  const getCourseResult = await apiRequest('GET', `/courses/${testCourseId}`);
  if (getCourseResult.success) {
    console.log('✅ Course retrieved:', getCourseResult.data.data.title);
    console.log('   Skill details:', getCourseResult.data.data.skillId.name);
  } else {
    console.log('❌ Get course by ID failed:', getCourseResult.error);
  }
  
  // UPDATE Course
  console.log('\n4. Updating course...');
  const updateCourseResult = await apiRequest('PUT', `/courses/${testCourseId}`, {
    title: 'JavaScript Testing Course (Updated)',
    description: 'Updated comprehensive JavaScript testing course',
    skillId: testSkillId,
    duration: 45
  });
  
  if (updateCourseResult.success) {
    console.log('✅ Course updated:', updateCourseResult.data.data.title);
  } else {
    console.log('❌ Course update failed:', updateCourseResult.error);
  }
};

const testUserAuth = async () => {
  console.log('\n=== TESTING USER AUTHENTICATION ===');
  
  // Register user (if endpoint exists)
  console.log('\n1. Creating test user...');
  const createUserResult = await apiRequest('POST', '/users/register', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'client'
  });
  
  if (createUserResult.success) {
    console.log('✅ User created:', createUserResult.data.data?.name || 'User created successfully');
  } else {
    console.log('ℹ️ User might already exist or endpoint not available:', createUserResult.error);
  }
  
  // Login user
  console.log('\n2. Logging in user...');
  const loginResult = await apiRequest('POST', '/users/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (loginResult.success) {
    authToken = loginResult.data.data?.token || loginResult.data.token;
    testUserId = loginResult.data.data?.user?._id || loginResult.data.user?._id;
    console.log('✅ User logged in, token received');
  } else {
    console.log('❌ Login failed:', loginResult.error);
  }
};

const testEnrollments = async () => {
  console.log('\n=== TESTING ENROLLMENTS ===');
  
  if (!authToken || !testCourseId) {
    console.log('❌ No auth token or test course ID available');
    return;
  }
  
  const authHeaders = { 'Authorization': `Bearer ${authToken}` };
  
  // Enroll in course
  console.log('\n1. Enrolling in course...');
  const enrollResult = await apiRequest('POST', '/enrollments/enroll', {
    courseId: testCourseId
  }, authHeaders);
  
  if (enrollResult.success) {
    console.log('✅ Enrolled in course:', enrollResult.data.data.courseId.title);
  } else {
    console.log('❌ Enrollment failed:', enrollResult.error);
  }
  
  // Get my courses
  console.log('\n2. Getting my courses...');
  const myCoursesResult = await apiRequest('GET', '/enrollments/my-courses', null, authHeaders);
  if (myCoursesResult.success) {
    console.log('✅ My courses retrieved:', myCoursesResult.data.data.enrollments.length, 'enrollments');
  } else {
    console.log('❌ Get my courses failed:', myCoursesResult.error);
  }
};

const cleanupTestData = async () => {
  console.log('\n=== CLEANING UP TEST DATA ===');
  
  // Delete test course
  if (testCourseId) {
    const deleteCourseResult = await apiRequest('DELETE', `/courses/${testCourseId}`);
    if (deleteCourseResult.success) {
      console.log('✅ Test course deleted');
    }
  }
  
  // Delete test skill
  if (testSkillId) {
    const deleteSkillResult = await apiRequest('DELETE', `/skills/${testSkillId}`);
    if (deleteSkillResult.success) {
      console.log('✅ Test skill deleted');
    }
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log('Make sure your server is running on http://localhost:5001');
  
  try {
    await testSkillsCRUD();
    await testCoursesCRUD();
    await testUserAuth();
    await testEnrollments();
    
    console.log('\n=== TEST SUMMARY ===');
    console.log('✅ All tests completed!');
    console.log('Check the logs above for any ❌ errors');
    
    // Uncomment to clean up test data
    // await cleanupTestData();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
};

// Run tests
runTests();
