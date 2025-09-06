
import { create } from "zustand";

interface DashboardCollapsedState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const useDashboardCollapsedStore = create<DashboardCollapsedState>((set) => ({
  collapsed: false, // default: sidebar expanded
  setCollapsed: (value) => set({ collapsed: value }),
}));
