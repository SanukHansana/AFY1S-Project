// Simple test to check if server is responding
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

async function testServer() {
  console.log('Testing server connectivity...');
  
  try {
    // Test a simple GET request to skills
    const response = await axios.get(`${API_BASE}/skills`);
    console.log('✅ Server is responding!');
    console.log('Skills endpoint response:', response.status, response.data);
  } catch (error) {
    console.log('❌ Server error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testServer();
