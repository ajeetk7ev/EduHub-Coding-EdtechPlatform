import { Request, Response } from "express"
import User from "../models/User"
import Category from "../models/Category"
import uploadImageToCloudinary from "../utils/imageUpload"
import Course from "../models/Course"
import convertSecondsToDuration from "../utils/secToDuration"
import redis from "../config/redis"



//Create course
export const createCourse = async (req: Request, res: Response) => {
    try {
        // Get user ID from request object
        const userId = (req as any).user._id

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
        const thumbnail = (req as any).files.thumbnailImage
        console.log("thumbnail: ", thumbnail);

        // Check if any of the required fields are missing
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn.length ||
            !language ||
            !price ||
            !tags.length ||
            !thumbnail ||
            !category ||
            !instructions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            })
        }
        if (!status || status === undefined) {
            status = "Draft"
        }
        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        })

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            })
        }

        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            })
        }
        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            "course-image"
        )

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
        })

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
        )

        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            course: newCourse
        })
    } catch (error: any) {
        // Handle any errors that occur during the creation of the course
        console.error("Error in createCourse", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
}

//Edit course
export const editCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.id
        // ✅ Destructure required fields from body
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tags,
            category,
            instructions,
            status
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
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, "course-image");
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

        // ✅ Populate updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "instructor",
                select: "firstname lastname email role about image contactNo"
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
    const cacheKey = "courses:all";

    // 🔥 1. Check cache
    const cachedCourses = await redis.get(cacheKey);
    if (cachedCourses) {
      return res.status(200).json({
        success: true,
        source: "cache",
        courses: JSON.parse(cachedCourses),
      });
    }

    // 2. Fetch from DB
    const allCourses = await Course.find(
      { status: "Published" },
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
      .exec();

    // 🔥 3. Save to Redis
    await redis.set(
      cacheKey,
      JSON.stringify(allCourses),
      "EX",
      60 * 10 // 10 min
    );

    return res.status(200).json({
      success: true,
      source: "db",
      courses: allCourses,
    });
  } catch (error: any) {
    console.log("Error in getAllCourse ", error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
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
                message: "CourseId is required"
            })
        }

        // ✅ Find course and populate deeply
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
            .populate("ratingAndReviews")


        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }


        // ✅ Compute total duration safely
        let totalDurationInSeconds = 0;
        for (const content of courseDetails.courseContent as any[]) {
            if (content && content.subSections.length > 0) {
                for (const subSection of content.subSections) {
                    const timeDurationInSeconds = parseInt(subSection.timeDuration);
                    totalDurationInSeconds += isNaN(timeDurationInSeconds) ? 0 : timeDurationInSeconds;
                }
            }
        }


        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                course: courseDetails,
                totalDuration,
            },
        });
    } catch (error: any) {
        console.error("getCourseDetails error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// Get a list of Course for a given Instructor
export const getInstructorCourses = async (req: Request, res: Response) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = (req as any).user._id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })
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

        // Return the instructor's courses
        res.status(200).json({
            success: true,
            instructorCourses,
        })
    } catch (error: any) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}


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

        // Find all published courses for the given category
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

        return res.status(200).json({
            success: true,
            courses,
            count: courses.length,
        });
    } catch (error: any) {
        console.error("Error in getCoursesByCategory:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses by category",
            error: error.message,
        });
    }
}




