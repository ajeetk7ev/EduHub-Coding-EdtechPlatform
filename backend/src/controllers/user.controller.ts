import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import uploadImageToCloudinary from "../utils/imageUpload";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { firstname, lastname, about, contactNo, gender, password, dob } =
      req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to update profile",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Match password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (firstname) updateData.firstname = firstname.trim();
    if (lastname) updateData.lastname = lastname.trim();
    if (about) updateData.about = about.trim();
    if (contactNo) updateData.contactNo = contactNo.trim();
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;

    // Handle image upload if provided
    if (req.files && (req.files as any).image) {
      const file = (req.files as any).image as any;
      const uploadResponse = await uploadImageToCloudinary(
        file,
        "user_images",
        800
      );
      updateData.image = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }

    // Build response user object
    const responseUser = {
      id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      about: updatedUser.about,
      contactNo: updatedUser.contactNo,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      image: updatedUser.image,
      role: updatedUser.role,
    };

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
