import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SidebarLinkProps = {
  name: string;
  path: string;
  icon: React.ElementType;
  collapsed?: boolean;
};

const SidebarLink = ({ name, path, icon: Icon, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          : "text-gray-400 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0 h-14 w-14 mx-auto"
      )}
    >
      <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "scale-110")} />
      {!collapsed && <span className="font-bold text-sm tracking-tight">{name}</span>}

      {/* Active Indicator */}
      {isActive && !collapsed && (
        <motion.div
          layoutId="active-nav"
          className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1"
        />
      )}
    </Link>
  );
};

export default SidebarLink;
