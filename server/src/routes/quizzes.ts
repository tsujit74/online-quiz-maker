import express from "express";
import { createQuiz, listQuizzes, getQuiz, submitQuiz } from "../controllers/quizController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Public route: List all quizzes
router.get("/", listQuizzes);

// Protected: Only logged-in users can create and take quizzes
router.post("/", authMiddleware, createQuiz);
router.get("/:id", authMiddleware, getQuiz);
router.post("/:id/submit", authMiddleware, submitQuiz);

export default router;
