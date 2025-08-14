import Joi from "joi";

// Single Question Schema
export const questionSchema = Joi.object({
  question: Joi.string().trim().min(5).max(200).required(),
  options: Joi.array().items(Joi.string().trim().min(1)).length(4).required(),
  correctIndex: Joi.number().integer().min(0).max(3).required(),
});

// Create Quiz Schema
export const createQuizSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  questions: Joi.array().items(questionSchema).min(1).required(),
});

// Submit Quiz Schema
export const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.number().integer().min(0).max(3).allow(null) // number 0-3 or null
    )
    .required()
    .min(1), // at least 1 answer must be submitted
});
