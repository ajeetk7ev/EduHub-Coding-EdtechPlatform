import { useEffect, useState, type JSX } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Star,
  Globe,
  Code,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useCoursesStore } from "@/store/courseStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categoryIcons: Record<string, JSX.Element> = {
  "Web Development": <Globe className="w-6 h-6" />,
  "Programming Languages": <Code className="w-6 h-6" />,
  DSA: <Layers className="w-6 h-6" />,
  Databases: <Database className="w-6 h-6" />,
};

function FeaturedCourses() {
  const { categories, fetchAllCategories, categoryLoading } = useCategoryStore();
  const { courses, fetchAllCourses, courseLoading } = useCoursesStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    fetchAllCategories();
    fetchAllCourses();
  }, [fetchAllCategories, fetchAllCourses]);

  // Set default active category (first one)
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories, activeCategory]);

  const activeCourses = courses.filter(
    (course) => course.category._id === activeCategory
  );

  return (
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Popular Categories
          </span>
        </h2>
        <p className="text-gray-400 mb-12">
          Find the right learning path for your career goals 🚀
        </p>

        {/* Category Tabs */}


        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categoryLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-full bg-gray-800 animate-pulse w-32 h-10"
              />
            ))
          ) :
            categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat._id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {categoryIcons[cat.name] || <Globe className="w-5 h-5" />}
                {cat.name}
                <span className="text-xs text-gray-400">
                  ({courses.filter((c) => c.category?._id === cat._id).length})
                </span>
              </button>
            ))}


        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courseLoading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-2xl shadow-md animate-pulse overflow-hidden"
              >
                <div className="w-full h-44 bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-700" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="h-8 bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))
          ) : activeCourses.length > 0 ? (
            activeCourses.map((course) => {
              const avgRating =
                course.ratingAndReviews?.length > 0
                  ? (
                    course.ratingAndReviews.reduce(
                      (acc, curr) => acc + curr.rating,
                      0
                    ) / course.ratingAndReviews.length
                  ).toFixed(1)
                  : "N/A";

              return (
                <div
                  key={course._id}
                  className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 text-left overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={`Course: ${course.courseName}`}
                      className="w-full h-44 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-amber-300 text-gray-900 text-xs px-2 py-1 rounded-md">
                      {course.category.name}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 mb-2">
                      {course.courseName.length > 25
                        ? course.courseName.substring(0, 35) + "..."
                        : course.courseName}
                    </h3>

                    {/* Instructor */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={
                              course.instructor.image ||
                             `https://ui-avatars.com/api/?name=${course?.instructor?.firstname} ${course.instructor.lastname} &background=random`
                            }
                            alt={`${course.instructor.firstname}`}
                          />
                          <AvatarFallback>
                            {course.instructor.firstname[0]}
                            {course.instructor.lastname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">
                          {course.instructor.firstname}{" "}
                          {course.instructor.lastname}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-400">
                        ₹{course.price}
                      </div>
                    </div>

                    {/* Rating & Students */}
                    <div className="flex justify-between items-center text-sm mb-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{avgRating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsEnrolled?.length || 0} students</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/course/${course._id}`}
                      className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-pink-600 text-white text-sm transition-transform transform hover:scale-105"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No courses found for this category.
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center mt-6">
        <Link
          to={'/courses'}
          className="px-6 py-2 rounded-2xl text-lg font-semibold 
                   bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 
                   transition-all duration-300 ease-in-out flex items-center gap-2"
        >
          View All Courses
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

export default FeaturedCourses;
