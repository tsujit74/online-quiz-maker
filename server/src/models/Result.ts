import mongoose, { Schema, Document } from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  quizTitle: string;
  score: number;
  total: number;
  answers: number[];
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>("Result", ResultSchema);
