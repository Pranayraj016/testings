import User from "../model/user_model.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Signup Controller
export const signup = async (req, res) => {
  try {
    const { fullname, email, mobile, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Generate OTP (Hash it for security)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (!existingUser) {
      // Save New User (Unverified)
      const newUser = new User({
        fullname,
        email,
        mobile,
        password: hashPassword,
        otp,
        otpExpires,
        isVerified: false,
      });

      await newUser.save();
    } else {
      // Update OTP for Existing Unverified User
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.password = hashPassword;
      await existingUser.save();
    }

    // Send OTP via Email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    res.status(201).json({
      message: "OTP sent. Please verify your email before logging in.",
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP and expiry time
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save OTP in the user model
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      console.log("OTP saved in DB:", otp, "| Expires at:", otpExpires);

      // Send OTP via email
      await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - OTP Code",
        text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      });

      return res.status(400).json({
        message:
          "Your account is not verified. An OTP has been sent to your email.",
      });
    }

    // Check Password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Generate and Send OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found. Please register first." });
    }

    // Generate new OTP and expiry time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP in the user model
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log("OTP saved in DB:", otp, "| Expires at:", otpExpires);

    // Send OTP via email
    await transporter.sendMail({
      from: `"College91" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check OTP Expiry
    if (new Date(user.otpExpires) < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Validate OTP
    if (String(user.otp) !== String(otp)) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // ✅ Mark User as Verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
