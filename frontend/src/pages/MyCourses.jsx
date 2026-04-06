import React, { useState, useEffect } from 'react';
import { getMyCourses, updateProgress } from '../services/enrollmentService.jsx';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import toast from 'react-hot-toast';

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(null);

  const handleProgressUpdate = async (enrollmentId, newProgress) => {
    try {
      setUpdatingProgress(enrollmentId);
      console.log(`Updating progress for enrollment ${enrollmentId} to ${newProgress}%`);
      
      await updateProgress(enrollmentId, newProgress);
      
      // Update local state
      setEnrolledCourses(prev => 
        prev.map(enrollment => 
          (enrollment.id || enrollment._id) === enrollmentId 
            ? { ...enrollment, progress: newProgress }
            : enrollment
        )
      );
      
      toast.success(`Progress updated to ${newProgress}%`);
      
      // Auto-update status if progress is 100%
      if (newProgress === 100) {
        setEnrolledCourses(prev => 
          prev.map(enrollment => 
            (enrollment.id || enrollment._id) === enrollmentId 
              ? { ...enrollment, status: 'completed' }
              : enrollment
          )
        );
        toast.success('🎉 Course completed!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setUpdatingProgress(null);
    }
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        console.log('Fetching enrolled courses...');
        const data = await getMyCourses();
        console.log('Raw API response:', data);
        console.log('Data type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        
        let coursesArray = [];
        
        if (Array.isArray(data)) {
          coursesArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          coursesArray = data.data;
        } else if (data && Array.isArray(data.courses)) {
          coursesArray = data.courses;
        } else if (data && data.enrollments && Array.isArray(data.enrollments)) {
          coursesArray = data.enrollments;
        } else if (data && data.data && data.data.enrollments && Array.isArray(data.data.enrollments)) {
          coursesArray = data.data.enrollments;
        } else {
          console.warn('Unexpected data format:', data);
          console.warn('Available keys:', Object.keys(data));
          coursesArray = [];
        }
        
        console.log('Final courses array:', coursesArray);
        console.log('Courses array length:', coursesArray.length);
        
        setEnrolledCourses(coursesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to fetch enrolled courses');
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
                <p className="text-gray-600">Track your learning progress and manage your enrolled courses</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-outline btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5M4 4h16M4 4v5M4 4h16" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enrolled Courses</h3>
              <p className="text-gray-500 mb-6">You haven't enrolled in any courses yet.</p>
              <button 
                onClick={() => navigate('/courses')}
                className="btn btn-primary"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((enrollment, index) => (
                <div key={enrollment.id || enrollment._id || index} className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="card-body p-6">
                    {/* Course Title */}
                    <h3 className="card-title text-xl font-bold text-gray-800 mb-4">
                      {enrollment.course?.title || enrollment.title || 'Untitled Course'}
                    </h3>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">
                          {enrollment.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress || 0)}`}
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      
                      {/* Progress Slider */}
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600 font-medium">Update Progress:</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={enrollment.progress || 0}
                            onChange={(e) => {
                              const newProgress = parseInt(e.target.value);
                              const enrollmentId = enrollment.id || enrollment._id;
                              
                              // Update UI immediately for better UX
                              setEnrolledCourses(prev => 
                                prev.map(enr => 
                                  (enr.id || enr._id) === enrollmentId 
                                    ? { ...enr, progress: newProgress }
                                    : enr
                                )
                              );
                              
                              // Call API to update
                              handleProgressUpdate(enrollmentId, newProgress);
                            }}
                            disabled={updatingProgress === (enrollment.id || enrollment._id)}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, ${getProgressColor(enrollment.progress || 0)} 0%, ${getProgressColor(enrollment.progress || 0)} ${enrollment.progress || 0}%, #e5e7eb ${enrollment.progress || 0}%, #e5e7eb 100%)`
                            }}
                          />
                          <span className="text-sm font-bold text-gray-900 min-w-[3rem] text-right">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                        {updatingProgress === (enrollment.id || enrollment._id) && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <div className="loading loading-spinner loading-xs"></div>
                            Updating...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status ? enrollment.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                      </span>
                    </div>

                    {/* Additional Info */}
                    {enrollment.course && (
                      <div className="text-sm text-gray-600 mb-4">
                        {enrollment.course.duration && (
                          <p>Duration: {enrollment.course.duration} hours</p>
                        )}
                        {enrollment.enrolledAt && (
                          <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="card-actions justify-end">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const courseId = enrollment.course?.id || enrollment.courseId || enrollment.id;
                          if (courseId) {
                            navigate(`/courses/${courseId}`);
                          } else {
                            toast.error('Course ID not found');
                          }
                        }}
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default MyCourses;
