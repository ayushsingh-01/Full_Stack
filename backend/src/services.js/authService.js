import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OTP from "../models/otp.js";
import { generateOTP } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../sendEmail.js";
import jwt from "jsonwebtoken";
export const initiateSignupService = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  await OTP.deleteMany({ email });

  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }

  return {
    expiresIn: "5 minutes"
  };
};

export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role,
}) => {
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    throw new Error("OTP expired or not found");
  }

  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOtp) {
    throw new Error("Invalid OTP");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  await OTP.deleteOne({ email });

  // Generate token for the new user
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};



export const loginService = async (email, password) => {
  const user = await User
    .findOne({ email })
    .select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
