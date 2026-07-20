import express from "express";
import { body } from "express-validator";

import {
  askQuestion,
  getChatHistory,
  clearChatHistory,
} from "../controllers/chatController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question is required")
  ],
  askQuestion
);

router.get("/history", protect, getChatHistory);

router.delete("/history", protect, clearChatHistory);

export default router;