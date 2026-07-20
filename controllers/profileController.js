import { validationResult } from "express-validator";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        cropType: user.cropType,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { name, location, cropType } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (location !== undefined) updateFields.location = location;
    if (cropType !== undefined) updateFields.cropType = cropType;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        location: updatedUser.location,
        cropType: updatedUser.cropType,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};