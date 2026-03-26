import React, { useState, useEffect } from 'react';
import { updateSkill } from '../services/skillService.jsx';
import toast from 'react-hot-toast';

const EditSkillForm = ({ skill, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || '',
        level: skill.level || '',
        description: skill.description || ''
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSkill(skill.id || skill._id, formData);
      toast.success('Skill updated successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to update skill');
      console.error('Error updating skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Edit Skill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter skill name"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter skill category"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Level</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter skill description (optional - will be auto-fetched if empty)"
            />
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Update Skill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillForm;
