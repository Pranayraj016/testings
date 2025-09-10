import express from "express";
import { signup, login } from "../controller/user_controller.js";
import { verifyOTP, sendOTP } from "../controller/user_controller.js";

const router = express.Router();

// ✅ User Authentication Routes
// router.post("/signup", signup);
// router.post("/login", login);

// ✅ OTP Verification Route
// router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOTP);

export default router;
