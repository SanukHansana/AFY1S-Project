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
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  registerUser
);

router.post("/login", loginUser);

router.get("/", protect, authorize("admin"), getUsers);

router.get("/:id", protect, getUser);

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
