import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Course";

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalInstructors = await User.countDocuments({ role: "instructor" });

        const courses = await Course.find();
        const totalCourses = courses.length;

        let totalRevenue = 0;
        courses.forEach(course => {
            totalRevenue += (course.studentsEnrolled?.length || 0) * (course.price || 0);
        });

        // Simplified data for a chart (e.g., last 5 courses revenue)
        const recentRevenue = courses.slice(-5).map(course => ({
            name: course.courseName,
            revenue: (course.studentsEnrolled?.length || 0) * (course.price || 0)
        }));

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalCourses,
                totalRevenue
            },
            recentRevenue
        });
    } catch (error: any) {
        console.error("Error in getAdminStats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin stats",
        });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error: any) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query: any = {};
        if (search) {
            query.$or = [
                { courseName: { $regex: search, $options: "i" } },
                { courseDescription: { $regex: search, $options: "i" } }
            ];
        }

        const courses = await Course.find(query)
            .populate("instructor", "firstname lastname email")
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalCourses = await Course.countDocuments(query);

        return res.status(200).json({
            success: true,
            courses,
            pagination: {
                totalCourses,
                currentPage: Number(page),
                totalPages: Math.ceil(totalCourses / Number(limit))
            }
        });
    } catch (error: any) {
        console.error("Error in getAllCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
        });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { userId, role } = req.body;

        if (!["student", "instructor", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error: any) {
        console.error("Error in updateUserRole:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user role",
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error: any) {
        console.error("Error in deleteUser:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error: any) {
        console.error("Error in deleteCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
        });
    }
};
