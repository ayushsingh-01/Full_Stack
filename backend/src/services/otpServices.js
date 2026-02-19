import nodemailer from "nodemailer";

// Lazy-load transporter only when needed
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transporter error:", error.message);
      } else {
        console.log("✅ Email service ready");
      }
    });
  }
  return transporter;
};

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via email
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
