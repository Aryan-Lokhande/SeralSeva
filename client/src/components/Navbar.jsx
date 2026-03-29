import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    { path: "/suggest", label: "Suggest Scheme" },
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
        backdrop-blur-md
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-extrabold text-white"
            >
              YojnaSaathi
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                relative text-lg font-medium transition-all duration-200
                ${
                  isActive(link.path)
                    ? "text-[var(--bg-primary)]"
                    : "text-white/80 hover:text-[var(--bg-ter)]"
                }
              `}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute left-0 -bottom-[6px] w-full h-[2px] bg-[var(--btn)]" />
                  )}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`
                relative text-lg font-medium
                ${
                  isActive("/dashboard")
                    ? "text-[var(--bg-primary)]"
                    : "text-white/80 hover:text-[var(--bg-ter)]"
                }
              `}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-white/80 text-sm">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="
                      px-4 py-2 bg-[var(--btn)]
                      hover:bg-[var(--btn-hover)]
                      text-white rounded-[var(--radius)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-4 py-2 border border-white/40 text-white rounded-[var(--radius)]">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-4 py-2 bg-[var(--btn)] text-white rounded-[var(--radius)]">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className=" md:hidden px-4 pb-6 bg-[var(--bg-sec)] border-t border-[var(--bg-ter)]">
          <div className="flex flex-col gap-4 mt-4">
            {/* Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-[var(--txt)] hover:text-[var(--btn)] font-medium"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-[var(--txt)]"
              >
                Dashboard
              </Link>
            )}

            {/* Auth */}
            <div className="pt-4 border-t border-[var(--bg-ter)]">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="
                    w-full py-2 bg-[var(--btn)]
                    text-white rounded-[var(--radius)]"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login">
                    <button className="w-full py-2 border border-[var(--btn)] text-[var(--btn)] rounded-[var(--radius)]">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="w-full py-2 bg-[var(--btn)] text-white rounded-[var(--radius)]">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
