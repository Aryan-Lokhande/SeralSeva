import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  Megaphone,
  Eye,
  Search,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!!isAuthenticated) return null;

  const stats = [
    {
      icon: FileText,
      label: "Active Applications",
      value: "3",
    },
    {
      icon: CheckCircle,
      label: "Approved Schemes",
      value: "2",
    },
    {
      icon: Clock,
      label: "Pending Review",
      value: "1",
    },
    {
      icon: Megaphone,
      label: "Open Grievances",
      value: "0",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      scheme: "Pradhan Mantri Awas Yojana",
      appliedDate: "2026-01-15",
      status: "Under Review",
      statusType: "pending",
    },
    {
      id: 2,
      scheme: "Ayushman Bharat - PMJAY",
      appliedDate: "2026-01-10",
      status: "Approved",
      statusType: "approved",
    },
    {
      id: 3,
      scheme: "PM-KISAN",
      appliedDate: "2026-01-05",
      status: "Documents Required",
      statusType: "rejected",
    },
  ];

  const statusStyles = {
    approved:
      "bg-[rgba(var(--shadow-rgb),0.15)] text-[var(--btn)] border border-[var(--btn)]",
    pending:
      "bg-[rgba(var(--shadow-rgb),0.1)] text-[var(--txt)]/80 border border-[var(--bg-ter)]",
    rejected:
      "bg-[rgba(var(--shadow-rgb),0.2)] text-[var(--btn-hover)] border border-[var(--btn-hover)]",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <section className="bg-gradient-to-r from-[var(--btn)] to-[var(--btn-hover)]/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-white/90 mt-2">
              Here’s an overview of your applications and grievances
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="
                  bg-[var(--bg-sec)] border border-[var(--bg-ter)]
                  rounded-[var(--radius)] p-6
                  shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.25)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--txt-dim)]">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-[var(--txt)] mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <Icon size={36} className="text-[var(--btn)] opacity-90" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
            Recent Applications
          </h2>

          <div className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] overflow-hidden shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-ter)]">
                  <tr>
                    {["Scheme", "Applied Date", "Status", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-sm font-semibold text-[var(--txt)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bg-ter)]">
                  {recentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-[var(--bg-ter)] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[var(--txt)]">
                        {app.scheme}
                      </td>
                      <td className="px-6 py-4 text-[var(--txt-dim)]">
                        {new Date(app.appliedDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[app.statusType]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="inline-flex items-center gap-2 text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors">
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Browse Schemes",
                desc: "Explore available government schemes",
                icon: Search,
                onClick: () => navigate("/schemes"),
              },
              {
                label: "Lodge Grievance",
                desc: "Register a complaint or issue",
                icon: AlertCircle,
                onClick: () => navigate("/grievances"),
              },
              {
                label: "My Documents",
                desc: "View and manage uploaded documents",
                icon: FolderOpen,
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="
                    bg-[var(--bg-sec)] border border-[var(--bg-ter)]
                    hover:border-[var(--btn)] rounded-[var(--radius)]
                    p-6 text-left transition-all
                    shadow-[0_6px_20px_rgba(var(--shadow-rgb),0.2)]"
                >
                  <Icon size={32} className="text-[var(--btn)] mb-4" />
                  <h3 className="text-lg font-bold text-[var(--txt)] mb-1">
                    {action.label}
                  </h3>
                  <p className="text-sm text-[var(--txt-dim)]">{action.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;
