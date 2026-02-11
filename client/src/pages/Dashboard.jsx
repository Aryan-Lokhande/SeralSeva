import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyApplications, getMyGrievances } from "../utils/api";
import toast from "react-hot-toast";

import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  MessageSquare,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeApplications: 0,
    approvedSchemes: 0,
    pendingReview: 0,
    openGrievances: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [appsResponse, grievancesResponse] = await Promise.all([
        getMyApplications(),
        getMyGrievances(),
      ]);

      if (appsResponse.success) {
        const apps = appsResponse.data;
        setApplications(apps);

        const approvedApps = apps.filter(
          (app) => app.status === "Approved",
        ).length;

        const pendingApps = apps.filter((app) =>
          ["Submitted", "Under Review"].includes(app.status),
        ).length;

        setStats((prev) => ({
          ...prev,
          activeApplications: apps.length,
          approvedSchemes: approvedApps,
          pendingReview: pendingApps,
        }));
      }

      if (grievancesResponse.success) {
        const grvs = grievancesResponse.data;
        setGrievances(grvs);

        const openGrvs = grvs.filter((grv) =>
          ["Submitted", "Under Review", "In Progress"].includes(grv.status),
        ).length;

        setStats((prev) => ({
          ...prev,
          openGrievances: openGrvs,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
      case "Resolved":
        return "bg-green-500/20 text-green-600";
      case "Submitted":
        return "bg-blue-500/20 text-blue-600";
      case "Under Review":
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-600";
      case "Documents Required":
        return "bg-orange-500/20 text-orange-600";
      case "Rejected":
      case "Closed":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--btn)] mx-auto mb-4"></div>
          <p className="text-[var(--txt)] text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-[var(--txt)] mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-[var(--txt-dim)] text-lg">
            Track your scheme applications and grievance updates in one place.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Active Applications",
              value: stats.activeApplications,
              icon: <FileText size={26} className="text-[var(--btn)]" />,
              desc: "Total submitted applications",
            },
            {
              title: "Approved Schemes",
              value: stats.approvedSchemes,
              icon: <CheckCircle2 size={26} className="text-[var(--btn)]" />,
              desc: "Successfully approved",
            },
            {
              title: "Pending Review",
              value: stats.pendingReview,
              icon: <Clock size={26} className="text-[var(--btn)]" />,
              desc: "Waiting for review",
            },
            {
              title: "Open Grievances",
              value: stats.openGrievances,
              icon: <AlertTriangle size={26} className="text-[var(--btn)]" />,
              desc: "Awaiting resolution",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                bg-[var(--bg-sec)]
                border border-[var(--bg-ter)]
                rounded-[var(--radius)]
                shadow-lg
                p-6
                hover:border-[var(--btn)]
                transition-all duration-200
              "
              style={{
                boxShadow: "0 8px 20px rgba(var(--shadow-rgb), 0.12)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[var(--txt-dim)] text-sm font-medium">
                    {item.title}
                  </p>
                  <h3 className="text-4xl font-bold text-[var(--txt)] mt-2">
                    {item.value}
                  </h3>
                </div>

                <div className="w-12 h-12 bg-[var(--btn)]/15 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              <p className="text-[var(--txt-dim)] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] shadow-lg p-8 mb-10"
          style={{
            boxShadow: "0 10px 25px rgba(var(--shadow-rgb), 0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--txt)]">
              Recent Applications
            </h2>

            <button
              onClick={() => navigate("/schemes")}
              className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors"
            >
              Apply New →
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--btn)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={30} className="text-[var(--btn)]" />
              </div>

              <h3 className="text-xl font-semibold text-[var(--txt)] mb-2">
                No Applications Yet
              </h3>

              <p className="text-[var(--txt-dim)] mb-6">
                Start applying for schemes to track your progress here.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/schemes")}
                className="bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white px-6 py-3 rounded-[var(--radius)] font-semibold transition-colors"
              >
                Browse Schemes
              </motion.button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-ter)]">
                  <tr>
                    {[
                      "Application ID",
                      "Scheme",
                      "Category",
                      "Status",
                      "Submitted",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--txt)] uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--bg-ter)]">
                  {applications.slice(0, 5).map((app, index) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-[var(--bg-ter)] transition-colors"
                    >
                      <td className="px-6 py-4 text-[var(--txt)] font-mono text-sm">
                        {app.applicationId}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-[var(--txt)] font-medium">
                          {app.scheme?.title}
                        </div>
                        <div className="text-[var(--txt-dim)] text-sm mt-1">
                          {app.scheme?.code}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--btn)]/15 text-[var(--btn)]">
                          {app.scheme?.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[var(--txt-dim)] text-sm">
                        {formatDate(app.submittedAt)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {applications.length > 5 && (
                <div className="mt-5 text-center">
                  <button className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors">
                    View All Applications →
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Recent Grievances */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] shadow-lg p-8 mb-10"
          style={{
            boxShadow: "0 10px 25px rgba(var(--shadow-rgb), 0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--txt)]">
              Recent Grievances
            </h2>

            <button
              onClick={() => navigate("/lodge-grievance")}
              className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors"
            >
              Lodge New →
            </button>
          </div>

          {grievances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--btn)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={30} className="text-[var(--btn)]" />
              </div>

              <h3 className="text-xl font-semibold text-[var(--txt)] mb-2">
                No Grievances Filed
              </h3>

              <p className="text-[var(--txt-dim)] mb-6">
                Lodge a grievance anytime and track its resolution.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/lodge-grievance")}
                className="bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white px-6 py-3 rounded-[var(--radius)] font-semibold transition-colors"
              >
                Lodge Grievance
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {grievances.slice(0, 5).map((grievance, index) => (
                <motion.div
                  key={grievance._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[var(--bg-ter)] p-6 rounded-[var(--radius)] hover:bg-[var(--bg-ter)]/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[var(--txt)] font-mono text-sm font-semibold">
                          {grievance.trackingId}
                        </span>

                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(grievance.status)}`}
                        >
                          {grievance.status}
                        </span>

                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-sec)] text-[var(--txt-dim)] border border-[var(--bg-ter)]">
                          {grievance.category}
                        </span>
                      </div>

                      <h3 className="text-[var(--txt)] font-semibold mb-2">
                        {grievance.subject}
                      </h3>

                      <p className="text-[var(--txt-dim)] text-sm leading-relaxed mb-3 line-clamp-2">
                        {grievance.description}
                      </p>

                      <p className="text-xs text-[var(--txt-dim)]">
                        Submitted: {formatDate(grievance.createdAt)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/track-grievance", {
                          state: { trackingId: grievance.trackingId },
                        })
                      }
                      className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium text-sm whitespace-nowrap transition-colors"
                    >
                      Track →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Browse Schemes",
                desc: "Explore government schemes and apply online.",
                icon: <Search size={26} className="text-[var(--btn)]" />,
                action: () => navigate("/schemes"),
              },
              {
                title: "Lodge Grievance",
                desc: "Register a complaint and track resolution progress.",
                icon: (
                  <MessageSquare
                    size={26}
                    className="text-[var(--btn)]"
                  />
                ),
                action: () => navigate("/lodge-grievance"),
              },
              {
                title: "Success Stories",
                desc: "Read inspiring beneficiary journeys across India.",
                icon: <Star size={26} className="text-[var(--btn)]" />,
                action: () => navigate("/success-stories"),
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={card.action}
                className="
                  bg-[var(--bg-sec)]
                  border border-[var(--bg-ter)]
                  p-6 rounded-[var(--radius)]
                  shadow-lg cursor-pointer
                  transition-all duration-200
                  hover:border-[var(--btn)]
                "
                style={{
                  boxShadow: "0 10px 25px rgba(var(--shadow-rgb), 0.12)",
                }}
              >
                <div className="w-14 h-14 bg-[var(--btn)]/15 rounded-full flex items-center justify-center mb-5">
                  {card.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--txt)] mb-2">
                  {card.title}
                </h3>

                <p className="text-[var(--txt-dim)] text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
