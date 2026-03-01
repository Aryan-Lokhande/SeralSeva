import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  MessageSquare,
  Package,
  Mail,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  getAllApplications,
  getAllGrievances,
  getSchemes,
  getAllContactQueries,
} from "../utils/api";
import toast from "react-hot-toast";

const StatCard = ({ label, value, sub, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="
      bg-gradient-to-br from-[var(--btn)]/80 to-[var(--btn-hover)]
      rounded-[var(--radius)] p-5 text-white
      shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.35)]"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="bg-white/20 p-2.5 rounded-[var(--radius)]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <TrendingUp className="w-4 h-4 text-white/60" />
    </div>

    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm font-medium text-white/90">{label}</div>
    {sub && <div className="text-xs text-white/70 mt-1">{sub}</div>}
  </motion.div>
);

const QuickAction = ({ label, sub, icon: Icon, path, navigate }) => (
  <motion.button
    whileHover={{ x: 4 }}
    onClick={() => navigate(path)}
    className="
      w-full flex items-center space-x-3 p-3
      bg-[var(--bg-ter)]
      hover:bg-[rgba(var(--shadow-rgb),0.15)]
      rounded-[var(--radius)]
      transition-colors group"
  >
    <div className="p-2 rounded-[var(--radius)] bg-[var(--btn)]/90">
      <Icon className="w-4 h-4 text-white" />
    </div>

    <div className="flex-1 text-left">
      <p className="text-sm font-semibold text-[var(--txt)]">{label}</p>
      <p className="text-xs text-[var(--txt-dim)]">{sub}</p>
    </div>

    <ArrowRight className="w-4 h-4 text-[var(--txt-disabled)] group-hover:text-[var(--btn)] transition-colors" />
  </motion.button>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [appsRes, grvsRes, schemesRes, queriesRes] = await Promise.all([
        getAllApplications(),
        getAllGrievances(),
        getSchemes(),
        getAllContactQueries(),
      ]);
      if (appsRes.success) {
        // console.log("Applications data:", appsRes.data);
        setApplications(appsRes.data);
      }
      if (grvsRes.success) setGrievances(grvsRes.data);
      if (schemesRes.success) setSchemes(schemesRes.data);
      if (queriesRes.success) setQueries(queriesRes.data);
    } catch (error) {
      toast.error("Failed to load admin data");
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalApps: applications.length,
    pendingApps: applications.filter((a) =>
      ["Submitted", "Under Review"].includes(a.status),
    ).length,
    approvedApps: applications.filter((a) => a.status === "Approved").length,
    rejectedApps: applications.filter((a) => a.status === "Rejected").length,
    openGrvs: grievances.filter((g) =>
      ["Submitted", "Under Review", "In Progress"].includes(g.status),
    ).length,
    resolvedGrvs: grievances.filter((g) => g.status === "Resolved").length,
    activeSchemes: schemes.filter((s) => s.isActive).length,
    openQueries: queries.filter((q) => q.status === "Open").length,
  };

  const appBadge = (s) =>
    ({
      Submitted: "bg-blue-100 text-blue-700",
      "Under Review": "bg-yellow-100 text-yellow-700",
      "Documents Required": "bg-orange-100 text-orange-700",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
    })[s] || "bg-gray-100 text-gray-600";
  const grvBadge = (s) =>
    ({
      Resolved: "bg-green-100 text-green-700",
      "In Progress": "bg-purple-100 text-purple-700",
    })[s] || "bg-blue-100 text-blue-700";
  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="text-center">
          <Settings className="w-14 h-14 mx-auto mb-4 text-[var(--btn)] animate-spin" />
          <p className="text-[var(--txt-dim)]">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-bg-primary min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--txt)]">
              Welcome back, {user?.name}
            </h1>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Here's what's happening with SaralSeva today
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="
              flex items-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border-2 border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)] transition
              transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Applications"
          value={stats.totalApps}
          sub={`${stats.pendingApps} pending`}
          icon={FileText}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          delay={0.05}
        />
        <StatCard
          label="Approved"
          value={stats.approvedApps}
          sub={`${stats.rejectedApps} rejected`}
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-green-500 to-green-700"
          delay={0.1}
        />
        <StatCard
          label="Open Grievances"
          value={stats.openGrvs}
          sub={`${stats.resolvedGrvs} resolved`}
          icon={MessageSquare}
          gradient="bg-gradient-to-br from-btn to-btn-hover"
          delay={0.15}
        />
        <StatCard
          label="Pending Queries"
          value={stats.openQueries}
          sub={`${schemes.length} total schemes`}
          icon={Mail}
          gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          delay={0.2}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Applications */}
          <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--nav)]">
              <h2 className="font-bold  text-white/90">
                Recent Applications
              </h2>
              <button
                onClick={() => navigate("/admin/applications")}
                className="text-sm  text-white/80 hover:text-white font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-[var(--txt-dim)]">
              {applications.slice(0, 5).length === 0 ? (
                <div className="py-10 text-center text-[var(--txt-dim)] text-sm">
                  No applications yet
                </div>
              ) : (
                applications.slice(0, 5).map((app, i) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center px-5 py-3.5 hover:bg-[var(--bg-ter)]  transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold  text-[var(--txt)] truncate">
                        {app.user?.name}
                      </p>
                      <p className="text-xs text-[var(--txt-dim)] truncate">
                        {app.scheme?.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${appBadge(app.status)}`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-[var(--txt)] whitespace-nowrap">
                        {fmt(app.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent Grievances */}
          <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--nav)]">
              <h2 className="font-bold  text-white/90">
                Recent Grievances
              </h2>
              <button
                onClick={() => navigate("/admin/grievances")}
                className="text-sm  text-white/80 hover:text-white font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-[var(--txt-dim)]">
              {grievances.slice(0, 5).length === 0 ? (
                <div className="py-10 text-center text-[var(--txt-dim)] text-sm">
                  No grievances yet
                </div>
              ) : (
                grievances.slice(0, 5).map((grv, i) => (
                  <motion.div
                    key={grv._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center px-5 py-3.5 hover:bg-[var(--bg-ter)]  transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold  text-[var(--txt)] truncate">
                        {grv.subject}
                      </p>
                      <p className="text-xs text-[var(--txt-dim)]">
                        {grv.category} · {grv.trackingId}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${grvBadge(grv.status)}`}
                      >
                        {grv.status}
                      </span>
                      <span className="text-xs text-[var(--txt)] whitespace-nowrap">
                        {fmt(grv.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-xl p-5">
            <h2 className="font-bold  text-[var(--txt)] mb-4">Overview</h2>
            <div className="space-y-3">
              {[
                {
                  label: "Approval Rate",
                  value: stats.totalApps
                    ? `${Math.round((stats.approvedApps / stats.totalApps) * 100)}%`
                    : "0%",
                  color: "text-green-600",
                },
                {
                  label: "Resolution Rate",
                  value: grievances.length
                    ? `${Math.round((stats.resolvedGrvs / grievances.length) * 100)}%`
                    : "0%",
                  color: "text-[var(--btn)]",
                },
                {
                  label: "Active Schemes",
                  value: stats.activeSchemes,
                  color: "text-[var(--btn)]",
                },
                {
                  label: "Total Grievances",
                  value: grievances.length,
                  color: "text-[var(--txt)]",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-[var(--txt-dim)] last:border-0"
                >
                  <span className="text-sm text-[var(--txt-dim)]">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-xl p-5">
            <h2 className="font-bold  text-[var(--txt)] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <QuickAction
                label="Applications"
                sub={`${stats.pendingApps} awaiting review`}
                icon={FileText}
                path="/admin/applications"
                navigate={navigate}
              />
              <QuickAction
                label="Grievances"
                sub={`${stats.openGrvs} open cases`}
                icon={MessageSquare}
                path="/admin/grievances"
                navigate={navigate}
              />
              <QuickAction
                label="Schemes"
                sub={`${stats.activeSchemes} active`}
                icon={Package}
                path="/admin/schemes"
                navigate={navigate}
              />
              <QuickAction
                label="Contact Queries"
                sub={`${stats.openQueries} unanswered`}
                icon={Mail}
                path="/admin/queries"
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
