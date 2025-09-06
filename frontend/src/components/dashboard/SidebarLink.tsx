import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
        "hover:bg-blue-900 hover:text-blue-300",
        isActive ? "bg-blue-700 text-white" : "text-gray-300",
        collapsed && "justify-center px-3"
      )}
    >
      <Icon size={20} />
      {!collapsed && <span>{name}</span>}
    </Link>
  );
};

export default SidebarLink;
