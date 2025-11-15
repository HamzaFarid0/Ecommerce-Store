import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

import UserModel from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/token.utils.js';
import { sendOTPEmail, sendForgotPasswordEmail } from '../utils/mailer.js';
import  isValidEmail  from '../utils/validator.js';
import redisConnect from '../redis-connect/redis.connect.js';

dotenv.config();

const signup = async (req, res) => {
  try {
    console.log("Received Data:", req.body);  

    const { username, email, password } = req.body;
    const errors = {};

    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Email is invalid";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        errors: { email: "User with this email already exists" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, email, password: hashedPassword, isVerified: false });

    const otp = crypto.randomInt(100000, 999999).toString();
    await redisConnect.set(`otp:${email}`, otp, 'EX', 600);
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Internal server error while signing up");
    res.status(500).json({ message: "Internal server error while signing up" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: "Both otp and email is required" });
    }

    const storedOTP = await redisConnect.get(`otp:${email}`);
    if (!storedOTP) {
      return res.status(400).json({ message: "OTP expired, request for new OTP" });
    }
    if (storedOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisConnect.del(`otp:${email}`);

    const verifiedUser = await UserModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!verifiedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Email verified successfully + User saved to DB:", verifiedUser);
    res.json({ message: "Email verified successfully + User saved to DB:", verifiedUser });
  } catch (error) {
    console.error("Internal Server Error verifying OTP", error);
    res.status(500).json({ message: "Internal Server Error verifying OTP" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString();
  await redisConnect.set(`otp:${email}`, otp, 'EX', 600);
  await sendOTPEmail(email, otp);
  res.status(200).json({ message: "OTP resent successfully" });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Email format is invalid";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ errors: { email: "No account found with this email" } });
    if (!user.isVerified) return res.status(403).json({ errors: { email: "Please verify your email before logging in" } });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ errors: { password: "Incorrect password. Please try again." } });

    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.expiresAt > new Date());

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during log in:", error);
    res.status(500).json({ message: "Error during log in", error });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const user = await UserModel.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    user.refreshTokens = user.refreshTokens.filter(rtoken => rtoken.token !== refreshToken);
    await user.save();

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const errors = {};

  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Email format is invalid";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ errors: { email: "No account found with this email" } });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await redisConnect.set(`reset:${token}`, user._id.toString(), "EX", 900);

    const resetLink = `http://localhost:4200/reset-password/${token}`;
    await sendForgotPasswordEmail(user.email, resetLink);

    return res.status(200).json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const errors = {};

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters long';
  if (!token) errors.token = 'Reset token is missing or expired';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const userId = await redisConnect.get(`reset:${token}`);
    if (!userId) {
      return res.status(400).json({ errors: { token: 'Reset link is invalid or expired' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
    await redisConnect.del(`reset:${token}`);

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ errors: { general: 'Something went wrong' } });
  }
};

export {
  signup,
  verifyOTP,
  resendOtp,
  login,
  logout,
  forgotPassword,
  resetPassword
};
