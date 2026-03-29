import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Package,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getBadgeStats } from "../../utils/api";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [badges, setBadges] = useState({
    applications: 0,
    grievances: 0,
    queries: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Check if badges should be shown (from user settings or localStorage)
  const [showBadges, setShowBadges] = useState(() => {
    const saved = localStorage.getItem("showSidebarBadges");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      path: "/admin/applications",
      icon: FileText,
      label: "Applications",
      badgeKey: "applications",
    },
    {
      path: "/admin/grievances",
      icon: MessageSquare,
      label: "Grievances",
      badgeKey: "grievances",
    },
    { path: "/admin/schemes", icon: Package, label: "Schemes" },
    { path: "/admin/queries", icon: Mail, label: "Contact Queries" },
    // { path: "/admin/users", icon: Users, label: "Users" },
    // { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  // Fetch badge counts on mount
  useEffect(() => {
    fetchBadgeCounts();
    const handleStorageChange = () => {
      const saved = localStorage.getItem("showSidebarBadges");
      setShowBadges(saved !== null ? JSON.parse(saved) : true);
    };

    window.addEventListener("badgeToggleChange", handleStorageChange);

    return () => {
      window.removeEventListener("badgeToggleChange", handleStorageChange);
    };
  }, []);

  const fetchBadgeCounts = async () => {
    try {
      setRefreshing(true);
      const res = await getBadgeStats();
      if (res.success) {
        setBadges(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch badge counts:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchBadgeCounts();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? "85px" : "270px" }}
      transition={{ duration: 0.3 }}
      className="
        h-screen bg-gradient-to-b from-[var(--nav)] to-[var(--nav-hover)]
        text-white flex flex-col sticky top-0 shadow-[4px_0_20px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-[var(--btn)] rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg tracking-wide">SaralSeva</h2>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white/70" />
          )}
        </button>
      </div>

      {/* Back to Home */}
      <div className="px-3 py-2">
        <Link
          to="/"
          className="
            flex items-center gap-3 px-3 py-2 rounded-lg
            text-white/80 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {!isCollapsed && <span>Back to Site</span>}
        </Link>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-y border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--btn)] rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-white/70">{user?.email}</p>
            </div>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="
              mt-3 w-full flex items-center justify-center gap-2
              px-3 py-1.5 bg-white/10 hover:bg-white/20
              rounded-lg text-xs text-white/80 transition
              disabled:opacity-50"
            title="Refresh badge counts"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Badges"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto hide-scrollbar">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
            const hasBadge = showBadges && badgeCount > 0;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200 relative
                    ${
                      active
                        ? "bg-[var(--btn)] text-white shadow-md"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />

                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}

                  {/* Badge - Full Sidebar */}
                  {!isCollapsed && hasBadge && (
                    <span className="ml-auto bg-white text-[var(--nav)] text-xs px-2 py-0.5 rounded-full font-semibold">
                      {badgeCount}
                    </span>
                  )}

                  {/* Badge - Collapsed Sidebar (red dot) */}
                  {isCollapsed && hasBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link
          to="/admin/settings"
          className="
            flex items-center gap-3 px-3 py-2 rounded-lg
            text-white/80 hover:bg-white/10 hover:text-white
            transition"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          className="
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-red-200 hover:bg-red-500/20 hover:text-white
            transition"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
