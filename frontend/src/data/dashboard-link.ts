import {
  User,
  LayoutDashboard,
  BookOpen,
  PlusSquare,
  GraduationCap,
  BarChart,
  Settings,
  HelpCircle,
  Bell,
  Home,
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
    id: 3,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: LayoutDashboard,
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
  {
    id: 6,
    name: "Analytics",
    path: "/dashboard/analytics",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: BarChart,
  },

  // Student Only
  {
    id: 7,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: GraduationCap,
  },
  

  // Common helpful stuff
  {
    id: 10,
    name: "Notifications",
    path: "/dashboard/notifications",
    icon: Bell,
  },
  {
    id: 11,
    name: "Help & Support",
    path: "/dashboard/help",
    icon: HelpCircle,
  },
];
