import express from "express";
import { body } from "express-validator";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProfile);

router.put(
  "/",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

    body("location")
      .optional()
      .trim(),

    body("cropType")
      .optional()
      .trim(),
  ],
  updateProfile
);

export default router;