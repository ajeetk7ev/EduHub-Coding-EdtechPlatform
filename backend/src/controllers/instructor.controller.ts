import { Request, Response } from "express";
import Course from "../models/Course";


export const getInstructorData = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user._id;

        // Fetch all courses created by the instructor
        const courseData = await Course.find({ instructor: instructorId });

        const instructorStats = courseData.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };

            return courseDataWithStats;
        });

        return res.status(200).json({
            success: true,
            courses: instructorStats,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
