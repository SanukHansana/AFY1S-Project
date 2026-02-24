// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be attached by JWT middleware)
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    // User is authorized, proceed to next middleware
    next();
  };
};

export default authorizeRoles;
