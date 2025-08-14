import express from "express";
import { createQuiz, listQuizzes, getQuiz, submitQuiz } from "../controllers/quizController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/", listQuizzes);
router.post("/", authMiddleware, adminMiddleware, createQuiz);
router.get("/:id", authMiddleware, getQuiz);
router.post("/:id/submit", authMiddleware, submitQuiz);
export default router;
