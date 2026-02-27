// CRUD Operations Test with Database Connection Check
// Run with: node test-crud-with-db.js

import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

// Helper function to make requests
const apiRequest = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000 // 10 second timeout
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Check if server is running
const checkServerStatus = async () => {
  console.log('🔍 Checking server status...');
  const result = await apiRequest('GET', '/skills');
  
  if (result.status === 500 && result.error?.message?.includes('MongoDB')) {
    return { running: true, dbConnected: false, error: 'Database connection issue' };
  } else if (result.status === 500) {
    return { running: true, dbConnected: false, error: 'Server error' };
  } else if (result.status === 404) {
    return { running: true, dbConnected: true, error: null };
  } else {
    return { running: true, dbConnected: true, error: null };
  }
};

// Test Skills CRUD
const testSkillsCRUD = async () => {
  console.log('\n🎯 TESTING SKILLS CRUD OPERATIONS');
  console.log('=====================================');
  
  let skillId = null;
  const timestamp = Date.now();
  
  // CREATE
  console.log('\n1. Creating a skill...');
  const createResult = await apiRequest('POST', '/skills', {
    name: `Test Skill ${timestamp}`,
    description: 'A test skill for CRUD operations',
    category: 'Testing',
    level: 'Intermediate'
  });
  
  if (createResult.success) {
    skillId = createResult.data.data._id;
    console.log('✅ Skill created successfully');
    console.log('📝 Skill ID:', skillId);
    console.log('📊 Skill name:', createResult.data.data.name);
  } else {
    console.log('❌ Skill creation failed');
    console.log('📝 Error:', createResult.error?.message || createResult.error);
    if (createResult.status === 400) {
      console.log('💡 This might be a validation error - check the error details above');
    }
    return { success: false, stage: 'create', error: createResult.error };
  }
  
  // READ ALL
  console.log('\n2. Reading all skills...');
  const readAllResult = await apiRequest('GET', '/skills');
  if (readAllResult.success) {
    const skillsCount = readAllResult.data.data.skills?.length || readAllResult.data.data?.length || 0;
    console.log('✅ All skills retrieved successfully');
    console.log('📊 Total skills:', skillsCount);
  } else {
    console.log('❌ Reading all skills failed');
    console.log('📝 Error:', readAllResult.error?.message || readAllResult.error);
  }
  
  // READ ONE
  console.log('\n3. Reading single skill...');
  const readOneResult = await apiRequest('GET', `/skills/${skillId}`);
  if (readOneResult.success) {
    console.log('✅ Single skill retrieved successfully');
    console.log('📝 Skill name:', readOneResult.data.data.name);
    console.log('📝 Skill level:', readOneResult.data.data.level);
  } else {
    console.log('❌ Reading single skill failed');
    console.log('📝 Error:', readOneResult.error?.message || readOneResult.error);
  }
  
  // UPDATE
  console.log('\n4. Updating skill...');
  const updateResult = await apiRequest('PUT', `/skills/${skillId}`, {
    name: `Updated Test Skill ${timestamp}`,
    description: 'Updated description for testing',
    category: 'Updated Testing',
    level: 'Advanced'
  });
  if (updateResult.success) {
    console.log('✅ Skill updated successfully');
    console.log('📝 Updated name:', updateResult.data.data.name);
    console.log('📝 Updated level:', updateResult.data.data.level);
  } else {
    console.log('❌ Skill update failed');
    console.log('📝 Error:', updateResult.error?.message || updateResult.error);
  }
  
  // DELETE
  console.log('\n5. Deleting skill...');
  const deleteResult = await apiRequest('DELETE', `/skills/${skillId}`);
  if (deleteResult.success) {
    console.log('✅ Skill deleted successfully');
  } else {
    console.log('❌ Skill deletion failed');
    console.log('📝 Error:', deleteResult.error?.message || deleteResult.error);
  }
  
  return {
    create: createResult.success,
    readAll: readAllResult.success,
    readOne: readOneResult.success,
    update: updateResult.success,
    delete: deleteResult.success
  };
};

// Test Courses CRUD
const testCoursesCRUD = async () => {
  console.log('\n📚 TESTING COURSES CRUD OPERATIONS');
  console.log('=====================================');
  
  let courseId = null;
  const timestamp = Date.now();
  
  // First create a skill to reference
  console.log('\n0. Creating a skill for course reference...');
  const skillResult = await apiRequest('POST', '/skills', {
    name: `Course Test Skill ${timestamp}`,
    level: 'Intermediate',
    category: 'Programming'
  });
  
  if (!skillResult.success) {
    console.log('❌ Failed to create skill for course reference');
    console.log('📝 Error:', skillResult.error?.message || skillResult.error);
    return { success: false, stage: 'create-skill', error: skillResult.error };
  }
  
  const skillId = skillResult.data.data._id;
  console.log('✅ Reference skill created with ID:', skillId);
  
  // CREATE
  console.log('\n1. Creating a course...');
  const createResult = await apiRequest('POST', '/courses', {
    title: `Test Course ${timestamp}`,
    description: 'A test course for CRUD operations with proper length validation',
    skillId: skillId,
    duration: 40
  });
  
  if (createResult.success) {
    courseId = createResult.data.data._id;
    console.log('✅ Course created successfully');
    console.log('📝 Course ID:', courseId);
    console.log('📊 Course title:', createResult.data.data.title);
  } else {
    console.log('❌ Course creation failed');
    console.log('📝 Error:', createResult.error?.message || createResult.error);
    return { success: false, stage: 'create-course', error: createResult.error };
  }
  
  // READ ALL
  console.log('\n2. Reading all courses...');
  const readAllResult = await apiRequest('GET', '/courses');
  if (readAllResult.success) {
    const coursesCount = readAllResult.data.data.courses?.length || readAllResult.data.data?.length || 0;
    console.log('✅ All courses retrieved successfully');
    console.log('📊 Total courses:', coursesCount);
  } else {
    console.log('❌ Reading all courses failed');
    console.log('📝 Error:', readAllResult.error?.message || readAllResult.error);
  }
  
  // READ ONE
  console.log('\n3. Reading single course...');
  const readOneResult = await apiRequest('GET', `/courses/${courseId}`);
  if (readOneResult.success) {
    console.log('✅ Single course retrieved successfully');
    console.log('📝 Course title:', readOneResult.data.data.title);
    console.log('🔗 Skill populated:', readOneResult.data.data.skillId?.name || 'Not populated');
  } else {
    console.log('❌ Reading single course failed');
    console.log('📝 Error:', readOneResult.error?.message || readOneResult.error);
  }
  
  // UPDATE
  console.log('\n4. Updating course...');
  const updateResult = await apiRequest('PUT', `/courses/${courseId}`, {
    title: `Updated Test Course ${timestamp}`,
    description: 'Updated description for testing CRUD operations with proper validation',
    duration: 60
  });
  if (updateResult.success) {
    console.log('✅ Course updated successfully');
    console.log('📝 Updated title:', updateResult.data.data.title);
    console.log('📝 Updated duration:', updateResult.data.data.duration);
  } else {
    console.log('❌ Course update failed');
    console.log('📝 Error:', updateResult.error?.message || updateResult.error);
  }
  
  // DELETE
  console.log('\n5. Deleting course...');
  const deleteResult = await apiRequest('DELETE', `/courses/${courseId}`);
  if (deleteResult.success) {
    console.log('✅ Course deleted successfully');
  } else {
    console.log('❌ Course deletion failed');
    console.log('📝 Error:', deleteResult.error?.message || deleteResult.error);
  }
  
  // Clean up the skill
  console.log('\n6. Cleaning up reference skill...');
  await apiRequest('DELETE', `/skills/${skillId}`);
  
  return {
    create: createResult.success,
    readAll: readAllResult.success,
    readOne: readOneResult.success,
    update: updateResult.success,
    delete: deleteResult.success
  };
};

// Test Enrollments CRUD
const testEnrollmentsCRUD = async () => {
  console.log('\n👥 TESTING ENROLLMENTS CRUD OPERATIONS');
  console.log('=====================================');
  
  const timestamp = Date.now();
  
  // Login or create user
  console.log('\n0. Setting up user authentication...');
  let token = null;
  
  // Try to login first
  const loginResult = await apiRequest('POST', '/users/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (loginResult.success) {
    token = loginResult.data.token;
    console.log('✅ User logged in successfully');
  } else {
    console.log('⚠️  Login failed, attempting to create test user...');
    const createUserResult = await apiRequest('POST', '/users', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client'
    });
    
    if (createUserResult.success) {
      console.log('✅ Test user created successfully');
      // Try login again
      const retryLogin = await apiRequest('POST', '/users/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (retryLogin.success) {
        token = retryLogin.data.token;
        console.log('✅ User logged in successfully');
      } else {
        console.log('❌ Still failed to login after user creation');
        return { success: false, stage: 'login', error: retryLogin.error };
      }
    } else {
      console.log('❌ Failed to create test user');
      console.log('📝 Error:', createUserResult.error?.message || createUserResult.error);
      return { success: false, stage: 'create-user', error: createUserResult.error };
    }
  }
  
  const authHeaders = { 'Authorization': `Bearer ${token}` };
  
  // Create skill and course for enrollment
  console.log('\n0. Creating skill and course for enrollment...');
  const skillResult = await apiRequest('POST', '/skills', {
    name: `Enrollment Test Skill ${timestamp}`,
    level: 'Beginner',
    category: 'Testing'
  });
  
  if (!skillResult.success) {
    console.log('❌ Failed to create skill for enrollment');
    console.log('📝 Error:', skillResult.error?.message || skillResult.error);
    return { success: false, stage: 'create-enrollment-skill', error: skillResult.error };
  }
  
  const courseResult = await apiRequest('POST', '/courses', {
    title: `Enrollment Test Course ${timestamp}`,
    description: 'A test course for enrollment CRUD operations',
    skillId: skillResult.data.data._id,
    duration: 30
  });
  
  if (!courseResult.success) {
    console.log('❌ Failed to create course for enrollment');
    console.log('📝 Error:', courseResult.error?.message || courseResult.error);
    return { success: false, stage: 'create-enrollment-course', error: courseResult.error };
  }
  
  const courseId = courseResult.data.data._id;
  let enrollmentId = null;
  
  // CREATE (Enroll)
  console.log('\n1. Enrolling in course...');
  const enrollResult = await apiRequest('POST', '/enrollments/enroll', {
    courseId: courseId
  }, authHeaders);
  
  if (enrollResult.success) {
    enrollmentId = enrollResult.data.data._id;
    console.log('✅ Successfully enrolled in course');
    console.log('📝 Enrollment ID:', enrollmentId);
    console.log('📊 Initial progress:', enrollResult.data.data.progress);
  } else {
    console.log('❌ Enrollment failed');
    console.log('📝 Error:', enrollResult.error?.message || enrollResult.error);
    return { success: false, stage: 'enroll', error: enrollResult.error };
  }
  
  // READ (Get My Courses)
  console.log('\n2. Getting my courses...');
  const myCoursesResult = await apiRequest('GET', '/enrollments/my-courses', null, authHeaders);
  if (myCoursesResult.success) {
    const enrollmentsCount = myCoursesResult.data.data.enrollments?.length || 0;
    console.log('✅ My courses retrieved successfully');
    console.log('📊 Total enrollments:', enrollmentsCount);
  } else {
    console.log('❌ Getting my courses failed');
    console.log('📝 Error:', myCoursesResult.error?.message || myCoursesResult.error);
  }
  
  // UPDATE (Update Progress)
  console.log('\n3. Updating progress...');
  const updateProgressResult = await apiRequest('PUT', `/enrollments/${enrollmentId}/progress`, {
    progress: 75
  }, authHeaders);
  if (updateProgressResult.success) {
    console.log('✅ Progress updated successfully');
    console.log('📊 New progress:', updateProgressResult.data.data.progress);
    console.log('📊 Status:', updateProgressResult.data.data.status);
  } else {
    console.log('❌ Progress update failed');
    console.log('📝 Error:', updateProgressResult.error?.message || updateProgressResult.error);
  }
  
  // UPDATE (Complete Course)
  console.log('\n4. Completing course...');
  const completeResult = await apiRequest('PUT', `/enrollments/${enrollmentId}/complete`, {}, authHeaders);
  if (completeResult.success) {
    console.log('✅ Course completed successfully');
    console.log('📊 Final status:', completeResult.data.data.status);
    console.log('📊 Completed at:', completeResult.data.data.completedAt);
  } else {
    console.log('❌ Course completion failed');
    console.log('📝 Error:', completeResult.error?.message || completeResult.error);
  }
  
  // Clean up
  console.log('\n5. Cleaning up test data...');
  await apiRequest('DELETE', `/courses/${courseId}`);
  await apiRequest('DELETE', `/skills/${skillResult.data.data._id}`);
  
  return {
    enroll: enrollResult.success,
    read: myCoursesResult.success,
    updateProgress: updateProgressResult.success,
    complete: completeResult.success
  };
};

// Main test runner
const runAllCRUDTests = async () => {
  console.log('🔍 COMPREHENSIVE CRUD OPERATIONS TEST');
  console.log('=====================================');
  
  // Check server status first
  const serverStatus = await checkServerStatus();
  
  if (!serverStatus.running) {
    console.log('❌ Server is not running on http://localhost:5001');
    console.log('💡 Please start the server with: npm start');
    return;
  }
  
  if (!serverStatus.dbConnected) {
    console.log('⚠️  Server is running but database connection issue detected');
    console.log('📝 Error:', serverStatus.error);
    console.log('💡 CRUD operations may fail due to database issues');
    console.log('🔍 Continuing with tests to check API endpoints...\n');
  } else {
    console.log('✅ Server is running and database is connected\n');
  }
  
  try {
    const skillResults = await testSkillsCRUD();
    const courseResults = await testCoursesCRUD();
    const enrollmentResults = await testEnrollmentsCRUD();
    
    console.log('\n📊 CRUD OPERATIONS SUMMARY');
    console.log('=====================================');
    
    console.log('\n🎯 Skills CRUD:');
    console.log('- Create:', skillResults.create ? '✅' : '❌');
    console.log('- Read All:', skillResults.readAll ? '✅' : '❌');
    console.log('- Read One:', skillResults.readOne ? '✅' : '❌');
    console.log('- Update:', skillResults.update ? '✅' : '❌');
    console.log('- Delete:', skillResults.delete ? '✅' : '❌');
    
    console.log('\n📚 Courses CRUD:');
    console.log('- Create:', courseResults.create ? '✅' : '❌');
    console.log('- Read All:', courseResults.readAll ? '✅' : '❌');
    console.log('- Read One:', courseResults.readOne ? '✅' : '❌');
    console.log('- Update:', courseResults.update ? '✅' : '❌');
    console.log('- Delete:', courseResults.delete ? '✅' : '❌');
    
    console.log('\n👥 Enrollments CRUD:');
    console.log('- Enroll:', enrollmentResults.enroll ? '✅' : '❌');
    console.log('- Read My Courses:', enrollmentResults.read ? '✅' : '❌');
    console.log('- Update Progress:', enrollmentResults.updateProgress ? '✅' : '❌');
    console.log('- Complete Course:', enrollmentResults.complete ? '✅' : '❌');
    
    // Calculate overall success
    const skillPass = skillResults.success !== false && Object.values(skillResults).every(v => v === true);
    const coursePass = courseResults.success !== false && Object.values(courseResults).every(v => v === true);
    const enrollmentPass = enrollmentResults.success !== false && Object.values(enrollmentResults).every(v => v === true);
    
    console.log('\n🏆 OVERALL CRUD RESULTS:');
    console.log('Skills:', skillPass ? '✅ ALL WORKING' : '❌ SOME ISSUES');
    console.log('Courses:', coursePass ? '✅ ALL WORKING' : '❌ SOME ISSUES');
    console.log('Enrollments:', enrollmentPass ? '✅ ALL WORKING' : '❌ SOME ISSUES');
    
    if (skillPass && coursePass && enrollmentPass) {
      console.log('\n🎉 ALL CRUD OPERATIONS WORKING PERFECTLY!');
    } else {
      console.log('\n⚠️  Some CRUD operations need attention');
      console.log('💡 Check the error messages above for details');
    }
    
    if (!serverStatus.dbConnected) {
      console.log('\n🔧 DATABASE NOTE:');
      console.log('Some failures might be due to database connection issues.');
      console.log('Please check your MongoDB connection configuration.');
    }
    
  } catch (error) {
    console.error('❌ CRUD test suite failed:', error.message);
  }
};

// Run tests
runAllCRUDTests().catch(console.error);
