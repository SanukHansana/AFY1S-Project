// backend/src/routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import protect from "../middleware/authmiddleware.js";
import authorize from "../middleware/rolemiddleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ================= REGISTER =================
router.post(
  "/register",
  [
    // Name: required, at least 3 chars, letters only
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
      .matches(/^[A-Za-z ]+$/).withMessage("Name must contain only letters"),

    // Email: required, valid email
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Valid email is required"),

    // Password: required, strong
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character"),
  ],
  validate,
  registerUser
);

// ================= LOGIN =================
router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Valid email is required"),
    body("password")
      .notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser
);

// ================= USER CRUD =================
router.get("/", protect, authorize("admin"), getUsers);

router.get("/:id", protect, getUser);

// Update user with optional validations
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
      .matches(/^[A-Za-z ]+$/).withMessage("Name must contain only letters"),

    body("email")
      .optional()
      .trim()
      .isEmail().withMessage("Valid email is required"),

    body("password")
      .optional()
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character"),
  ],
  validate,
  updateUser
);

router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;