import { useEffect, useState } from "react";
import { Users, IndianRupee, Edit2, Eye, PlusCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { type CourseDetails } from "@/types";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import UpdateCourseDialog from "../editCourse/UpdateCourseDialog";
import { Button } from "@/components/ui/button";
import UpdateCourseContentDialog from "../editCourse/updateCourseContent";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"Published" | "Draft">("Published");
  const [courses, setCourses] = useState<CourseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [editCourseDetailsOpen, setEditCourseDetailsOpen] = useState(false);
  const [editCourseContentOpen, setEditCourseContentOpen] = useState(false);
  console.log("STEP IS ", step);



  const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);

  const filteredCourses = courses.filter((course) => course.status === activeTab);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/course/getInstructorCourses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setCourses(res.data.instructorCourses);
    } catch (error) {
      console.log("error in fetching instructor courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

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
  } else if (step === 2 && selectedCourse) {
    setEditCourseContentOpen(true);
  }
}, [step]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-gray-100 relative">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight text-center">
        My Courses <span className="text-indigo-400">Dashboard</span> 🚀
      </h1>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-full p-1 max-w-sm mx-auto mb-10 shadow-inner">
        {(["Published", "Draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 text-sm font-semibold rounded-full transition-all duration-300 
              ${activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-6 flex-grow flex flex-col gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between mt-auto">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="p-4 bg-gray-800 flex justify-between gap-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group"
            >
              {course.status === "Draft" && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full shadow-md z-10">
                  DRAFT
                </span>
              )}
              <div className="h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white line-clamp-2 min-h-[3rem]">
                    {course.courseName.length > 35
                      ? course.courseName.substring(0, 35) + "..."
                      : course.courseName}
                  </h2>
                  <p className="bg-amber-300 text-black text-xs px-2 py-1 rounded-full">
                    {course.language}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 ">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Users className="w-4 h-4 mr-2 text-green-400" />
                    <span>{course.studentsEnrolled.length} Students</span>
                  </div>
                  <div className="flex items-center text-indigo-400 font-bold text-lg">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {course.price}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-800 flex justify-between gap-3">
                <button
                  onClick={() => handleEditClick(course)}
                  className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <Link to={`/course/${course._id}`} className="flex items-center justify-center gap-2 flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none">
                  <Eye className="w-4 h-4" /> View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full py-10 text-lg">
            No {activeTab.toLowerCase()} courses found. Start creating!
          </p>
        )}
      </div>

      {/* Add New Course */}
      <button
        onClick={() => (window.location.href = "/dashboard/add-course")}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-xl transition-all duration-300"
      >
        <PlusCircle className="w-5 h-5" />
        Add New Course
      </button>

      {/* Choice Dialog */}
      <Dialog open={choiceDialogOpen} onOpenChange={setChoiceDialogOpen}>
        <DialogContent className="bg-gray-900 text-white rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>What do you want to edit?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setStep(1);
                setChoiceDialogOpen(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Course Details
            </Button>
            <Button
              onClick={() => {
                 setStep(2);
                 setChoiceDialogOpen(false);
              }}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Course Content (Sections & Subsections)
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setChoiceDialogOpen(false)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* EDIT DIALOG */}
        <UpdateCourseDialog
          open={editCourseDetailsOpen}
          onOpenChange={setEditCourseDetailsOpen}
          course={selectedCourse}
          onUpdated={handleCourseUpdated}
        />
      

      {/* Edit CourseContent Dialog */}
    
        <UpdateCourseContentDialog
         open={editCourseContentOpen}
         onOpenChange={setEditCourseContentOpen}
         course={selectedCourse}
        />
      
    </div>
  );
};

export default MyCourses;
