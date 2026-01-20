import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, GraduationCap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { type CourseSummary } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useCoursesStore } from "@/store/courseStore";
import { Link } from "react-router-dom";

const StudentEnrolledCourses = () => {
    const { user } = useAuthStore();
    const { courses: allCourses, fetchAllCourses } = useCoursesStore();
    const [courses, setCourses] = useState<CourseSummary[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter enrolled courses whenever courses or user changes
    useEffect(() => {
        if (!user || !user._id) return;

        const enrolledCourses = allCourses.filter((course) => {
            if (!course || !course.studentsEnrolled) return false;
            return course.studentsEnrolled.some(studentId =>
                String(studentId) === String(user._id)
            );
        });

        setCourses(enrolledCourses);
        if (allCourses.length > 0 || !user) {
            setLoading(false);
        }
    }, [allCourses, user]);

    // Fetch courses on mount
    useEffect(() => {
        fetchAllCourses();
    }, [fetchAllCourses]);

    return (
        <div className="min-h-screen p-4 sm:p-10 transition-all duration-300 w-full animate-in fade-in duration-700 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                        My <span className="text-blue-500">Enrolled</span> Courses
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        Continue your learning journey and track your progress
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="glass p-2 rounded-[2.5rem] border border-white/5 h-[400px]">
                                <Skeleton className="h-48 w-full rounded-[2rem] bg-white/5" />
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                                        <Skeleton className="h-10 flex-1 bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-[3rem] p-12 sm:p-20 text-center border border-white/5 shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <GraduationCap className="text-blue-500 w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">No courses yet?</h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                            Start your expert coding journey today and unlock your true potential with our premium courses.
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                            Browse Courses
                            <BookOpen size={20} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group"
                            >
                                <div className="glass p-2 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="relative h-48 rounded-[2rem] overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                                {course.language}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">
                                                {course.courseName}
                                            </h2>

                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-white/10 p-0.5">
                                                    <AvatarImage
                                                        src={`https://ui-avatars.com/api/?name=${course?.instructor?.firstname}+${course?.instructor?.lastname}&background=random`}
                                                    />
                                                    <AvatarFallback className="bg-blue-600 text-white font-black">
                                                        {course.instructor.firstname.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Instructor</span>
                                                    <span className="text-sm text-gray-200 font-bold">{course.instructor.firstname} {course.instructor.lastname}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/course/${course._id}/content`}
                                            className="flex items-center justify-center gap-2 py-4 rounded-2xl w-full bg-white/[0.03] border border-white/5 text-white font-black hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 group/btn shadow-xl shadow-black/20"
                                        >
                                            <BookOpen size={18} className="text-blue-500 group-hover/btn:text-white transition-colors" />
                                            View Lessons
                                        </Link>
                                    </CardContent>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentEnrolledCourses;
