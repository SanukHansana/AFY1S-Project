// frontend/src/pages/review/AdminReviewDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar.jsx";
import Footer from "../../Components/Footer.jsx";
import API_BASE_URL from "../../config/api";  // Use config for API URL

const API_URL = `${API_BASE_URL}/api/reviews`;

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  // check admin from JWT
  const checkAdmin = () => {
    const token = getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin";
    } catch {
      return false;
    }
  };

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      setReviews(data.reviews || data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const admin = checkAdmin();
    setIsAdmin(admin);

    if (!admin) {
      navigate("/");
      return;
    }

    fetchReviews();
  }, []);

  // hide page if not admin
  if (!isAdmin) return null;

  return (
  <>
    

    <div className="min-h-screen bg-[#f8f5ff] py-10">
      
      <div className="max-w-6xl mx-auto px-6">

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Admin Review Management
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl border border-purple-100 shadow-sm p-5 hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {review.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3">
                  {review.comment}
                </p>

                <p className="text-sm font-medium text-yellow-500 mb-2">
                  ⭐ {review.rating}
                </p>

                <p className="text-xs text-gray-400 mb-2">
                  User: {review.user?.name || review.user}
                </p>

                {review.course && (
                  <p className="text-sm text-purple-700 mb-1">
                    🎓 Course: {review.course?.title}
                  </p>
                )}

                {review.job && (
                  <p className="text-sm text-purple-700 mb-3">
                    💼 Job: {review.job?.title}
                  </p>
                )}

                <button
                  onClick={() => handleDelete(review._id)}
                  className="mt-3 w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition"
                >
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>

    
  </>
);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  }
}