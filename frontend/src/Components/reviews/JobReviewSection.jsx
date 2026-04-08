//frontend/src/Components/reviews/JobReviewSection.jsx
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/reviews";

export default function JobReviewSection({ jobId, token }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    comment: "",
    rating: 5,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?job=${jobId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchReviews();
    }
  }, [jobId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "rating" ? Number(e.target.value) : e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      comment: "",
      rating: 5,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in to post a review.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          job: jobId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to submit review");
        return;
      }

      resetForm();
      setMessage(editingId ? "Review updated successfully" : "Review posted successfully");
      fetchReviews();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setForm({
      title: review.title || "",
      comment: review.comment || "",
      rating: review.rating || 5,
    });
    setEditingId(review._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!token) {
      setMessage("You must be logged in to delete a review.");
      return;
    }

    if (!window.confirm("Delete this review?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.message || "Failed to delete review");
        return;
      }

      setMessage("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-2xl font-bold text-gray-800">Job Reviews</h3>

      {message && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Review Title
          </label>
          <input
            name="title"
            placeholder="Enter review title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Comment
          </label>
          <textarea
            name="comment"
            placeholder="Write your review..."
            value={form.comment}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Rating
          </label>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting
              ? editingId
                ? "Updating..."
                : "Posting..."
              : editingId
              ? "Update Review"
              : "Post Review"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <hr className="my-6" />

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-gray-500">
          No reviews yet
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h4 className="text-lg font-bold text-gray-800">{rev.title}</h4>
                <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  ⭐ {rev.rating}
                </span>
              </div>

              <p className="mb-3 text-gray-700">{rev.comment}</p>

              <p className="mb-3 text-sm text-gray-500">
                By: {rev.user?.name || "Unknown user"}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleEdit(rev)}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(rev._id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}