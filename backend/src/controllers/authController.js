import {
  initiateSignupService,
  verifySignupOtpService,
  loginService
} from "../services.js/authService.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const initiateSignup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await initiateSignupService(email);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp, name, password, role } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const result = await verifySignupOtpService({
      email,
      otp,
      name,
      password,
      role
    });

    // Set token cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 
    });

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      user: result.user,
      token: result.token  // Send token in response for localStorage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      token: result.token  // Send token in response for localStorage
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Fetch full user data from database
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate a fresh token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



