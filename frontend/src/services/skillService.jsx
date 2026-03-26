import api from '../lib/api.js';

// Get all skills
export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    console.log('Raw skills response:', response.data);
    
    // Handle different response formats
    if (response.data?.success && response.data?.data?.skills) {
      console.log('Format 1 - Extracted skills:', response.data.data.skills);
      return response.data.data.skills;
    } else if (response.data?.skills) {
      console.log('Format 2 - Direct skills:', response.data.skills);
      return response.data.skills;
    } else if (Array.isArray(response.data)) {
      console.log('Format 3 - Direct array:', response.data);
      return response.data;
    } else {
      console.log('Unknown format, trying to extract:', response.data);
      // Try to find skills array in nested structure
      const possibleSkills = response.data?.data || response.data;
      if (Array.isArray(possibleSkills)) {
        return possibleSkills;
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// Create a new skill
export const createSkill = async (data) => {
  try {
    console.log('Sending skill creation data:', data);
    const response = await api.post('/skills', data);
    console.log('Skill creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error.response ? error.response.data : error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

// Update an existing skill
export const updateSkill = async (id, data) => {
  try {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

// Delete a skill
export const deleteSkill = async (id) => {
  try {
    console.log('Deleting skill with ID:', id);
    const response = await api.delete(`/skills/${id}`);
    console.log('Delete skill response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};
