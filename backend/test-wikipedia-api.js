// Direct Wikipedia API Test
// Run with: node test-wikipedia-api.js

import axios from 'axios';

const testWikipediaAPI = async (skillName) => {
  console.log(`🔍 Testing Wikipedia API for: "${skillName}"`);
  
  try {
    // Format the skill name for Wikipedia URL (replace spaces with underscores)
    const formattedName = skillName.replace(/\s+/g, '_');
    
    console.log(`📡 Requesting: https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`);
    
    // Call Wikipedia REST API
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`,
      {
        timeout: 5000, // 5 second timeout
        headers: {
          'User-Agent': 'Learning-Platform-API/1.0'
        }
      }
    );
    
    console.log('✅ Wikipedia API Response:');
    console.log('📄 Title:', response.data.title);
    console.log('📝 Description:', response.data.extract);
    console.log('🔗 URL:', response.data.content_urls?.desktop?.page);
    console.log('🖼️  Thumbnail:', response.data.thumbnail?.source);
    
    // Limit description to 500 characters for our model
    const description = response.data.extract.substring(0, 500);
    console.log('\n📏 Limited to 500 characters:');
    console.log(`"${description}"`);
    
    return description;
    
  } catch (error) {
    console.log('❌ Wikipedia API Error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.detail || error.message);
    return null;
  }
};

// Test multiple skills
const testMultipleSkills = async () => {
  console.log('🌍 Wikipedia API Direct Test');
  console.log('=====================================\n');
  
  const skills = [
    'JavaScript',
    'Python',
    'React',
    'Machine Learning',
    'NonExistentSkill12345'
  ];
  
  for (const skill of skills) {
    await testWikipediaAPI(skill);
    console.log('\n' + '='.repeat(50) + '\n');
  }
  
  console.log('✅ Wikipedia API testing completed!');
};

// Run tests
testMultipleSkills().catch(console.error);
