import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { type CourseSummary } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useCoursesStore } from "@/store/courseStore";
import { Link } from "react-router-dom";

const StudentEnrolledCourses = () => {
    const { user } = useAuthStore();
    console.log("USER IS ", user);
    const { courses: allCourses } = useCoursesStore();
    const [courses, setCourses] = useState<CourseSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const filterUserCourse = async () => {
        if (!user) return;

        setLoading(true);


        const enrolledCourses = allCourses.filter((course) =>
            course.studentsEnrolled.includes(user._id)
        );

        setTimeout(() => {
            setCourses(enrolledCourses);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        filterUserCourse();
    }, [allCourses, user]);

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-6">
            <h1 className="text-3xl font-bold text-gray-100 text-center mb-10">
                🎓 My Enrolled Courses
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="bg-gray-800 shadow-md rounded-2xl">
                                <Skeleton className="h-40 w-full rounded-t-2xl" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                </div>
            ) : courses.length === 0 ? (
                <p className="text-gray-400 text-center">
                    You haven’t enrolled in any courses yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-gray-800 border border-gray-700 hover:shadow-xl transition rounded-2xl overflow-hidden p-0">
                                {/* Thumbnail Image — flush at top */}
                                <img
                                    src={course.thumbnail}
                                    alt={course.courseName}
                                    className="object-cover w-full h-44 rounded-t-2xl"
                                />

                                {/* Content with padding */}
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-white">
                                            {course.courseName.length > 25
                                                ? course.courseName.substring(0, 35) + "..."
                                                : course.courseName}
                                        </h2>

                                        <p className="bg-amber-300 text-black text-xs px-2 py-1 rounded-full">
                                            {course.language}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={`https://ui-avatars.com/api/?name=${course?.instructor?.firstname} ${course.instructor.lastname} &background=random`}
                                            />
                                            <AvatarFallback>{course.instructor.firstname.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-gray-300">{course.instructor.firstname} {course.instructor.lastname}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">

                                        <Link
                                            to={`/course/${course._id}/content`}
                                            className="flex items-center justify-center py-2 rounded-xl w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer"
                                        >
                                            <BookOpen size={16} className="mr-1" />
                                            View Content
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>


                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentEnrolledCourses;
