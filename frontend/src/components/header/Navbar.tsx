import { useAuthStore } from "@/store/authStore";
import { NavLink } from "react-router-dom";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { token, logout } = useAuthStore();
  const isLoggedIn = !!token;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto h-16 sm:h-20 glass-dark rounded-[1.5rem] sm:rounded-full border border-white/10 px-6 sm:px-10 flex items-center justify-between shadow-2xl relative pointer-events-auto overflow-hidden">

        {/* Background Subtle Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-blue-500/5 blur-3xl -z-10" />

        {/* Logo */}
        <NavLink to="/" className="text-xl sm:text-2xl font-black tracking-tighter group flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            E
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-white">Edu</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Hub</span>
          </div>
        </NavLink>

        {/* Desktop Nav (Tabs Style) */}
        <div className="hidden lg:flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `px-6 py-2 rounded-xl text-sm font-bold transition-all duration-500 ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut size={18} />
                Logout
              </button>
              <NavLink
                to="/dashboard/my-profile"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#050816] text-sm font-black hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl active:scale-95"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-500 transition-all duration-500 shadow-lg shadow-blue-600/20 active:scale-95 border border-blue-400/20"
              >
                Sign Up Free
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <Menu className="h-6 w-6 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#050816]/98 backdrop-blur-2xl border-white/5 text-gray-100 p-8">
              <SheetHeader className="mb-10">
                <SheetTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg">
                    E
                  </div>
                  Edu<span className="text-blue-400 font-black">Hub</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full justify-between pb-10">
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <SheetClose asChild>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `flex items-center h-14 px-6 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`
                          }
                        >
                          {item.name}
                        </NavLink>
                      </SheetClose>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 mt-auto">
                  {isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <NavLink
                          to="/dashboard/my-profile"
                          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-white text-[#050816] font-black text-lg"
                        >
                          <LayoutDashboard /> Dashboard
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={() => logout()}
                          className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl border border-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          <LogOut /> Logout
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <NavLink
                          to="/signup"
                          className="flex items-center justify-center h-14 rounded-2xl bg-blue-600 text-white font-black text-lg"
                        >
                          Create Account
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink
                          to="/login"
                          className="flex items-center justify-center h-14 rounded-2xl border border-white/10 text-gray-300 font-bold hover:text-white"
                        >
                          Sign In
                        </NavLink>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
