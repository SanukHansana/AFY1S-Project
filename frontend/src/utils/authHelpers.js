//frontend/src/utils/authHelpers.js

export const getToken = () => localStorage.getItem("token");

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const checkAuth = () => {
  const token = getToken();
  return !!token;
};

export const checkAdmin = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin";
  } catch {
    return false;
  }
};

export const requireAuth = (navigate) => {
  if (!checkAuth()) {
    navigate('/login');
    return false;
  }
  return true;
};

export const requireAdmin = (navigate) => {
  if (!checkAdmin()) {
    navigate('/login');
    return false;
  }
  return true;
};
