
import type { Category } from "@/types";
import { create } from "zustand";
import { API_URL } from "@/constants/api";
import axios from "axios";

interface CategoryState {
  categories: Category[];
  fetchAllCategories: () => void;
  categoryLoading: boolean;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  categoryLoading: false,
  fetchAllCategories: async () => {
    try {
      set({ categoryLoading: true });
      const res = await axios.get(`${API_URL}/category`);

      // Defensive check: ensure res.data.categories is an array
      const fetchedCategories = Array.isArray(res.data?.categories)
        ? res.data.categories
        : Array.isArray(res.data?.data?.categories)
          ? res.data.data.categories
          : [];

      set({ categories: fetchedCategories });
    } catch (error) {
      console.log("Error in fetchAllCategories", error);
      set({ categories: [] }); // Ensure it stays an array on error
    } finally {
      set({ categoryLoading: false });
    }
  },
}));
