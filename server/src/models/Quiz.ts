import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length === 4, // Must have exactly 4 options
      message: "Each question must have exactly 4 options.",
    },
  },
  correctIndex: {
    type: Number,
    required: true,
    min: [0, "Correct index must be between 0 and 3"],
    max: [3, "Correct index must be between 0 and 3"],
  },
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: (v: IQuestion[]) => v.length > 0,
      message: "A quiz must have at least one question.",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
