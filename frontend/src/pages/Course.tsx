import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCoursesStore } from "@/store/courseStore";
import { Star, Users, PlayCircle, Loader2, ArrowLeft, CheckCircle2, ArrowRight, Clock, Layers } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/header/Navbar";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import type { Section, Subsection } from "@/types";

function CourseDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useAuthStore();
  const { courseDetails: course, totalCourseDuration, fetchCourseDetails } =
    useCoursesStore();
  const [buyCourseLoading, setBuyCourseLoading] = useState(false);
  const navigate = useNavigate();

  // Get category from URL to preserve it when going back
  const categoryParam = searchParams.get("category");


  const handleBuyCourse = async () => {
    if (!token) {
      navigate("/login")
      return;
    }
    setBuyCourseLoading(true);
    try {
      navigate(`/test-payment/${id}`);
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


  return (
    <div className="bg-[#050816] text-white min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 py-16 px-6 relative">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-12">
          {/* Back Button */}
          <button
            onClick={() => {
              const backUrl = categoryParam
                ? `/courses?category=${categoryParam}`
                : "/courses";
              navigate(backUrl);
            }}
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Back to Courses</span>
          </button>

          {/* Header Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
              {course.courseName}
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed max-w-3xl">
              {course.courseDescription}
            </p>

            <div className="flex flex-wrap items-center gap-8 py-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-black text-lg">{avgRating()}</span>
                <span className="text-gray-500 font-medium">
                  ({course.ratingAndReviews.length} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold">{course.studentsEnrolled.length} Joined</span>
              </div>

              <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-tighter text-sm">
                {course.language}
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="flex items-center gap-4 p-4 rounded-[2rem] glass w-fit border-white/5">
            <Avatar className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl">
              <AvatarImage
                src={course.instructor.image || `https://ui-avatars.com/api/?name=${course.instructor.firstname}+${course.instructor.lastname}&background=random`}
              />
              <AvatarFallback className="bg-blue-600 font-black text-xl">
                {course.instructor.firstname[0]}
              </AvatarFallback>
            </Avatar>
            <div className="pr-4">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-none mb-1">Created by</p>
              <p className="text-white text-xl font-black">
                {course.instructor.firstname} {course.instructor.lastname}
              </p>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full" />
              What you'll learn
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-gray-400">
              {course.whatYouWillLearn.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4 group/item">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-base font-medium group-hover/item:text-gray-200 transition-colors leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Content */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-500 rounded-full" />
                Course Curriculum
              </h2>
              <p className="text-gray-500 font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                {course.courseContent.length} Sections • {totalCourseDuration} Total Time
              </p>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/2 overflow-hidden backdrop-blur-sm">
              <Accordion type="single" collapsible className="w-full">
                {course.courseContent.map((section: Section, index: number) => (
                  <AccordionItem key={section._id} value={section._id} className="border-b border-white/5 last:border-0">
                    <AccordionTrigger className="px-8 py-6 hover:bg-white/5 transition-all text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-400">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <span className="text-lg font-black text-white block">{section.title}</span>
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{section.subSections.length} Lectures</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-black/20 px-4 pb-4">
                      <div className="rounded-3xl border border-white/5 overflow-hidden">
                        <ul className="divide-y divide-white/5">
                          {section.subSections.map((sub: Subsection) => (
                            <li
                              key={sub._id}
                              className="group flex justify-between items-center px-6 py-5 hover:bg-white/5 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                  <PlayCircle className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{sub.title}</span>
                              </div>
                              <span className="text-sm font-black text-gray-500 tabular-nums">
                                {formatDuration(parseFloat(sub.timeDuration))}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Purchase Card */}
        <div className="lg:relative">
          <div className="sticky top-28 space-y-6">
            <div className="glass p-8 rounded-[3rem] border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              {/* Animated Glow behind card */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />

              <div className="relative rounded-[2rem] overflow-hidden mb-8 shadow-2xl group/img">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover/img:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-2xl shadow-2xl">
                    ₹{course.price}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBuyCourse}
                disabled={buyCourseLoading}
                className="w-full h-16 rounded-2xl bg-white text-[#050816] font-black text-lg hover:bg-blue-500 hover:text-white hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all duration-300 mb-6 flex items-center justify-center gap-2"
              >
                {buyCourseLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Enroll Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="space-y-6">
                <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-8 h-px bg-white/10" />
                  What's included
                  <span className="w-8 h-px bg-white/10" />
                </p>

                <ul className="space-y-4">
                  {[
                    { icon: <Clock className="w-4 h-4" />, text: `${totalCourseDuration} total duration` },
                    { icon: <PlayCircle className="w-4 h-4" />, text: "Lifetime access" },
                    { icon: <Layers className="w-4 h-4" />, text: "Resource files" },
                    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Certificate on completion" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 font-bold">
                      <div className="text-blue-400">
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-500 text-xs font-bold leading-relaxed">
                  30-Day Money-Back Guarantee. <br />
                  Secure payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
