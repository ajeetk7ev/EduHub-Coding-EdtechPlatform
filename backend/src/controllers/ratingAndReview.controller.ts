import { Request, Response } from "express";
import Course from "../models/Course";
import RatingAndReview from "../models/RatingAndReview";


export const createRating = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found",
            });
        }

        const { rating, review, courseId } = req.body;
        console.log("RATING",rating);
        console.log("REVIEW",review);
        console.log("COURSE ID", courseId);

        // ✅ Validate input
        if (!rating || !review || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields (rating, review, courseId) are required",
            });
        }

        // ✅ Check if user is enrolled in the course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course",
            });
        }

        // ✅ Check if already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course already reviewed by this user",
            });
        }

        // ✅ Create rating & review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // ✅ Push into course ratingAndReviews
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { ratingAndReviews: ratingReview._id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
        });
    } catch (error: any) {
        console.error("Error creating rating:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const getAverageRating = async (req: Request, res: Response) => {
    try {
        // ✅ Extract courseId safely
        const { id:courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }


        // ✅ Run aggregation to calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: courseId,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        // ✅ Return average rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // ✅ If no rating/review exists
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, no ratings given till now",
            averageRating: 0,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
