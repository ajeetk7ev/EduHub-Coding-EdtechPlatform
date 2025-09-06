import SidebarLink from "./SidebarLink";
import { useAuthStore } from "@/store/authStore";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarLinks } from "@/data/dashboard-link";
import { useDashboardCollapsedStore } from "@/store/dashboardCollapsedStore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const { collapsed, setCollapsed } = useDashboardCollapsedStore();
  const navigate = useNavigate();
 

  const handleLogout = () => {
      logout();
      navigate('/');
  }

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={`hidden sm:flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } h-screen bg-[#0d1b2a] border-r border-blue-900 transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-blue-800">
          {!collapsed && (
            <h1 className="text-2xl font-bold text-white">
              Edu<span className="text-blue-400">Hub</span>
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-400 hover:bg-blue-800 hover:text-white transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
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
        <div className="p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
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
