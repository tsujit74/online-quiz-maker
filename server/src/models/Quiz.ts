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
      validator: (v: string[]) => v.length === 4,
      message: "Each question must have exactly 4 options.",
    },
  },
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: { validator: (v: IQuestion[]) => v.length > 0, message: "At least one question is required." },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
