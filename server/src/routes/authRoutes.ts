import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { getUserDashboard } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", authMiddleware, getUserDashboard);
export default router;
