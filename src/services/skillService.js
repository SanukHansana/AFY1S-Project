import api from '../lib/api.js';

// Get all skills
export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// Create a new skill
export const createSkill = async (data) => {
  try {
    const response = await api.post('/skills', data);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
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
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};
