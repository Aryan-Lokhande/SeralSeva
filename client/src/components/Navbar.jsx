import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/schemes", label: "Schemes" },
    { path: "/grievances", label: "Grievances" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="
      sticky top-0 z-50
      bg-gradient-to-r from-[var(--nav)] via-[var(--nav)] to-[var(--nav-hover)]
      border-b border-white/10
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo + Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link
              to="/"
              className="
              text-2xl font-extrabold tracking-wide text-white
              hover:text-[var(--bg-primary)] transition-colors duration-200 "
            >
              SaralSeva
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                  relative text-lg font-medium tracking-wide transition-all duration-200
                  ${
                    isActive(link.path)
                      ? "text-[var(--bg-primary)]"
                      : "text-white/80 hover:text-[var(--bg-ter)]"
                  }
                `}
                >
                  {link.label}

                  {/* underline active */}
                  {isActive(link.path) && (
                    <span
                      className="
                      absolute left-0 -bottom-[6px] w-full h-[2px]
                      bg-[var(--btn)] rounded-full"
                    />
                  )}
                </Link>
              ))}

              {/* Dashboard */}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`
                  relative text-lg font-medium tracking-wide
                  transition-all duration-200
                  ${
                    isActive("/dashboard")
                      ? "text-[var(--bg-primary)]"
                      : "text-white/80 hover:text-[var(--bg-ter)]"
                  }
                `}
                >
                  Dashboard
                  {isActive("/dashboard") && (
                    <span
                      className="
                      absolute left-0 -bottom-[6px] w-full h-[2px]
                      bg-[var(--btn)] rounded-full"
                    />
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Right - Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Welcome Text */}
                <span className="hidden sm:block text-white/80 text-sm">
                  Welcome,{" "}
                  <span className="text-white font-semibold">
                    {user?.name || "User"}
                  </span>
                </span>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="
                  px-5 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)]
                  text-white rounded-[var(--radius)]
                  font-semibold text-sm transition-all duration-200
                  shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.35)]"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login */}
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                    px-5 py-2 border border-white/40 text-white
                    hover:border-[var(--bg-primary)] hover:text-[var(--bg-ter)]
                    rounded-[var(--radius)] font-semibold text-sm
                    transition-all duration-200"
                  >
                    Login
                  </motion.button>
                </Link>

                {/* Signup */}
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                    px-5 py-2
                    bg-[var(--btn)]
                    hover:bg-[var(--btn-hover)]
                    text-white
                    rounded-[var(--radius)]
                    font-semibold text-sm
                    transition-all duration-200
                    shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.35)]
                  "
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
