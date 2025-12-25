import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import User, { IUser } from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { forgotPasswordTemplate } from "../templates/reset-password";


// ------------------- SIGNUP -------------------
export const signup = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        // ----------------- VALIDATION -----------------
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Password strength validation (min 6 chars, at least 1 number)
        const passwordRegex = /^(?=.*[0-9])(?=.{6,})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters and contain at least 1 number",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ success: false, message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: role || "student",
        });


        res.status(201).json({ success: true, message: "Signup successful" });
    } catch (err) {
        console.error("Error while signup", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ------------------- SIGNIN -------------------
export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '3d' });

        const loginUser = {
          _id:user._id,
          firstname:user.firstname,
          lastname:user.lastname,
          email:user.email,
          about:user.about,
          contactNo:user.contactNo,
          gender:user.gender,
          dob:user.dob,
          image:user.image,
          role:user.role
        }


        res.status(200).json({ success: true, message: "Signin successful", token, user: loginUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
};


// ------------------- FORGOT PASSWORD -------------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const name = `${user.firstname} ${user.lastname}`;
    const html = forgotPasswordTemplate(name, resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (err) {
    console.error(err);

    // Reset token fields if something goes wrong
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (innerErr) {
      console.error("Error clearing token after failed email:", innerErr);
    }

    res.status(500).json({
      success: false,
      message: "Email could not be sent",
      error: err,
    });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
};

// ------------------- CHANGE PASSWORD -------------------
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
};
