import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";  //  Use config for API URL

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Check if already logged in (validate token)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          navigate("/");
        } else {
          // ❌ invalid/expired token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔍 Validation
    if (!form.email || !form.password) {
      setMessage("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      setMessage("Invalid email format");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful");

        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin"); // admin dashboard route
          } else {
            navigate("/"); // normal user route
          }
        }, 800);
      
      } else {
        // ❌ Better error handling
        if (res.status === 401) {
          setMessage("Incorrect email or password");
        } else {
          setMessage(data.message || "Login failed");
        }
      }
    } catch (err) {
      setMessage("⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="w-full p-3 border rounded-lg"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-lg ${
              loading ? "bg-gray-400" : "bg-green-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm font-medium">{message}</p>
        )}

        <div className="text-center mt-6 text-sm space-y-2">
          <Link to="/register" className="block text-blue-600">
            Register
          </Link>

          <Link to="/forgot-password" className="block text-gray-500">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}