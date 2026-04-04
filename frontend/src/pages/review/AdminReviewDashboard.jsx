
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/reviews";

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setReviews(data.reviews || data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDA4NWY1MjkzNTkwMDNlYzQwMTA5MyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzc1MjczNDg5LCJleHAiOjE3NzU4NzgyODl9.vYrXxZqVyvb07zjRMqIuCg5JafNMfTOBN9KD6VYfmys",
        },
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Admin Review Management
      </h1>
    
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {reviews.map((review) => (
            <div key={review._id}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {review.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {review.comment}
                </p>
                <p style={{ fontSize: "14px" }}>⭐ {review.rating}</p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  User: {review.user?.name || review.user}
                </p>

                {/* ✅ Show Course OR Job */}
                {review.course && (
                  <p style={{ fontSize: "13px", color: "#2c3e50" }}>
                    🎓 Course: {review.course?.title}
                  </p>
                )}

                {review.job && (
                  <p style={{ fontSize: "13px", color: "#2c3e50" }}>
                    💼 Job: {review.job?.title}
                  </p>
                )}

                <button
                  onClick={() => handleDelete(review._id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
