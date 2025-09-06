import { Request, Response } from "express";
import Section from "../models/Section";
import Course from "../models/Course";
import SubSection from "../models/SubSection";

//CREATE a section
export const createSection = async (req: Request, res: Response) => {
    try {
        const { title, courseId } = req.body;

        // Validate input
        if (!title || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties: title or courseId",
            });
        }

        // Create new section
        const newSection = await Section.create({ title });

        // Add new section to the course
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        );

        

        return res.status(200).json({
            success: true,
            message: `"Section ${title} created successfully"`,
            section:{id:newSection._id, title:newSection.title}
        });
    } catch (error: any) {
        console.error("Error creating section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// UPDATE a section
export const updateSection = async (req: Request, res: Response) => {
    try {
        const { id: sectionId } = req.params;
        const { title, courseId } = req.body;

        if (!title || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, sectionId, courseId",
            });
        }

        // Update section
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { title }, // ✅ changed from sectionName
            { new: true }
        );

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Get updated course with populated sections/subsections
        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections", // ✅ plural fixed
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: { section, course },
        });
    } catch (error: any) {
        console.error("Error updating section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// DELETE a section
export const deleteSection = async (req: Request, res: Response) => {
    try {
        const { id: sectionId } = req.params;
        const { courseId } = req.body;

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: sectionId, courseId",
            });
        }

        // Find section
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Remove section reference from course
        await Course.findByIdAndUpdate(courseId, {
            $pull: { courseContent: sectionId },
        });

        // Delete subsections belonging to the section
        await SubSection.deleteMany({ _id: { $in: section.subSections } }); // ✅ fixed plural

        // Delete the section
        await Section.findByIdAndDelete(sectionId);

        // Get updated course
        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSections" }, 
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
