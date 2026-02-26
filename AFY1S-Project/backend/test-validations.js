// Test API Validations Script
// Run with: node test-validations.js

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
      }
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

// Test skill validations
const testSkillValidations = async () => {
  console.log('\n=== TESTING SKILL VALIDATIONS ===');
  
  // Test 1: Missing required fields
  console.log('\n1. Testing missing required fields...');
  const result1 = await apiRequest('POST', '/skills', {
    description: 'Test description'
    // Missing name and level
  });
  console.log('Missing fields:', result1.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 2: Invalid name (too short)
  console.log('\n2. Testing name too short...');
  const result2 = await apiRequest('POST', '/skills', {
    name: 'A', // Too short
    level: 'Beginner'
  });
  console.log('Name too short:', result2.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 3: Invalid name (too long)
  console.log('\n3. Testing name too long...');
  const result3 = await apiRequest('POST', '/skills', {
    name: 'A'.repeat(101), // Too long
    level: 'Beginner'
  });
  console.log('Name too long:', result3.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 4: Invalid level
  console.log('\n4. Testing invalid level...');
  const result4 = await apiRequest('POST', '/skills', {
    name: 'Valid Skill Name',
    level: 'InvalidLevel'
  });
  console.log('Invalid level:', result4.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 5: Valid skill creation
  console.log('\n5. Testing valid skill creation...');
  const result5 = await apiRequest('POST', '/skills', {
    name: 'Valid Test Skill',
    description: 'A valid description for testing',
    category: 'Programming',
    level: 'Intermediate'
  });
  console.log('Valid skill:', result5.success ? '✅ Created successfully' : '❌ Should have succeeded');
  
  // Test 6: Invalid ID format
  console.log('\n6. Testing invalid ID format...');
  const result6 = await apiRequest('GET', '/skills/invalid-id');
  console.log('Invalid ID:', result6.success ? '❌ Should have failed' : '✅ Correctly rejected');
};

// Test course validations
const testCourseValidations = async () => {
  console.log('\n=== TESTING COURSE VALIDATIONS ===');
  
  // Test 1: Missing required fields
  console.log('\n1. Testing missing required fields...');
  const result1 = await apiRequest('POST', '/courses', {
    description: 'Test description'
    // Missing title, skillId, duration
  });
  console.log('Missing fields:', result1.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 2: Invalid title (too short)
  console.log('\n2. Testing title too short...');
  const result2 = await apiRequest('POST', '/courses', {
    title: 'Course', // Too short (min 5)
    skillId: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format
    duration: 10
  });
  console.log('Title too short:', result2.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 3: Invalid duration
  console.log('\n3. Testing invalid duration...');
  const result3 = await apiRequest('POST', '/courses', {
    title: 'Valid Course Title',
    skillId: '507f1f77bcf86cd799439011',
    duration: 0 // Invalid (min 1)
  });
  console.log('Invalid duration:', result3.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 4: Invalid skillId format
  console.log('\n4. Testing invalid skillId format...');
  const result4 = await apiRequest('POST', '/courses', {
    title: 'Valid Course Title',
    skillId: 'invalid-id',
    duration: 10
  });
  console.log('Invalid skillId:', result4.success ? '❌ Should have failed' : '✅ Correctly rejected');
};

// Test enrollment validations
const testEnrollmentValidations = async () => {
  console.log('\n=== TESTING ENROLLMENT VALIDATIONS ===');
  
  // First, login to get token
  console.log('\n0. Logging in for enrollment tests...');
  const loginResult = await apiRequest('POST', '/users/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (!loginResult.success) {
    console.log('❌ Login failed, skipping enrollment tests');
    return;
  }
  
  const token = loginResult.data.token;
  const authHeaders = { 'Authorization': `Bearer ${token}` };
  
  // Test 1: Invalid courseId format
  console.log('\n1. Testing invalid courseId format...');
  const result1 = await apiRequest('POST', '/enrollments/enroll', {
    courseId: 'invalid-id'
  }, authHeaders);
  console.log('Invalid courseId:', result1.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 2: Invalid progress value
  console.log('\n2. Testing invalid progress value...');
  const result2 = await apiRequest('PUT', '/enrollments/507f1f77bcf86cd799439011/progress', {
    progress: 150 // Invalid (max 100)
  }, authHeaders);
  console.log('Invalid progress:', result2.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 3: Invalid progress (negative)
  console.log('\n3. Testing negative progress...');
  const result3 = await apiRequest('PUT', '/enrollments/507f1f77bcf86cd799439011/progress', {
    progress: -10 // Invalid (min 0)
  }, authHeaders);
  console.log('Negative progress:', result3.success ? '❌ Should have failed' : '✅ Correctly rejected');
  
  // Test 4: Invalid enrollment ID format
  console.log('\n4. Testing invalid enrollment ID format...');
  const result4 = await apiRequest('PUT', '/enrollments/invalid-id/complete', {}, authHeaders);
  console.log('Invalid enrollment ID:', result4.success ? '❌ Should have failed' : '✅ Correctly rejected');
};

// Main test runner
const runValidationTests = async () => {
  console.log('🔍 Starting Validation Tests...');
  console.log('Make sure your server is running on http://localhost:5001');
  
  try {
    await testSkillValidations();
    await testCourseValidations();
    await testEnrollmentValidations();
    
    console.log('\n=== VALIDATION TEST SUMMARY ===');
    console.log('✅ All validation tests completed!');
    console.log('Check the logs above for detailed results');
    
  } catch (error) {
    console.error('❌ Validation test suite failed:', error.message);
  }
};

// Run tests
runValidationTests();
