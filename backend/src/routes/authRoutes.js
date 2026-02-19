import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /api/auth/signup/initiate
 * Initiate signup by sending OTP to email
 */
router.post("/signup/initiate", initiateSignup);

/**
 * POST /api/auth/signup/verify
 * Verify OTP and complete signup
 */
router.post("/signup/verify", verifySignupOtp);

export default router;
