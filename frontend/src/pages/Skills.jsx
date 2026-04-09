//frontend/src/pages/Skills.jsx

import React, { useState, useEffect } from 'react';

import { getSkills, deleteSkill } from '../services/skillService.jsx';

import SkillForm from '../Components/SkillForm.jsx';

import EditSkillForm from '../Components/EditSkillForm.jsx';

import NavBar from '../Components/NavBar.jsx';

import Footer from '../Components/Footer.jsx';

import toast from 'react-hot-toast';

import { checkAdmin } from '../utils/authHelpers.js';



const Skills = () => {

  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);

  const [selectedSkill, setSelectedSkill] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);



  useEffect(() => {

    // Check admin role

    const adminStatus = checkAdmin();

    setIsAdmin(adminStatus);



    const fetchSkills = async () => {

      try {

        console.log('Fetching skills...');

        const data = await getSkills();

        console.log('Skills data received:', data);

        // Handle different response formats

        let skillsArray = [];

        

        if (Array.isArray(data)) {

          skillsArray = data;

        } else if (data?.skills && Array.isArray(data.skills)) {

          skillsArray = data.skills;

        } else if (data?.data?.skills && Array.isArray(data.data.skills)) {

          skillsArray = data.data.skills;

        } else {

          console.warn('Unexpected data format:', data);

          skillsArray = [];

        }

        

        console.log('Final skills array:', skillsArray);

        setSkills(skillsArray);

        setLoading(false);

      } catch (err) {

        console.error('Error fetching skills:', err);

        setError('Failed to fetch skills');

        setLoading(false);

      }

    };



    fetchSkills();

  }, []);



  const handleSkillCreated = () => {

    // Refresh skills list after creating a new skill

    const fetchSkills = async () => {

      try {

        console.log('Refreshing skills after creation...');

        const data = await getSkills();

        console.log('Skills data after creation:', data);

        const skillsArray = Array.isArray(data) ? data : [];

        console.log('Skills array after creation:', skillsArray);

        setSkills(skillsArray);

        setShowForm(false);

      } catch (err) {

        console.error('Error refreshing skills:', err);

      }

    };

    fetchSkills();

  };



  const handleSkillUpdated = () => {

    // Refresh skills list after updating a skill

    const fetchSkills = async () => {

      try {

        console.log('Refreshing skills after update...');

        const data = await getSkills();

        const skillsArray = Array.isArray(data) ? data : [];

        setSkills(skillsArray);

        setEditingSkill(null);

      } catch (err) {

        console.error('Error refreshing skills after update:', err);

      }

    };

    fetchSkills();

  };



  const handleDeleteSkill = async (skillId) => {

    // Check admin permission OR user ownership (for now, only admins can delete)

    if (!isAdmin) {

      toast.error('Only admins can delete skills');

      return;

    }



    // Show confirmation dialog

    const confirmed = window.confirm('Are you sure you want to delete this skill?');

    if (!confirmed) return;



    try {

      console.log('Deleting skill:', skillId);

      await deleteSkill(skillId);

      toast.success('Skill deleted successfully!');

      

      // Refresh skills list

      const data = await getSkills();

      const skillsArray = Array.isArray(data) ? data : [];

      setSkills(skillsArray);

    } catch (error) {

      toast.error('Failed to delete skill');

      console.error('Error deleting skill:', error);

    }

  };



  const handleEditSkill = (skill) => {

    // Check admin permission OR user ownership (for now, only admins can edit)

    if (!isAdmin) {

      toast.error('Only admins can edit skills');

      return;

    }

    

    setEditingSkill(skill);

    setShowForm(false);

  };



  const getLevelColor = (level) => {

    switch (level?.toLowerCase()) {

      case 'beginner':

        return 'badge-success';

      case 'intermediate':

        return 'badge-info';

      case 'advanced':

        return 'badge-warning';

      default:

        return 'badge-secondary';

    }

  };



  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <div className="loading loading-spinner loading-lg"></div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="alert alert-error max-w-md mx-auto mt-8">

        <span>{error}</span>

      </div>

    );

  }



  return (

    <>

      <NavBar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">

        <div className="container mx-auto px-4 py-8 pt-24">

          {/* Header Section */}

          <div className="text-center mb-12">

            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">

              Skills & Expertise

            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">

              Discover and manage professional skills. Build your expertise portfolio.

            </p>

          </div>



          {/* Add Skill Button */}

          <div className="flex justify-center mb-8">

            <button

              onClick={() => setShowForm(!showForm)}

              className="btn btn-gradient bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-700 hover:to-pink-700 shadow-lg"

            >

              {showForm ? (

                <>

                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />

                  </svg>

                  Cancel

                </>

              ) : (

                <>

                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />

                  </svg>

                  Add New Skill

                </>

              )}

            </button>

          </div>



          {/* Skill Form */}

          {showForm && (

            <div className="mb-12">

              <SkillForm onSuccess={handleSkillCreated} onCancel={() => setShowForm(false)} />

            </div>

          )}



          {/* Edit Skill Form */}

          {editingSkill && (

            <div className="mb-12">

              <EditSkillForm 

                skill={editingSkill} 

                onSuccess={handleSkillUpdated} 

                onCancel={() => setEditingSkill(null)} 

              />

            </div>

          )}



          {/* Skills Grid */}

          {Array.isArray(skills) && skills.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {skills.map((skill) => (

                <div key={skill.id || skill._id || Math.random()} className="group relative overflow-hidden">

                  <div className="card bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

                    <div className="card-body p-6">

                      {/* Skill Icon */}

                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">

                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />

                        </svg>

                      </div>



                      {/* Skill Name */}

                      <h2 className="card-title text-lg font-bold text-gray-800 mb-3">

                        {skill.name || 'Unknown Skill'}

                      </h2>



                      {/* Category and Level Badges */}

                      <div className="flex flex-wrap gap-2 mb-4">

                        <span className="badge badge-outline badge-primary text-xs">

                          {skill.category || 'Uncategorized'}

                        </span>

                        <span className={`badge ${getLevelColor(skill.level)} text-xs border-none`}>

                          {skill.level || 'Not specified'}

                        </span>

                      </div>



                      {/* Description */}

                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">

                        {skill.description || 'No description available'}

                      </p>



                      {/* Action Buttons */}

                      <div className="card-actions justify-end gap-2">

                        <button 

                          onClick={() => {

                            setSelectedSkill(skill);

                            setShowDetails(true);

                          }}

                          className="btn btn-primary btn-xs"

                        >

                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />

                          </svg>

                          View Details

                        </button>

                        {isAdmin && (

                          <>

                            <button 

                              onClick={() => handleEditSkill(skill)}

                              className="btn btn-ghost btn-xs text-purple-600 hover:bg-purple-50"

                            >

                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />

                              </svg>

                              Edit

                            </button>

                            <button 

                              onClick={() => handleDeleteSkill(skill.id || skill._id)}

                              className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"

                            >

                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />

                              </svg>

                              Delete

                            </button>

                          </>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-16">

              <div className="max-w-md mx-auto">

                <div className="mb-8">

                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />

                    </svg>

                  </div>

                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Skills Found</h3>

                  <p className="text-gray-500 mb-6">

                    Start building your skills portfolio by adding your first skill.

                  </p>

                  <button
                      onClick={() => setShowForm(true)}
                      className="btn btn-primary"
                    >
                      Create Your First Skill
                    </button>

                </div>

              </div>

            </div>

          )}



          {/* Stats Section */}

          {skills.length > 0 && (

            <div className="mt-16 text-center">

              <div className="stats stats-vertical lg:stats-horizontal shadow bg-white">

                <div className="stat">

                  <div className="stat-title">Total Skills</div>

                  <div className="stat-value text-purple-600">{skills.length}</div>

                </div>

                <div className="stat">

                  <div className="stat-title">Categories</div>

                  <div className="stat-value text-pink-600">

                    {[...new Set(skills.map(s => s.category))].length}

                  </div>

                </div>

                <div className="stat">

                  <div className="stat-title">Advanced Level</div>

                  <div className="stat-value text-green-600">

                    {skills.filter(s => s.level?.toLowerCase() === 'advanced').length}

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* Skill Details Modal */}
      {showDetails && selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedSkill.name || 'Skill Details'}</h2>
                  <p className="text-purple-100 mt-1">Skill information and details</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skill Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedSkill.description || 'No description available for this skill.'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skill Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-1.414.586H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">{selectedSkill.category || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium text-gray-800">{selectedSkill.level || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>

  );

};



export default Skills;

