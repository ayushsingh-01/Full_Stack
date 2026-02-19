import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { generateOTP, sendOTPEmail } from "./otpServices.js";

/**
 * Initiate signup - Generate and send OTP
 */
export const initiateSignupService = async (email) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      throw new Error("User already exists");
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP via email
    await sendOTPEmail(email, otp);

    // Save or update user with OTP
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        otp,
        otpExpiry,
        isVerified: false,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    return {
      message: "OTP sent to your email",
      email,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Verify signup OTP and register user
 */
export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role = "user",
}) => {
  try {
    // Validate required fields
    if (!name || !password) {
      throw new Error("Name and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found. Please initiate signup first.");
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiry) {
      throw new Error("OTP has expired");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.name = name;
    user.password = hashedPassword;
    user.role = role;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Login service
 */
export const loginService = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error("Please verify your email first");
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
