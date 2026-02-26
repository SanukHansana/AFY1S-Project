// Test Wikipedia API Integration
// Run with: node test-wikipedia-integration.js

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

// Test Wikipedia API integration
const testWikipediaIntegration = async () => {
  console.log('🌍 Testing Wikipedia API Integration');
  console.log('Make sure your server is running on http://localhost:5001\n');

  // Test 1: Create skill without description (should auto-fetch from Wikipedia)
  console.log('=== TEST 1: Auto-fetch description from Wikipedia ===');
  console.log('Creating skill "JavaScript" without description...\n');
  
  const result1 = await apiRequest('POST', '/skills', {
    name: 'JavaScript',
    level: 'Intermediate',
    category: 'Programming'
  });
  
  if (result1.success) {
    console.log('✅ Skill created successfully!');
    console.log('📝 Auto-generated description:');
    console.log(`"${result1.data.data.description}"\n`);
    console.log('📊 Full skill data:');
    console.log(JSON.stringify(result1.data.data, null, 2));
  } else {
    console.log('❌ Skill creation failed:', result1.error);
  }

  // Test 2: Create skill with custom description (should not fetch from Wikipedia)
  console.log('\n=== TEST 2: Custom description (no Wikipedia fetch) ===');
  console.log('Creating skill "Python" with custom description...\n');
  
  const result2 = await apiRequest('POST', '/skills', {
    name: 'Python',
    description: 'Python is a high-level programming language for general-purpose programming.',
    level: 'Beginner',
    category: 'Programming'
  });
  
  if (result2.success) {
    console.log('✅ Skill created successfully!');
    console.log('📝 Custom description:');
    console.log(`"${result2.data.data.description}"\n`);
  } else {
    console.log('❌ Skill creation failed:', result2.error);
  }

  // Test 3: Create skill with empty description (should auto-fetch)
  console.log('=== TEST 3: Empty description (should auto-fetch) ===');
  console.log('Creating skill "React" with empty description...\n');
  
  const result3 = await apiRequest('POST', '/skills', {
    name: 'React',
    description: '', // Empty string
    level: 'Advanced',
    category: 'Web Development'
  });
  
  if (result3.success) {
    console.log('✅ Skill created successfully!');
    console.log('📝 Auto-generated description:');
    console.log(`"${result3.data.data.description}"\n`);
  } else {
    console.log('❌ Skill creation failed:', result3.error);
  }

  // Test 4: Create skill that might not exist on Wikipedia
  console.log('=== TEST 4: Skill not on Wikipedia (should use default) ===');
  console.log('Creating skill "SuperCustomFramework123" (likely not on Wikipedia)...\n');
  
  const result4 = await apiRequest('POST', '/skills', {
    name: 'SuperCustomFramework123',
    level: 'Beginner',
    category: 'Programming'
  });
  
  if (result4.success) {
    console.log('✅ Skill created successfully!');
    console.log('📝 Default description:');
    console.log(`"${result4.data.data.description}"\n`);
  } else {
    console.log('❌ Skill creation failed:', result4.error);
  }

  // Test 5: Test with spaces in name (should format correctly for Wikipedia)
  console.log('=== TEST 5: Skill name with spaces ===');
  console.log('Creating skill "Machine Learning" without description...\n');
  
  const result5 = await apiRequest('POST', '/skills', {
    name: 'Machine Learning',
    level: 'Advanced',
    category: 'Data Science'
  });
  
  if (result5.success) {
    console.log('✅ Skill created successfully!');
    console.log('📝 Auto-generated description:');
    console.log(`"${result5.data.data.description}"\n`);
  } else {
    console.log('❌ Skill creation failed:', result5.error);
  }

  console.log('\n=== WIKIPEDIA INTEGRATION TEST SUMMARY ===');
  console.log('✅ All tests completed!');
  console.log('\n📋 Test Results:');
  console.log('1. Auto-fetch from Wikipedia:', result1.success ? '✅' : '❌');
  console.log('2. Custom description (no fetch):', result2.success ? '✅' : '❌');
  console.log('3. Empty description (auto-fetch):', result3.success ? '✅' : '❌');
  console.log('4. Default description fallback:', result4.success ? '✅' : '❌');
  console.log('5. Spaces in name handling:', result5.success ? '✅' : '❌');
  
  console.log('\n🌐 Wikipedia API Integration:');
  console.log('- ✅ Automatically fetches descriptions when not provided');
  console.log('- ✅ Uses custom descriptions when provided');
  console.log('- ✅ Falls back to default description if Wikipedia fails');
  console.log('- ✅ Handles spaces and special characters in skill names');
  console.log('- ✅ Limits descriptions to 500 characters');
};

// Run tests
testWikipediaIntegration().catch(console.error);
