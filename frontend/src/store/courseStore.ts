import { create } from "zustand";
import { type CourseSummary, type CourseDetails } from "@/types";
import axios from "axios";
import { API_URL } from "@/constants/api";

// ---------- Store ----------
interface CoursesState {
  courses: CourseSummary[];
  courseDetails: CourseDetails | null;
  totalCourseDuration:string | "";
  courseLoading: boolean;
  courseDetailsLoading: boolean;

  fetchAllCourses: () => Promise<void>;
  fetchCoursesByCategory: (categoryId: string) => Promise<void>;
  fetchCourseDetails: (id: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  courseDetails: null,
  totalCourseDuration:"",
  courseLoading: false,
  courseDetailsLoading: false,

  // Fetch all published courses (summary list)
  fetchAllCourses: async () => {
    set({ courseLoading: true });
    try {
      const res = await axios.get(`${API_URL}/course`);
      if (res.data.success) {
        set({ courses: res.data.courses });
      }
    } catch (error) {
      console.error("Error fetching all courses:", error);
    } finally {
      set({ courseLoading: false });
    }
  },

  // Fetch courses by category
  fetchCoursesByCategory: async (categoryId: string) => {
    set({ courseLoading: true });
    try {
      const res = await axios.get(`${API_URL}/course/category/${categoryId}`);
      if (res.data.success) {
        set({ courses: res.data.courses });
      }
    } catch (error) {
      console.error("Error fetching courses by category:", error);
      set({ courses: [] });
    } finally {
      set({ courseLoading: false });
    }
  },

  // Fetch single course with full details (sections, instructor, etc.)
  fetchCourseDetails: async (id: string) => {
    set({ courseDetailsLoading: true });
    try {
      console.log("PRINTING ID ", id);
      const res = await axios.get(`${API_URL}/course/${id}`);
      if (res.data.success) {
        console.log('PRINTING FULL COURSE DETAILS',res.data);
        set({ courseDetails: res.data.data.course });
        set({totalCourseDuration:res.data.data.totalDuration})
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      set({ courseDetailsLoading: false });
    }
  },
}));
