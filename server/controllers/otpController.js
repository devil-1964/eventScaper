const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Otp = require("../models/otpModel");
const Email = require("../models/Email");
const e = require("express");
require("dotenv").config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const existingEmail = await Email.findOne({ email });
    if (!existingEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to database (overwrite if exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = await Otp.findOne({ email });

    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > storedOtp.expiresAt) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    await Email.findOneAndUpdate({ email }, { Verified: true });

    await Otp.deleteOne({ email });

    const emailDoc = await Email.findOne({ email });
    const redirectUrl =
      emailDoc.eventUrls.length > 0
        ? emailDoc.eventUrls[emailDoc.eventUrls.length - 1]
        : "/";

    res.status(200).json({
      message: "Email verified successfully",
      redirectUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

module.exports = { sendOTP, verifyOTP };
