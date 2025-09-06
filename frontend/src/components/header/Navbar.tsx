import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
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
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="w-full shadow-md sticky top-0 z-50 bg-[#0d1b2a] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Edu<span className="text-blue-400">Hub</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-lg border border-blue-300 text-white hover:bg-blue-700 transition"
              >
                Logout
              </button>
              <Link
                to="/dashboard/my-profile"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu className="h-7 w-7 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0d1b2a] text-gray-200">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-gray-100">
                  Edu<span className="text-blue-400">Hub</span>
                </SheetTitle>
              </SheetHeader>

              <ul className="mt-6 space-y-4 font-medium flex flex-col items-center">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <SheetClose asChild>
                      <Link
                        to={item.href}
                        className="block hover:text-blue-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 w-[85%] mx-auto">
                {isLoggedIn ? (
                  <>
                    <SheetClose asChild>
                      <button
                        onClick={() => logout()}
                        className="w-full px-4 py-2 rounded-lg border border-blue-300 text-white hover:bg-blue-700 transition"
                      >
                        Logout
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/dashboard/my-profile"
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-center"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="w-full px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition text-center"
                      >
                        Sign In
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/signup"
                        className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-center"
                      >
                        Sign Up
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
