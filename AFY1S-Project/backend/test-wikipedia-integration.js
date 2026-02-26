// Test Wikipedia Integration
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const testWikipediaIntegration = async () => {
  console.log('🌍 Testing Wikipedia API Integration...\n');

  // Test 1: Create skill without description (should fetch from Wikipedia)
  console.log('1. Creating skill "JavaScript" without description...');
  const result1 = await axios.post(`${API_BASE}/skills`, {
    name: 'JavaScript',
    level: 'Intermediate',
    category: 'Programming'
  }).catch(err => ({ error: err.response?.data || err.message }));

  if (result1.data?.success) {
    console.log('✅ Success! Description source:', result1.data.data.descriptionSource);
    console.log('Description:', result1.data.data.description?.substring(0, 100) + '...');
  } else {
    console.log('❌ Failed:', result1.error);
  }

  // Test 2: Create skill with custom description
  console.log('\n2. Creating skill with custom description...');
  const result2 = await axios.post(`${API_BASE}/skills`, {
    name: 'Custom Skill',
    description: 'This is a custom description provided by user',
    level: 'Beginner',
    category: 'Testing'
  }).catch(err => ({ error: err.response?.data || err.message }));

  if (result2.data?.success) {
    console.log('✅ Success! Description source:', result2.data.data.descriptionSource);
  } else {
    console.log('❌ Failed:', result2.error);
  }

  // Test 3: Try skill that might not exist on Wikipedia
  console.log('\n3. Creating skill "RandomSkill123" (likely not on Wikipedia)...');
  const result3 = await axios.post(`${API_BASE}/skills`, {
    name: 'RandomSkill123',
    level: 'Advanced',
    category: 'Testing'
  }).catch(err => ({ error: err.response?.data || err.message }));

  if (result3.data?.success) {
    console.log('✅ Success! Used default description');
    console.log('Description:', result3.data.data.description);
  } else {
    console.log('❌ Failed:', result3.error);
  }
};

testWikipediaIntegration();
