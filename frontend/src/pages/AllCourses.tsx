import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Users, Star, Layers, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCoursesStore } from "@/store/courseStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

function AllCourses() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { courses, fetchAllCourses, pagination, courseLoading } = useCoursesStore();
    const { categories, fetchAllCategories } = useCategoryStore();

    // Local state for filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");

    const categoryParam = searchParams.get("category") || "all";
    const pageParam = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    // Debounced search/filter fetch
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAllCourses({
                page: pageParam,
                limit: 6,
                search: searchTerm,
                category: categoryParam,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sort
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [pageParam, searchTerm, categoryParam, minPrice, maxPrice, sort, fetchAllCourses]);

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== "all" && value !== "") {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // Reset to page 1 on filter change
        if (key !== "page") newParams.delete("page");
        setSearchParams(newParams, { replace: true });
    };

    const handlePageChange = (newPage: number) => {
        handleFilterChange("page", newPage.toString());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Navbar />
            <section className="bg-[#050816] text-white py-24 px-6 min-h-screen relative overflow-hidden -mt-40 pt-40">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-7xl mx-auto">

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                        {/* Search & Basic Filters */}
                        <div className="lg:col-span-3 space-y-8">
                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search for courses, technologies, or topics..."
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-xl text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all shadow-2xl"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        // handleFilterChange is triggered by useEffect debounce
                                    }}
                                />
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleFilterChange("category", "all")}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${categoryParam === "all"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    All Courses
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleFilterChange("category", cat._id)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${categoryParam === cat._id
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price & Sort Filters */}
                        <div className="glass-dark p-6 rounded-[2.5rem] border border-white/5 space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 text-center">Refine Results</h3>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Range</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <span className="text-gray-600">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort By</p>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 text-gray-300"
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        handleFilterChange("sort", e.target.value);
                                    }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Course Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {courseLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="glass rounded-[2.5rem] p-6 animate-pulse">
                                    <div className="w-full h-52 bg-white/5 rounded-[2rem] mb-6" />
                                    <div className="space-y-4 px-2">
                                        <div className="h-6 bg-white/5 rounded-lg w-3/4" />
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5" />
                                            <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course) => {
                                // Simplified avgRating for summary
                                const avgRating = course.ratingAndReviews?.length > 0 ? "4.5" : "New";

                                return (
                                    <div
                                        key={course._id}
                                        className="group relative glass p-6 rounded-[2.5rem] border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                                    >
                                        <div className="relative rounded-[2rem] overflow-hidden mb-6 shadow-2xl">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName}
                                                className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 inline-flex px-3 py-1.5 rounded-xl glass-dark border-white/10 text-[10px] font-black text-white uppercase tracking-wider">
                                                {course.category?.name || "General"}
                                            </div>
                                            <div className="absolute bottom-4 right-4 inline-flex px-4 py-2 rounded-xl bg-blue-600 shadow-xl text-white font-black text-lg">
                                                ₹{course.price.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <h3 className="text-xl font-black text-white leading-snug mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                                                {course.courseName}
                                            </h3>

                                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 mb-6">
                                                <Avatar className="h-8 w-8 rounded-xl ring-2 ring-white/5">
                                                    <AvatarImage src={course.instructor.image} />
                                                    <AvatarFallback className="bg-blue-600 text-[10px] font-bold">
                                                        {course.instructor.firstname[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-xs">
                                                        {course.instructor.firstname} {course.instructor.lastname}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Mentor</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-black">{avgRating}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                                    <Users className="w-3 h-3" />
                                                    <span className="text-xs font-black">{course.studentsEnrolled?.length || 0}</span>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/course/${course._id}`}
                                                className="inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-black hover:bg-white hover:text-[#050816] transition-all duration-300"
                                            >
                                                Explore Course
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-24 glass rounded-[3rem] border-white/5">
                                <Layers className="w-12 h-12 text-gray-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-white mb-2">No Courses Match</h3>
                                <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-4">
                            <button
                                disabled={pagination.currentPage === 1}
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-blue-600 hover:border-blue-600 transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-12 h-12 rounded-2xl font-black transition-all ${pagination.currentPage === i + 1
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-blue-600 hover:border-blue-600 transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}

export default AllCourses;
