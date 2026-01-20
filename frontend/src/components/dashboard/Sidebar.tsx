import SidebarLink from "./SidebarLink";
import { useAuthStore } from "@/store/authStore";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarLinks } from "@/data/dashboard-link";
import { useDashboardCollapsedStore } from "@/store/dashboardCollapsedStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const { collapsed, setCollapsed } = useDashboardCollapsedStore();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  }

  // ✅ Auto update collapsed based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true); // collapse for tablets/small screens
      } else {
        setCollapsed(false); // expand for desktops
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={cn(
          "hidden sm:flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 rounded-[2.5rem] bg-[#0d1b2a]/40 border border-white/5 backdrop-blur-3xl transition-all duration-500 shadow-2xl overflow-hidden sticky top-4",
          collapsed ? "w-24" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8">
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black text-white tracking-tighter"
            >
              Edu<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Hub</span>
            </motion.h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-2xl bg-white/5 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((link) => {
            if (link.type && link.type !== user?.role) return null;
            return (
              <SidebarLink
                key={link.id}
                name={link.name}
                path={link.path}
                icon={link.icon}
                collapsed={collapsed}
              />
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className={cn(
              "group w-full flex items-center gap-3 px-4 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-[0.98]",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {!collapsed && <span className="font-bold uppercase tracking-widest text-xs">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom sidebar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-[#0d1b2a] border-t border-blue-900 p-2">
        {sidebarLinks.map((link) => {
          if (link.type && link.type !== user?.role) return null;
          return (
            <SidebarLink
              key={link.id}
              name={link.name}
              path={link.path}
              icon={link.icon}
              collapsed={true} // show only icons
            />
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
