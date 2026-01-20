import { Request, Response } from "express";
import User from "../models/User";
import Category from "../models/Category";
import uploadImageToCloudinary from "../utils/imageUpload";
import Course from "../models/Course";
import convertSecondsToDuration from "../utils/secToDuration";
import redis from "../config/redis";
import Section from "../models/Section";
import SubSection from "../models/SubSection";

//Create course
export const createCourse = async (req: Request, res: Response) => {
  try {
    // Get user ID from request object
    const userId = (req as any).user._id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      language,
      tags,
      category,
      status,
      instructions,
    } = req.body;

    // console.log("===== CREATE COURSE DATA =====");
    // console.log("Course Name: ", courseName);
    // console.log("Description: ", courseDescription);
    // console.log("What You Will Learn: ", whatYouWillLearn);
    // console.log("Price: ", price);
    // console.log("Language: ", language);
    // console.log("Tags: ", tags);
    // console.log("Category: ", category);
    // console.log("Status: ", status);
    // console.log("Instructions: ", instructions);
    // console.log("==============================");

    // Get thumbnail image from request files
    const thumbnail = (req as any).files?.thumbnailImage;
    console.log("thumbnail: ", thumbnail);

    // Parse stringified arrays if they come from form-data
    try {
      if (typeof whatYouWillLearn === "string") whatYouWillLearn = JSON.parse(whatYouWillLearn);
      if (typeof tags === "string") tags = JSON.parse(tags);
      if (typeof instructions === "string") instructions = JSON.parse(instructions);
    } catch (e) {
      console.error("Error parsing course data arrays", e);
    }

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      (Array.isArray(whatYouWillLearn) && whatYouWillLearn.length === 0) ||
      !language ||
      !price ||
      !tags ||
      (Array.isArray(tags) && tags.length === 0) ||
      !thumbnail ||
      !category ||
      !instructions ||
      (Array.isArray(instructions) && instructions.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      "course-image"
    );

    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      language,
      tags,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    await redis.del("courses:all");
    await redis.del(`courses:category:${category}`);

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });
  } catch (error: any) {
    // Handle any errors that occur during the creation of the course
    console.error("Error in createCourse", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//Edit course
export const editCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    // ✅ Destructure required fields from body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tags,
      category,
      instructions,
      status,
    } = req.body;

    // ✅ Validate required fields
    if (
      !courseId ||
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tags ||
      !category ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Find course
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ Handle thumbnail update if file uploaded
    if (req.files && (req.files as any).thumbnailImage) {
      const thumbnail = (req.files as any).thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        "course-image"
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // ✅ Update course with validated fields
    course.courseName = courseName;
    course.courseDescription = courseDescription;
    course.whatYouWillLearn = whatYouWillLearn;
    course.price = price;
    course.tags = tags; // ensure array
    course.category = category;
    course.instructions = instructions;
    course.status = status;

    await course.save();

    await redis.del("courses:all");
    await redis.del(`course:full:${courseId}`);
    await redis.del(`courses:category:${category}`);

    // ✅ Populate updated course
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "firstname lastname email role about image contactNo",
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: { path: "user", select: "firstname lastname image" }, // show reviewer info
      })
      .populate({
        path: "courseContent",
        populate: { path: "subSections" },
      });

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error: any) {
    console.error("Edit course error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Course List
// Get Course List
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      category = "all",
      minPrice,
      maxPrice,
      sort = "newest"
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build query object
    const query: any = { status: "Published" };

    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { courseDescription: { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortObj: any = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "price-low") sortObj = { price: 1 };
    if (sort === "price-high") sortObj = { price: -1 };

    // Fetch courses with pagination
    const allCourses = await Course.find(query, {
      courseName: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      studentsEnrolled: true,
      category: true,
      language: true,
      createdAt: true
    })
      .populate({ path: "instructor", select: "firstname lastname image" })
      .populate({ path: "category", select: "name description" })
      .populate({ path: "ratingAndReviews", select: "rating review" })
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalCourses = await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      courses: allCourses,
      pagination: {
        totalCourses,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCourses / Number(limit)),
        hasMore: skip + allCourses.length < totalCourses
      }
    });
  } catch (error: any) {
    console.log("Error in getAllCourse ", error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch course data`,
      error: error.message,
    });
  }
};

// Get One Single Course Details
export const getCourseFullDetails = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId is required",
      });
    }

    const cacheKey = `course:full:${courseId}`;

    // 🔥 1. Redis check
    const cachedCourse = await redis.get(cacheKey);
    if (cachedCourse) {
      return res.status(200).json({
        success: true,
        source: "cache",
        ...JSON.parse(cachedCourse),
      });
    }

    // 2. Fetch from DB
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "firstname lastname image",
      })
      .populate("category", "name description")
      .populate({
        path: "courseContent",
        select: "title",
        populate: {
          path: "subSections",
          select: "title description timeDuration videoUrl",
        },
      })
      .populate("ratingAndReviews");

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // 3. Compute duration
    let totalDurationInSeconds = 0;
    for (const content of courseDetails.courseContent as any[]) {
      for (const subSection of content.subSections || []) {
        const t = parseInt(subSection.timeDuration);
        totalDurationInSeconds += isNaN(t) ? 0 : t;
      }
    }

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    const responsePayload = {
      success: true,
      message: "Course details fetched successfully",
      data: {
        course: courseDetails,
        totalDuration,
      },
    };

    // 🔥 4. Save to Redis
    await redis.set(
      cacheKey,
      JSON.stringify(responsePayload),
      "EX",
      60 * 20 // 20 min
    );

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error("getCourseDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a list of Course for a given Instructor
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user._id;
    const { page = 1, limit = 9, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build query object
    const query: any = { instructor: instructorId };
    if (status) {
      query.status = status;
    }

    // Find courses belonging to the instructor with pagination and optional status filter
    const instructorCourses = await Course.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "instructor",
        select: "firstname lastname image",
      })
      .populate("category", "name description")
      .populate({
        path: "courseContent",
        select: "title",
        populate: {
          path: "subSections",
          select: "title description timeDuration videoUrl",
        },
      })
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalCourses = await Course.countDocuments(query);

    // Return the instructor's courses with pagination meta
    res.status(200).json({
      success: true,
      instructorCourses,
      pagination: {
        totalCourses,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCourses / Number(limit)),
        hasMore: skip + instructorCourses.length < totalCourses
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// Get Courses by Category
export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const cacheKey = `courses:category:${categoryId}`;

    // 🔥 1. Check Redis
    const cachedCourses = await redis.get(cacheKey);
    if (cachedCourses) {
      return res.status(200).json({
        success: true,
        source: "cache",
        ...JSON.parse(cachedCourses),
      });
    }

    // 2. Fetch from DB
    const courses = await Course.find(
      {
        category: categoryId,
        status: "Published",
      },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        category: true,
        language: true,
      }
    )
      .populate({ path: "instructor", select: "firstname lastname image" })
      .populate({ path: "category", select: "name description" })
      .populate({ path: "ratingAndReviews", select: "rating review" })
      .sort({ createdAt: -1 })
      .exec();

    const responsePayload = {
      success: true,
      courses,
      count: courses.length,
    };

    // 🔥 3. Save to Redis
    await redis.set(
      cacheKey,
      JSON.stringify(responsePayload),
      "EX",
      60 * 10 // 10 min
    );

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error("Error in getCoursesByCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses by category",
      error: error.message,
    });
  }
};


export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // ✅ Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const instructorId = course.instructor;
    const categoryId = course.category;
    const courseContent = course.courseContent || [];

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // ================= DELETE COURSE CONTENT =================
    for (const sectionId of courseContent) {
      const section = await Section.findById(sectionId);

      if (section?.subSections?.length) {
        // 🔥 Delete all subsections
        await SubSection.deleteMany({
          _id: { $in: section.subSections },
        });
      }

      // 🔥 Delete section
      await Section.findByIdAndDelete(sectionId);
    }

    // ================= REMOVE COURSE REFERENCES =================
    // Remove course from Instructor
    await User.findByIdAndUpdate(instructorId, {
      $pull: { courses: courseId },
    });

    // Remove course from Category
    await Category.findByIdAndUpdate(categoryId, {
      $pull: { courses: courseId },
    });

    // ================= DELETE COURSE =================
    await Course.findByIdAndDelete(courseId);

    // ================= REDIS CACHE INVALIDATION =================
    await redis.del("courses:all");
    await redis.del(`course:full:${courseId}`);
    await redis.del(`courses:category:${categoryId}`);

    return res.status(200).json({
      success: true,
      message: "Course and all related content deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};