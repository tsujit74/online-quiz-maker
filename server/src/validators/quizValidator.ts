import Joi from "joi";

export const questionSchema = Joi.object({
  question: Joi.string().trim().min(5).max(200).required(),
  options: Joi.array().items(Joi.string().trim().min(1)).length(4).required(),
  correctIndex: Joi.number().integer().min(0).max(3).required(),
});

export const createQuizSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  questions: Joi.array().items(questionSchema).min(1).required(),
});

export const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(Joi.number().integer().min(0).max(3).allow(null))
    .required(),
});
