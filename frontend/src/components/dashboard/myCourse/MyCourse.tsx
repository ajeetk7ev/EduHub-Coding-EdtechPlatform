import { useEffect, useState } from "react";
import { Users, IndianRupee, Edit2, PlusCircle, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { type CourseDetails } from "@/types";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import UpdateCourseDialog from "../editCourse/UpdateCourseDialog";
import UpdateCourseContentDialog from "../editCourse/updateCourseContent";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MyCourses = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Published" | "Draft">("Published");
  const [courses, setCourses] = useState<CourseDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalCourses: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  } | null>(null);

  const [step, setStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [editCourseDetailsOpen, setEditCourseDetailsOpen] = useState(false);
  const [editCourseContentOpen, setEditCourseContentOpen] = useState(false);
  const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/course/getInstructorCourses`, {
        params: {
          page: currentPage,
          limit: 9,
          status: activeTab,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCourses(res.data.instructorCourses);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.log("error in fetching instructor courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, [currentPage, activeTab]);

  const handleTabChange = (tab: "Published" | "Draft") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleEditClick = (course: CourseDetails) => {
    setSelectedCourse(course);
    setChoiceDialogOpen(true);
  };

  const handleCourseUpdated = (updated: CourseDetails) => {
    setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  useEffect(() => {
    if (step === 1 && selectedCourse) {
      setEditCourseDetailsOpen(true);
      setStep(0);
    } else if (step === 2 && selectedCourse) {
      setEditCourseContentOpen(true);
      setStep(0);
    }
  }, [step, selectedCourse]);

  return (
    <div className="p-4 sm:p-10 space-y-12 relative overflow-hidden min-h-screen">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            My <span className="text-blue-500">Courses</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Manage your curriculum and student engagement
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/5 shadow-2xl backdrop-blur-md">
          {(["Published", "Draft"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative px-8 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-500 rounded-xl overflow-hidden
                ${activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-600/20"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass p-2 rounded-[2.5rem] border border-white/5 h-[450px]">
                <Skeleton className="h-48 w-full rounded-[2rem] bg-white/5" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                  <div className="flex justify-between mt-8">
                    <Skeleton className="h-10 w-24 bg-white/5 rounded-xl" />
                    <Skeleton className="h-10 w-24 bg-white/5 rounded-xl" />
                  </div>
                </div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <div className="glass p-2 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col relative">
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className={`px-4 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest
                      ${course.status === "Published"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-48 rounded-[2rem] overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050816] transition-opacity duration-500 group-hover:opacity-40 opacity-20" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight min-h-[3rem]">
                          {course.courseName}
                        </h2>
                        <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black text-blue-400">
                          {course.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="text-xs font-bold">{course.studentsEnrolled.length} <span className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Students</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee size={16} className="text-emerald-500" />
                          <span className="text-xs font-black text-white">{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="flex items-center justify-center gap-2 flex-1 bg-white/[0.03] border border-white/5 text-white font-black text-sm py-4 rounded-2xl hover:bg-white/[0.08] transition-all active:scale-[0.98]"
                      >
                        <Edit2 size={16} className="text-blue-500" /> Edit
                      </button>
                      <Link
                        to={`/course/${course._id}`}
                        className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white font-black text-sm py-4 rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
                      >
                        View <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-xl font-bold">
                No {activeTab.toLowerCase()} courses found.
              </p>
              <p className="text-gray-600 mt-2">Ready to share your knowledge with the world?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-blue-600 hover:border-blue-600 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-blue-600 hover:border-blue-600 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard/add-course")}
        className="fixed bottom-10 right-10 flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all z-50 group border border-white/10"
      >
        <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        <span className="uppercase tracking-widest text-xs">Add New Course</span>
      </motion.button>

      {/* Choice Dialog */}
      <Dialog open={choiceDialogOpen} onOpenChange={setChoiceDialogOpen}>
        <DialogContent className="bg-[#0f172a] border border-white/10 text-white rounded-[2.5rem] p-10 max-w-md shadow-2xl backdrop-blur-3xl">
          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-3xl font-black">Edit Content</DialogTitle>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Choose what you want to modify</p>
          </DialogHeader>
          <div className="space-y-4 mt-8">
            <button
              onClick={() => {
                setStep(1);
                setChoiceDialogOpen(false);
              }}
              className="w-full group flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300"
            >
              <div className="text-left">
                <p className="font-black text-lg">Course Details</p>
                <p className="text-xs text-gray-500 group-hover:text-blue-100 font-bold transition-colors">Information, Thumbnail, Pricing</p>
              </div>
              <Edit2 className="text-blue-500 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => {
                setStep(2);
                setChoiceDialogOpen(false);
              }}
              className="w-full group flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
            >
              <div className="text-left">
                <p className="font-black text-lg">Course Builder</p>
                <p className="text-xs text-gray-500 group-hover:text-indigo-100 font-bold transition-colors">Sections, Lessons, Videos</p>
              </div>
              <PlusCircle className="text-indigo-500 group-hover:text-white transition-colors" />
            </button>
          </div>
          <DialogFooter className="mt-8">
            <button
              onClick={() => setChoiceDialogOpen(false)}
              className="w-full py-4 text-gray-500 hover:text-white font-bold transition-colors"
            >
              Maybe later
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOGS */}
      <UpdateCourseDialog
        open={editCourseDetailsOpen}
        onOpenChange={setEditCourseDetailsOpen}
        course={selectedCourse}
        onUpdated={handleCourseUpdated}
      />

      <UpdateCourseContentDialog
        open={editCourseContentOpen}
        onOpenChange={setEditCourseContentOpen}
        course={selectedCourse}
      />
    </div>
  );
};

export default MyCourses;
