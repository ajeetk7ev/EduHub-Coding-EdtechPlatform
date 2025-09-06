import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/constants/api";
import type { User } from "@/types";
import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "@/utlils/localstorage";


interface AuthState {
  user: User | null;
  token: string | null;
  authIsLoading: boolean;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loadUser: () => void;
  logout: () => void;
}



export const useAuthStore = create<AuthState>((set) => ({
  user: getFromLocalStorage('user') ? getFromLocalStorage('user') : null,
  token: getFromLocalStorage('token') ? getFromLocalStorage('token') : null,
  authIsLoading: false,

  register: async (firstname, lastname, email, password) => {
    set({ authIsLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        firstname,
        lastname,
        email,
        password,
      });

      console.log("API RES ",res)

      if (res.status === 201 && res.data.success) {
        return { success: true, message: res.data.message || "Registered successfully" };
      }

    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      set({ authIsLoading: false });
    }
  },

  login: async (email, password) => {
    set({ authIsLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.status === 200 && res.data.success) {
        const { token, user, message } = res.data;
        setToLocalStorage("user", user);
        setToLocalStorage("token", token);

        set({ token, user });
        return { success: true, message };
      } else {
        return { success: false, error: res.data.message || "Invalid credentials" };
      }

    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data.message || error.message };
    } finally {
      set({ authIsLoading: false });
    }
  },


  loadUser:  () => {

    try {
      const storedUser = getFromLocalStorage("user");
      const storedToken = getFromLocalStorage("token");
      // console.log("STORESD USER IS ", storedUser);
      if (storedUser && storedToken) {
        set({
          user: storedUser,
          token: storedToken
        });
      }
      return;
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } 
  },


  logout: () => {
       removeFromLocalStorage("user");
       removeFromLocalStorage("token");
       set({ user: null, token: null });
  },
}));