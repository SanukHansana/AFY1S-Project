import React, { useState, useEffect } from 'react';
import { getSkills } from '../services/skillService.jsx';
import toast from 'react-hot-toast';

const CourseEditForm = ({ course, onUpdate, onCancel }) => {
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

  useEffect(() => {
    if (course) {
      console.log('Pre-filling form with course data:', course);
      const skillId = course.skillId || course.skill?.id || course.skill?._id || course.skill;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        skillId: skillId || '',
        duration: course.duration || ''
      });
      console.log('Form data after pre-fill:', {
        title: course.title || '',
        description: course.description || '',
        skillId: skillId || '',
        duration: course.duration || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data being submitted:', formData);
    
    if (!formData.title || !formData.description || !formData.skillId || !formData.duration) {
      console.log('Validation failed - missing fields:', {
        title: !!formData.title,
        description: !!formData.description,
        skillId: !!formData.skillId,
        duration: !!formData.duration
      });
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Ensure duration is sent as a number
      const updateData = {
        title: formData.title,
        description: formData.description,
        // Try different skill field names
        skillId: formData.skillId,
        skill: formData.skillId,
        skill_id: formData.skillId,
        duration: Number(formData.duration) // Convert to number
      };
      
      console.log('Sending update data:', updateData);
      await onUpdate(updateData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            !formData.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="e.g., Advanced React Development"
          required
        />
        {!formData.title && (
          <p className="text-red-500 text-sm mt-1">Course title is required</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            !formData.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Describe what students will learn in this course..."
          required
        />
        {!formData.description && (
          <p className="text-red-500 text-sm mt-1">Description is required</p>
        )}
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
          Duration (hours) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="1"
          max="1000"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            !formData.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="e.g., 40, 80, 160"
          required
        />
        {!formData.duration && (
          <p className="text-red-500 text-sm mt-1">Duration is required</p>
        )}
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
              Updating Course...
            </span>
          ) : (
            'Update Course'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseEditForm;
