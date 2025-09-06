import { Request, Response, Router } from "express";
import Course from "../models/Course";
import User from "../models/User";
import { protect } from "../middlewares/protect.middleware";
import { isStudent } from "../middlewares/role.middleware";

const router = Router();



router.post("/buy", protect, isStudent, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const { courseId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in.",
            });
        }

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "CourseId is required to enroll in course",
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if already enrolled
        if (course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User already enrolled in the course",
            });
        }

        // Update both User and Course simultaneously
        await Promise.all([
            Course.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: userId } }),
            User.findByIdAndUpdate(userId, { $addToSet: { coursesEnrolled: courseId } }),
        ]);

        return res.status(200).json({
            success: true,
            message: "User enrolled in course successfully",
        });
    } catch (error) {
        console.error("Error in buying course:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default router;
