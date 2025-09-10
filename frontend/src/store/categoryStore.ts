
import type { Category } from "@/types";
import { create } from "zustand";
import { API_URL } from "@/constants/api";
import axios from "axios";

interface CategoryState {
  categories: Category[];
  fetchAllCategories:() => void;
  categoryLoading:boolean;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories:[],
  categoryLoading:false,
  fetchAllCategories:async () => {
      try {
        set({categoryLoading:true});
        const res = await axios.get(`${API_URL}/category`);
        set({categories:res.data.categories});
      } catch (error) {
        console.log("Error in fetchAllCategories",error);
      } finally{
        set({categoryLoading:false})
      }
  }
}));
