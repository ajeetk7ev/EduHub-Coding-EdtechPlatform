import { create } from "zustand";
import { type CourseSummary, type CourseDetails } from "@/types";
import axios from "axios";
import { API_URL } from "@/constants/api";

// ---------- Store ----------
interface PaginationData {
  totalCourses: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

interface FetchCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface CoursesState {
  courses: CourseSummary[];
  courseDetails: CourseDetails | null;
  totalCourseDuration: string | "";
  courseLoading: boolean;
  courseDetailsLoading: boolean;
  pagination: PaginationData | null;

  fetchAllCourses: (params?: FetchCoursesParams) => Promise<void>;
  fetchCourseDetails: (id: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  courseDetails: null,
  totalCourseDuration: "",
  courseLoading: false,
  courseDetailsLoading: false,
  pagination: null,

  // Fetch all published courses with pagination and filters
  fetchAllCourses: async (params = {}) => {
    set({ courseLoading: true });
    try {
      const {
        page = 1,
        limit = 9,
        search = "",
        category = "all",
        minPrice,
        maxPrice,
        sort = "newest"
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        category,
        sort
      });

      if (minPrice) queryParams.append("minPrice", minPrice.toString());
      if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());

      const res = await axios.get(`${API_URL}/course?${queryParams.toString()}`);
      if (res.data.success) {
        set({
          courses: res.data.courses,
          pagination: res.data.pagination
        });
      }
    } catch (error) {
      console.error("Error fetching all courses:", error);
      set({ courses: [], pagination: null });
    } finally {
      set({ courseLoading: false });
    }
  },

  // Fetch single course with full details (sections, instructor, etc.)
  fetchCourseDetails: async (id: string) => {
    set({ courseDetailsLoading: true });
    try {

      const res = await axios.get(`${API_URL}/course/${id}`);
      if (res.data.success) {
        set({ courseDetails: res.data.data.course });
        set({ totalCourseDuration: res.data.data.totalDuration })
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      set({ courseDetailsLoading: false });
    }
  },
}));
