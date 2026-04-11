//frontend/src/Components/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";  //  Use config for API URL

export default function Register() {
  const navigate = useNavigate(); // ✅ INIT NAVIGATE

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Registered successfully");
        setErrors({});

        alert("Registration successful! 🎉"); // ✅ SUCCESS ALERT

        // ✅ REDIRECT AFTER 1.5s
        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        if (data.errors) {
          const fieldErrors = {};
          data.errors.forEach((err) => {
            fieldErrors[err.param] = err.msg;
          });
          setErrors(fieldErrors);

          alert("Please fix the highlighted errors ❌"); // ✅ VALIDATION ALERT

        } else {
          setMessage(data.message || "❌ Error");
          alert(data.message || "Registration failed ❌"); // ✅ GENERAL ERROR
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
      alert("Server error. Try again later 🚨"); // ✅ SERVER ERROR
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="freelancer">Freelancer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}

        <div className="text-center mt-6 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}