import { Request, Response } from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz";
import { createQuizSchema, submitQuizSchema } from "../validators/quizValidator";
import { options } from "joi";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { error } = createQuizSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ success: false, errors: error.details.map(d => d.message) });
    }

    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions });
    await quiz.save();

    return res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return res.status(500).json({ success: false, message: "Server error while creating quiz." });
  }
};

export const listQuizzes = async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().select("_id title createdAt").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: quizzes });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching quizzes." });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID." });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    return res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching quiz." });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID." });
    }

    const { error } = submitQuizSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ success: false, errors: error.details.map(d => d.message) });
    }

    const { answers } = req.body as { answers: number[] };
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score++;
    });

    const result = {
      total: quiz.questions.length,
      score,
      details: quiz.questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        yourAnswer: answers[idx] ?? null,
      })),
    };

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    return res.status(500).json({ success: false, message: "Server error while submitting quiz." });
  }
};
