import { Request, Response } from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz";
import Result from "../models/Result";
import User from "../models/User";
import {
  createQuizSchema,
  submitQuizSchema,
} from "../validators/quizValidator";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { error } = createQuizSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, errors: error.details.map((d) => d.message) });

    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ success: true, data: quiz });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Server error while creating quiz." });
  }
};

export const listQuizzes = async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find()
      .select("_id title createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quizzes });
  } catch {
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching quizzes.",
      });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid quiz ID." });

    const quiz = await Quiz.findById(id);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found." });

    res.status(200).json({ success: true, data: quiz });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching quiz." });
  }
};

export const submitQuiz = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid quiz ID" });

    // Validate answers
    const { error } = submitQuizSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, errors: error.details.map((d) => d.message) });

    const { answers } = req.body as { answers: number[] };
    const quiz = await Quiz.findById(id);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score++;
    });

    // Save result
    const result = new Result({
      userId: req.user._id,
      quizId: quiz._id,
      quizTitle: quiz.title, // MUST include
      score,
      total: quiz.questions.length,
      answers,
    });
    await result.save();

    // Update user's test history
    req.user.tests.push({
      quizId: quiz.id.toString(),
      quizTitle: quiz.title, // MUST include
      score,
      totalQuestions: quiz.questions.length,
      date: new Date(),
    });
    await req.user.save();

    const details = quiz.questions.map((q, idx) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      yourAnswer: answers[idx] ?? null,
    }));

    res
      .status(200)
      .json({ success: true,title:quiz.title, total: quiz.questions.length, score, details });
  } catch (err: any) {
    console.error("Error submitting quiz:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while submitting quiz." });
  }
};
