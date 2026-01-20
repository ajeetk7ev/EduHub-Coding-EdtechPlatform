import {
  User,
  LayoutDashboard,
  BookOpen,
  PlusSquare,
  GraduationCap,
  Settings,
  Home,
  PieChart as PieChartIcon,
} from "lucide-react";
import { ACCOUNT_TYPE } from "@/constants/role";

export const sidebarLinks = [
  // Common
  {
    id: 0,
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: User,
  },

  {
    id: 2,
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },

  // Instructor Only
  {
    id: 7,
    name: "Analytics",
    path: "/dashboard/instructor/analytics",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: PieChartIcon,
  },
  {
    id: 4,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: BookOpen,
  },
  {
    id: 5,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: PlusSquare,
  },


  // Student Only
  {
    id: 6,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: GraduationCap,
  },

  // Admin Only
  {
    id: 10,
    name: "Dashboard",
    path: "/dashboard/admin",
    type: ACCOUNT_TYPE.ADMIN,
    icon: LayoutDashboard,
  },
  {
    id: 11,
    name: "Users",
    path: "/dashboard/admin/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: User,
  },
  {
    id: 12,
    name: "Courses",
    path: "/dashboard/admin/courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: BookOpen,
  },
];
