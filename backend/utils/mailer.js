const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASS, 
    },
    tls: {
      rejectUnauthorized: false,  
    },
  });
  
  
  

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Hamza Farid" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your OTP Code for Email Verification",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email", error);
  }
};

// Forgot Password Email
const sendForgotPasswordEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: `"Hamza Farid" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>We received a request to reset your password.</p>
        <p>Click the link below to set a new password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}" style="color: #1a73e8;">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset link sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email", error);
  }
};


module.exports = {sendOTPEmail , sendForgotPasswordEmail};
