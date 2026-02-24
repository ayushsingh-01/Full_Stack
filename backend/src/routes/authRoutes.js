import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login,
  getCurrentUser,
  logout
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/signup/initiate", initiateSignup);

router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", logout);

export default router;
