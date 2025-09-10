import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../model/usersModel.js";
import transporter from "../nodemailer.js";

// register user
export const register = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
  try {
    const existingUser = await UserModel.findOne({
      email,
    });
    if (existingUser) {
      return res.json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hasedPassword,
      mobile,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending Welcome Email to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our College91",
      text: `Hello ${name}, Welcome to our College91. We are glad to have you with us. Your account has been created successfully with email id:${email}.`,
    };

    await transporter.sendMail(mailOptions);

    await res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send verification otp
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your account verification OTP is ${otp}. Verify your account using this OTP.`,
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Verification OTP sent successfully on email",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// verify email using otp
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Please enter OTP" });
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.verifyotp === "" || user.verifyotp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyotpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired. Please request a new OTP",
      });
    }
    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// check if user is authenticated
export const isAuthenciated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send password reset otp
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Please enter email" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetotpExpireAt = Date.now() + 15 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Password Reset OTP",
      text: `Your account password reset OTP is ${otp}. Reset your password using this OTP.`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Password reset OTP sent successfully on email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// reset password using otp
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetotpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired. Please request a new OTP",
      });
    }
    const hasedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hasedPassword;
    user.resetotp = "";
    user.resetotpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
