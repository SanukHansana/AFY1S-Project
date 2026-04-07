import React, { useState, useEffect } from 'react';
import { getCourses, updateCourse, deleteCourse } from '../services/courseService.jsx';
import { enrollInCourse } from '../services/enrollmentService.jsx';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar.jsx';
import Footer from '../Components/Footer.jsx';
import CourseEditForm from '../Components/CourseEditForm.jsx';
import toast from 'react-hot-toast';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  const handleEnroll = async (course) => {
    console.log('handleEnroll called with course:', course);

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      toast.error('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    console.log('Token found, proceeding with enrollment');

    try {
      const courseId = course?._id || course?.id;
      console.log('Course ID extracted:', courseId);

      setEnrollingCourse(courseId);
      console.log('Enrolling state set for course:', courseId);

      const result = await enrollInCourse(courseId);
      console.log('Enrollment API result:', result);

      toast.success('Successfully enrolled in course!');

      setTimeout(() => {
        console.log('Redirecting to MyCourses page');
        navigate('/my-courses');
      }, 500);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to enroll in course';
      console.error('Error message:', errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('Clearing enrolling state');
      setEnrollingCourse(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...');
        const data = await getCourses();
        console.log('Courses data received:', data);

        let coursesArray = [];

        if (Array.isArray(data)) {
          coursesArray = data;
        } else if (data?.courses && Array.isArray(data.courses)) {
          coursesArray = data.courses;
        } else if (data?.data?.courses && Array.isArray(data.data.courses)) {
          coursesArray = data.data.courses;
        } else {
          console.warn('Unexpected data format:', data);
          coursesArray = [];
        }

        console.log('Final courses array:', coursesArray);
        setCourses(coursesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowEditForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title || 'this course'}"?`)) {
      try {
        const courseId = course.id || course._id;
        console.log('Deleting course with ID:', courseId);
        await deleteCourse(courseId);
        toast.success('Course deleted successfully!');
        setCourses(prev => prev.filter(c => (c.id || c._id) !== courseId));
        setShowDetails(false);
      } catch (error) {
        console.error('Error deleting course:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete course';
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const courseId = editingCourse.id || editingCourse._id;
      console.log('Updating course with ID:', courseId, 'Data:', updatedData);
      await updateCourse(courseId, updatedData);
      toast.success('Course updated successfully!');
      setCourses(prev =>
        prev.map(c =>
          (c.id || c._id) === courseId
            ? { ...c, ...updatedData }
            : c
        )
      );
      setShowEditForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);

      let errorMessage = 'Failed to update course';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (error.response.data.data && Array.isArray(error.response.data.data)) {
          const validationErrors = error.response.data.data;
          console.log('Validation errors:', validationErrors);

          if (validationErrors.length > 0) {
            if (typeof validationErrors[0] === 'string') {
              errorMessage = validationErrors[0];
            } else if (validationErrors[0].message) {
              errorMessage = validationErrors[0].message;
            } else if (validationErrors[0].field && validationErrors[0].error) {
              errorMessage = `${validationErrors[0].field}: ${validationErrors[0].error}`;
            }
          }
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data);
      }

      toast.error(errorMessage);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <svg className="w-6 h-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h.013a2 2 0 012.925-2.075 2.075C2.06 16.082 2.06 16.082a2 2 0 012.925-2.075 2.075C2.06 19.918 2.06 19.918a2 2 0 012.925-2.075 2.075C2.06 24 2.06 24a2 2 0 012.925-2.075 2.075z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Courses & Learning
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Discover and enroll in professional courses. Enhance your skills portfolio.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/my-courses')}
                className="btn btn-outline btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5.12h3.628l-1.083-1.083A2.125 2.125 0 018.75 8.75H4.125A2.125 2.125 0 012 6.75v8.75a2.125 2.125 0 012.925-2.075 2.075C2.06 19.918 2.06 19.918a2 2 0 012.925-2.075 2.075C2.06 24 2.06 24a2 2 0 012.925-2.075 2.075z" />
                </svg>
                My Courses
              </button>
              <button
                onClick={() => navigate('/courses/new')}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Course
              </button>
            </div>
          </div>

          {!Array.isArray(courses) || courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Found</h3>
                  <p className="text-gray-500 mb-6">
                    Start by creating your first course or check back later for new content.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id || course._id || Math.random()} className="group relative overflow-hidden">
                  <div className="card bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="card-body p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title || 'Untitled Course'}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 text-sm">{course.duration || 'Duration not specified'}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 text-sm">
                          {course.skillName ||
                            course.skill?.name ||
                            course.skillId?.name ||
                            course.skill_name ||
                            course.skill ||
                            'Skill not specified'}
                        </span>
                      </div>

                      {course.level && (
                        <div className="badge badge-info badge-sm mb-4">{course.level}</div>
                      )}

                      <div className="card-actions justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              console.log('Full course object:', course);
                              setSelectedCourse(course);
                              setShowDetails(true);
                            }}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              console.log('Enroll button clicked!');
                              handleEnroll(course);
                            }}
                            disabled={enrollingCourse === (course.id || course._id)}
                          >
                            {enrollingCourse === (course.id || course._id) ? (
                              <>
                                <div className="loading loading-spinner loading-xs mr-2"></div>
                                Enrolling...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Enroll Now
                              </>
                            )}
                          </button>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(course)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        </div>
                        <button 
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(course)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetails && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCourse.title || 'Course Details'}</h2>
                  <p className="text-blue-100 mt-1">Course information and enrollment</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCourse.description || 'No description available for this course.'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Skill</h3>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedCourse.skillName ||
                        selectedCourse.skill?.name ||
                        selectedCourse.skillId?.name ||
                        selectedCourse.skill_name ||
                        selectedCourse.skill ||
                        'Skill not specified'}
                    </p>
                    <p className="text-sm text-gray-500">Primary skill for this course</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-800">{selectedCourse.duration || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium text-gray-800">{selectedCourse.level || 'All levels'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    console.log('Enroll button clicked (modal)!');
                    handleEnroll(selectedCourse);
                  }}
                  disabled={enrollingCourse === (selectedCourse?.id || selectedCourse?._id)}
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold transition-all ${
                    enrollingCourse === (selectedCourse?.id || selectedCourse?._id)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  {enrollingCourse === (selectedCourse?.id || selectedCourse?._id) ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="loading loading-spinner loading-sm"></div>
                      Enrolling...
                    </div>
                  ) : (
                    'Enroll Now'
                  )}
                </button>

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

      {showEditForm && editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Course</h2>
                  <p className="text-blue-100 mt-1">Update course information</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCourse(null);
                  }}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <CourseEditForm
                course={editingCourse}
                onUpdate={handleUpdate}
                onCancel={() => {
                  setShowEditForm(false);
                  setEditingCourse(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Courses;