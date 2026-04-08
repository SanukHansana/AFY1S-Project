//frontend/src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If NOT logged in → go to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If logged in → allow access
  return children;
}