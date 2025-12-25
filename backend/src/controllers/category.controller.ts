import { Request, Response } from "express";
import Category from "../models/Category";
import redis from "../config/redis";

// ================= CREATE CATEGORY =================
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await Category.create({
      name,
      description,
    });

    // 🔥 Invalidate cache after write
    await redis.del("categories:all");

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    console.log("Error in createCategory", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= SHOW ALL CATEGORIES =================
export const showAllCategories = async (req: Request, res: Response) => {
  try {
    const cacheKey = "categories:all";

    // 1️⃣ Check Redis first
    const cachedCategories = await redis.get(cacheKey);

    if (cachedCategories) {
      return res.status(200).json({
        success: true,
        source: "cache",
        categories: JSON.parse(cachedCategories),
      });
    }

    // 2️⃣ Fetch from DB
    const categories = await Category.find({});

    // 3️⃣ Save to Redis (TTL = 1 hour)
    await redis.set(
      cacheKey,
      JSON.stringify(categories),
      "EX",
      60 * 60
    );

    res.status(200).json({
      success: true,
      source: "db",
      categories,
    });
  } catch (error) {
    console.log("Error in showAllCategories", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
