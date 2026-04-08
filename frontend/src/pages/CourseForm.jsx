//frontend/src/pages/CourseForm.jsx
import React, { useState, useEffect } from 'react';
import { createCourse } from '../services/courseService.jsx';
import { getSkills } from '../services/skillService.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NavBar from '../Components/NavBar.jsx';
import Footer from '../Components/Footer.jsx';

const CourseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: '',
    duration: ''
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
        setSkillsLoading(false);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.skillId || !formData.duration) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Ensure duration is sent as a number
      const courseData = {
        title: formData.title,
        description: formData.description,
        skillId: formData.skillId,
        duration: Number(formData.duration) // Convert to number
      };
      
      await createCourse(courseData);
      toast.success('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        skillId: '',
        duration: ''
      });
      navigate('/courses');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      toast.error(errorMessage);
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 pt-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Create New Course</h1>
              <p className="text-blue-100 mt-2">Add a new course to your learning platform</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Advanced React Development"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe what students will learn in this course..."
                  required
                />
              </div>

              {/* Skill Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Related Skill *
                </label>
                {skillsLoading ? (
                  <div className="flex items-center justify-center py-3">
                    <div className="loading loading-spinner loading-sm"></div>
                    <span className="ml-2 text-gray-500">Loading skills...</span>
                  </div>
                ) : (
                  <select
                    name="skillId"
                    value={formData.skillId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.id || skill._id} value={skill.id || skill._id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                )}
                {skills.length === 0 && !skillsLoading && (
                  <p className="text-sm text-gray-500 mt-2">
                    No skills available. <a href="/skills" className="text-blue-600 hover:underline">Create a skill first</a>
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 40, 80, 160"
                  required
                />
                <p className="text-gray-500 text-sm mt-1">Enter duration in hours (1-1000)</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || skillsLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      Creating Course...
                    </span>
                  ) : (
                    'Create Course'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseForm;
