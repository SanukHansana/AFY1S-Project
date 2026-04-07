import api from '../lib/api.js';

// Enroll in a course
export const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

// Get user's enrolled courses
export const getMyCourses = async () => {
  try {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
};

// Update enrollment progress
export const updateProgress = async (enrollmentId, progress) => {
  try {
    const response = await api.put(`/enrollments/${enrollmentId}/progress`, { progress });
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

// Complete a course
export const completeCourse = async (enrollmentId) => {
  try {
    const response = await api.put(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing course:', error);
    throw error;
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (enrollmentId) => {
  try {
    const response = await api.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    throw error;
  }
};

// Get enrollment details
export const getEnrollmentDetails = async (enrollmentId) => {
  try {
    const response = await api.get(`/enrollments/${enrollmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    throw error;
  }
};
