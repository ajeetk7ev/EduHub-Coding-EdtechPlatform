import { Request, Response } from "express";
import Section from "../models/Section";
import SubSection from "../models/SubSection";
import uploadImageToCloudinary from "../utils/imageUpload";


// Create a new sub-section for a given section
export const createSubSection = async (req: Request, res: Response) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = (req.files as any)?.video; // safely access uploaded video

    // console.log("PRINTING DATA ", sectionId, title, description, video);

    // Validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME || "course-videos"
    );

    // Create sub-section
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the corresponding section with the new sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSections: subSectionDetails._id } }, // ✅ FIX: field name is subSections
      { new: true }
    ).populate("subSections");

    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      subSection: { id: subSectionDetails._id, title: subSectionDetails.title, videoUrl: subSectionDetails.videoUrl }
    });
  } catch (error: any) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//Update subSections
export const updateSubSection = async (req: Request, res: Response) => {
  try {
    const { id: subSectionId } = req.params;
    const { sectionId, title, description } = req.body;

    // Find subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      });
    }

    // Update fields if provided
    if (title) subSection.title = title;
    if (description) subSection.description = description;

    // Handle video upload if new file is provided
    const video = (req.files as any)?.video;
    if (video) {
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME || "course-videos"
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    // Save updates
    await subSection.save();

    // Populate updated section with all subsections
    const updatedSection = await Section.findById(sectionId).populate("subSections");

    return res.json({
      success: true,
      message: "Sub-section updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the sub-section",
      error: error.message,
    });
  }
};


//Delete subSection
export const deleteSubSection = async (req: Request, res: Response) => {
  try {
    const { id: subSectionId } = req.params;
    const { sectionId } = req.body;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectoinId is required",
      });
    }


    // Delete subsection itself
    const subSection = await SubSection.findByIdAndDelete(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Remove subsection reference from Section
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subSection: subSectionId,
        },
      },
      { new: true }
    );




    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.error("Error in delteSubSection", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};