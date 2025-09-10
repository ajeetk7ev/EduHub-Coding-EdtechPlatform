import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCoursesStore } from "@/store/courseStore";
import { Star, Users, PlayCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/header/Navbar";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { API_URL } from "@/constants/api";
import toast from "react-hot-toast";
import type { Section, Subsection } from "@/types";
import { useNavigate } from "react-router-dom";

function CourseDetails() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { courseDetails: course, totalCourseDuration, fetchCourseDetails } =
    useCoursesStore();
  const [buyCourseLoading, setBuyCourseLoading] = useState(false);
  const navigate = useNavigate();


  const handleBuyCourse = async () => {
    if (!token) {
      navigate("/login")
      return;
    }
    setBuyCourseLoading(true);
    try {
      const res = await axios.post(`${API_URL}/course/buy`, { courseId: id }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log("PRINTING COURSE BUYING RESPONSE", res);

      if (res.data.success) {
        toast.success(res.data.message || "Enrolled in course Successfully")
        navigate("/dashboard/enrolled-courses")
      }
    } catch (error: any) {
      console.log("Error in buying course", error);
      toast.error(error.response.data.message || "Failed to enroll course")
    } finally {
      setBuyCourseLoading(false);
    }
  }

  function formatDuration(seconds: number) {
    if (isNaN(seconds)) return "0:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    } else {
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
  }

  const avgRating = () => {
    console.log("COURSE RATING AND REVIEWS ", course?.ratingAndReviews);
    const avgRating =
      course?.ratingAndReviews!?.length > 0
        ? (
          course?.ratingAndReviews.reduce(
            (acc, curr) => acc + curr.rating,
            0
          ) / course?.ratingAndReviews!?.length
        ).toFixed(1)
        : "N/A";

    return avgRating;
  }


  useEffect(() => {
    if (id) fetchCourseDetails(id);
  }, [id, fetchCourseDetails]);

  if (!course) {
    return (
      <p className="w-screen h-screen flex items-center justify-center text-center text-gray-400">
        Loading...
      </p>
    );
  }

  console.log("PRINTING COURSE IS ", course);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 py-12 px-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold leading-tight">
            {course.courseName}
          </h1>
          <p className="text-gray-400 text-lg">{course.courseDescription}</p>

          {/* Rating, Students, Language */}
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{avgRating()}</span>
              <span className="text-gray-500">
                ({course.ratingAndReviews.length} ratings)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{course.studentsEnrolled.length} students</span>
            </div>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
              {course.language}
            </Badge>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={course.instructor.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>
                {course.instructor.firstname[0]}
                {course.instructor.lastname[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-300 text-lg">
              Created by{" "}
              <span className="font-semibold">
                {course.instructor.firstname} {course.instructor.lastname}
              </span>
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">What you'll learn</h2>
            <ul className="grid grid-cols-1  gap-3 text-gray-300 text-sm">
              {course.whatYouWillLearn.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span>✅</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Content */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Course content ({course.courseContent.length} sections) •{" "}
              {totalCourseDuration}
            </h2>

            <Accordion
              type="multiple"
              className="w-full border border-gray-800 rounded-xl divide-y divide-gray-800"
            >
              {course.courseContent.map((section: Section) => (
                <AccordionItem key={section._id} value={section._id}>
                  <AccordionTrigger className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-left">
                    <span className="font-semibold">{section.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-950">
                    <ul className="space-y-3">
                      {section.subSections.map((sub: Subsection) => (
                        <li
                          key={sub._id}
                          className="flex justify-between items-center text-gray-400 hover:text-white transition"
                        >
                          <div className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                            <span>{sub.title}</span>
                          </div>
                          <span className="text-sm">
                            {formatDuration(parseFloat(sub.timeDuration))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* RIGHT SIDE - Purchase Card */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl sticky top-20 h-fit border border-gray-800">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h3 className="text-3xl font-bold text-blue-400 mb-4">
            ₹{course.price}
          </h3>
          <Button
            onClick={handleBuyCourse}
            disabled={buyCourseLoading}
            className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
          >
            {buyCourseLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Buy Now"
            )}
          </Button>
          <p className="text-sm text-gray-400">
            30-Day Money-Back Guarantee 💸
          </p>

          <ul className="mt-6 text-sm text-gray-300 space-y-3">
            <li>📺 {totalCourseDuration} on-demand video</li>
            <li>♾ Full lifetime access</li>
            <li>📱 Access on mobile & TV</li>
            <li>🎓 Certificate of completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
