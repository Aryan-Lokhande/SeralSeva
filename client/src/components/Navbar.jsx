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
    bg-[var(--bg-sec)]
    border-b border-[var(--bg-ter)]
    shadow-[0_6px_20px_rgba(var(--shadow-rgb),0.15)]
    sticky top-0 z-50
  "
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">

      {/* Left - Navigation Links */}
      <div className="flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              text-lg font-medium transition-all duration-200
              ${
                isActive(link.path)
                  ? "text-[var(--btn)] border-b-2 border-[var(--btn)]"
                  : "text-[var(--txt)] hover:text-[var(--btn)]"
              }
            `}
          >
            {link.label}
          </Link>
        ))}

        {/* Dashboard (Authenticated Only) */}
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className={`
              text-lg font-medium transition-all duration-200
              ${
                isActive("/dashboard")
                  ? "text-[var(--btn)] border-b-2 border-[var(--btn)]"
                  : "text-[var(--txt)] hover:text-[var(--btn)]"
              }
            `}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Right - Auth Buttons */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-[var(--txt-dim)]">
              Welcome,{" "}
              <span className="text-[var(--txt)] font-medium">
                {user?.name || "User"}
              </span>
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="
                px-6 py-2
                bg-[var(--btn)]
                hover:bg-[var(--btn-hover)]
                text-white
                rounded-[var(--radius)]
                font-medium
                transition-all duration-200
                shadow-[0_4px_14px_rgba(var(--shadow-rgb),0.35)]
              "
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">

            {/* Login */}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-6 py-2
                  bg-transparent
                  border-2 border-[var(--btn)]
                  text-[var(--btn)]
                  hover:bg-[var(--btn)]
                  hover:text-white
                  rounded-[var(--radius)]
                  font-medium
                  transition-all duration-200
                "
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
                  px-6 py-2
                  bg-[var(--btn)]
                  hover:bg-[var(--btn-hover)]
                  text-white
                  rounded-[var(--radius)]
                  font-medium
                  transition-all duration-200
                  shadow-[0_4px_14px_rgba(var(--shadow-rgb),0.35)]
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
