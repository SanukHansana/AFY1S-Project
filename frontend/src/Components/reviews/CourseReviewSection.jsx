//frontend/src/Components/reviews/JobReviewSection.jsx
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/reviews";

export default function CourseReviewSection({ courseId, token = null }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    comment: "",
    rating: 5,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}?course=${courseId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          course: courseId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      setForm({ title: "", comment: "", rating: 5 });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setForm({
      title: review.title,
      comment: review.comment,
      rating: review.rating,
    });
    setEditingId(review._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };

  return (
    <div>
      <h3>Course Reviews</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="comment"
          placeholder="Write your review..."
          value={form.comment}
          onChange={handleChange}
          required
        />

        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Star</option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Update" : "Post"} Review
        </button>
      </form>

      <hr />

      {reviews.map((rev) => (
        <div key={rev._id}>
          <h4>{rev.title}</h4>
          <p>{rev.comment}</p>
          <p>⭐ {rev.rating}</p>
          <small>{rev.user?.name}</small>

          <br />
          <button onClick={() => handleEdit(rev)}>Edit</button>
          <button onClick={() => handleDelete(rev._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}