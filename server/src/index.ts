import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import quizzes from "./routes/quizzes";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // ✅ Auth endpoints (register/login)
app.use("/api/quizzes", quizzes); // ✅ Quiz routes

// Health Check
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
