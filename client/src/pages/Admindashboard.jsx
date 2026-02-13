import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getAllApplications,
  getAllGrievances,
  updateApplicationStatus,
  updateGrievanceStatus,
  getSchemeStats,
} from "../utils/api";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Settings,
  FileText,
  CheckCircle2,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, applications, grievances
  const [stats, setStats] = useState({
    totalApplications: 0,
    submittedApplications: 0,
    underReviewApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalGrievances: 0,
    submittedGrievances: 0,
    inProgressGrievances: 0,
    resolvedGrievances: 0,
    totalSchemes: 0,
    activeSchemes: 0,
  });

  // Filters
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [grievanceFilter, setGrievanceFilter] = useState("all");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [appsResponse, grievancesResponse, schemesResponse] =
        await Promise.all([
          getAllApplications(),
          getAllGrievances(),
          getSchemeStats(),
        ]);

      if (appsResponse.success) {
        const apps = appsResponse.data;
        setApplications(apps);

        // Calculate application stats
        setStats((prev) => ({
          ...prev,
          totalApplications: apps.length,
          submittedApplications: apps.filter((a) => a.status === "Submitted")
            .length,
          underReviewApplications: apps.filter(
            (a) => a.status === "Under Review",
          ).length,
          approvedApplications: apps.filter((a) => a.status === "Approved")
            .length,
          rejectedApplications: apps.filter((a) => a.status === "Rejected")
            .length,
        }));
      }

      if (grievancesResponse.success) {
        const grvs = grievancesResponse.data;
        setGrievances(grvs);

        // Calculate grievance stats
        setStats((prev) => ({
          ...prev,
          totalGrievances: grvs.length,
          submittedGrievances: grvs.filter((g) => g.status === "Submitted")
            .length,
          inProgressGrievances: grvs.filter((g) => g.status === "In Progress")
            .length,
          resolvedGrievances: grvs.filter((g) => g.status === "Resolved")
            .length,
        }));
      }

      if (schemesResponse.success) {
        setStats((prev) => ({
          ...prev,
          totalSchemes: schemesResponse.data.totalSchemes || 0,
          activeSchemes: schemesResponse.data.activeSchemes || 0,
        }));
      }
    } catch (error) {
      toast.error("Failed to load admin data");
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId,
    newStatus,
    remarks = "",
  ) => {
    try {
      const response = await updateApplicationStatus(
        applicationId,
        newStatus,
        remarks,
      );
      if (response.success) {
        toast.success("Application status updated successfully");
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.message || "Failed to update application status");
    }
  };

  const handleUpdateGrievanceStatus = async (
    grievanceId,
    newStatus,
    responseText = "",
  ) => {
    try {
      const response = await updateGrievanceStatus(
        grievanceId,
        newStatus,
        responseText,
      );
      if (response.success) {
        toast.success("Grievance status updated successfully");
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.message || "Failed to update grievance status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Submitted: "bg-blue-500/20 text-blue-400 border-blue-500",
      "Under Review": "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      "Documents Required":
        "bg-orange-500/20 text-orange-400 border-orange-500",
      Approved: "bg-green-500/20 text-green-400 border-green-500",
      Rejected: "bg-red-500/20 text-red-400 border-red-500",
      "In Progress": "bg-purple-500/20 text-purple-400 border-purple-500",
      Resolved: "bg-green-500/20 text-green-400 border-green-500",
      Closed: "bg-gray-500/20 text-gray-400 border-gray-500",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredApplications =
    applicationFilter === "all"
      ? applications
      : applications.filter((app) => app.status === applicationFilter);

  const filteredGrievances =
    grievanceFilter === "all"
      ? grievances
      : grievances.filter((grv) => grv.status === grievanceFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Settings className="w-14 h-14 mx-auto mb-4 text-[var(--btn)] animate-spin" />
          <div className="text-[var(--txt)] text-xl font-medium">
            Loading admin dashboard...
          </div>
          <p className="text-[var(--txt-dim)] text-sm mt-2">
            Please wait while we fetch data
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--txt)] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-[var(--txt-dim)] text-lg font-medium">
                Manage applications, grievances, and schemes
              </p>
            </div>

            <div
              className="
              flex items-center gap-2
              bg-gradient-to-r from-[var(--btn)] to-[var(--btn-hover)]
              px-5 py-2 rounded-[var(--radius)]
              shadow-[0_10px_25px_rgba(var(--shadow-rgb),0.25)]
            "
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="text-white font-semibold tracking-wide">
                ADMIN PANEL
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Applications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="
            bg-[var(--accent)]/90 border border-[var(--bg-ter)]
            rounded-[var(--radius)] p-6 
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--txt)] text-lg font-bold">
                Total Applications
              </h3>
              <div className="bg-[var(--btn)]/15 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-[var(--btn)]" />
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--txt)] mb-2">
              {stats.totalApplications}
            </div>

            <div className="text-[var(--txt-dim)]/80 text-sm">
              {stats.submittedApplications} new • {stats.approvedApplications}{" "}
              approved
            </div>
          </motion.div>

          {/* Approved */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
            bg-[var(--accent)]/90 border border-[var(--bg-ter)]
            rounded-[var(--radius)] p-6 
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--txt)] text-lg font-bold">Approved</h3>
              <div className="bg-green-500/15 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--txt)] mb-2">
              {stats.approvedApplications}
            </div>

            <div className="text-[var(--txt-dim)]/80 text-sm">
              {Math.round(
                (stats.approvedApplications / stats.totalApplications) * 100,
              ) || 0}
              % approval rate
            </div>
          </motion.div>

          {/* Total Grievances */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="
            bg-[var(--accent)]/90 border border-[var(--bg-ter)]
            rounded-[var(--radius)] p-6 
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--txt)] text-lg font-bold">
                Total Grievances
              </h3>
              <div className="bg-orange-500/15 p-2 rounded-lg">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--txt)] mb-2">
              {stats.totalGrievances}
            </div>

            <div className="text-[var(--txt-dim)]/80 text-sm">
              {stats.resolvedGrievances} resolved • {stats.inProgressGrievances}{" "}
              active
            </div>
          </motion.div>

          {/* Active Schemes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="
            bg-[var(--accent)]/90 border border-[var(--bg-ter)]
            rounded-[var(--radius)] p-6 
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--txt)] text-lg font-bold">
                Active Schemes
              </h3>
              <div className="bg-[var(--btn)]/15 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-[var(--btn)]" />
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--txt)] mb-2">
              {stats.activeSchemes}
            </div>

            <div className="text-[var(--txt-dim)]/80 text-sm">
              {stats.totalSchemes} total schemes
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-[var(--bg-ter)]">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            {
              id: "applications",
              label: "Applications",
              icon: FileText,
              count: stats.submittedApplications,
            },
            {
              id: "grievances",
              label: "Grievances",
              icon: MessageCircle,
              count: stats.inProgressGrievances,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                flex items-center gap-2 px-6 py-3 font-semibold
                border-b-2 transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "border-[var(--btn)] text-[var(--btn)]"
                    : "border-transparent text-[var(--txt-dim)] hover:text-[var(--txt)]"
                }
              `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}

                {tab.count > 0 && (
                  <span
                    className="
                    ml-2 bg-[var(--btn)]
                    text-white text-xs px-2 py-1 rounded-full
                  "
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div
                className="
                bg-[var(--bg-primary)] border border-[var(--bg-ter)]
                rounded-[var(--radius)] p-6
                shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
              >
                <h3 className="text-2xl font-bold text-[var(--txt)] mb-5">
                  Recent Applications
                </h3>

                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app._id}
                      className="
                      bg-[var(--bg-sec)] border border-[var(--bg-primary)]
                      rounded-[var(--radius)] p-4 transition-all duration-200
                      hover:shadow-[0_10px_25px_rgba(var(--shadow-rgb),0.12)]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[var(--txt)] text-lg font-bold">
                            {app.user?.name}
                          </div>
                          <div className="text-[var(--txt-dim)] text-sm">
                            {app.scheme?.title}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            app.status,
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="text-[var(--txt-dim)] text-xs">
                        {formatDate(app.createdAt)} •{" "}
                        <span className="font-mono text-[var(--txt)]">
                          {app.applicationId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Grievances */}
              <div
                className="
                bg-[var(--bg-primary)] border border-[var(--bg-ter)] rounded-[var(--radius)] 
                p-6 shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]"
              >
                <h3 className="text-2xl font-bold text-[var(--txt)] mb-5">
                  Recent Grievances
                </h3>

                <div className="space-y-4">
                  {grievances.slice(0, 5).map((grv) => (
                    <div
                      key={grv._id}
                      className="
                      bg-[var(--bg-sec)] border border-[var(--bg-primary)] rounded-[var(--radius)]
                      p-4 hover:shadow-[0_10px_25px_rgba(var(--shadow-rgb),0.12)]
                      transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[var(--txt)] text-lg font-bold">
                            {grv.subject}
                          </div>
                          <div className="text-[var(--txt-dim)] text-sm">
                            {grv.category}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            grv.status,
                          )}`}
                        >
                          {grv.status}
                        </span>
                      </div>

                      <div className="text-[var(--txt-dim)] text-xs">
                        {formatDate(grv.createdAt)} •{" "}
                        <span className="font-mono text-[var(--txt)]">
                          {grv.trackingId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
            bg-[var(--bg-primary)]
            border border-[var(--bg-ter)]
            rounded-[var(--radius)]
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]
            p-6
          "
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-[var(--txt)]">
                All Applications
              </h3>

              <select
                value={applicationFilter}
                onChange={(e) => setApplicationFilter(e.target.value)}
                className="
                px-4 py-2
                bg-[var(--bg-ter)]
                text-[var(--txt)]
                rounded-[var(--radius)]
                border border-[var(--bg-primary)]
                focus:border-[var(--btn)]
                focus:outline-none
              "
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Documents Required">Documents Required</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--bg-ter)]">
              <table className="w-full">
                <thead className="bg-[var(--bg-ter)]">
                  <tr>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      Application ID
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      Scheme
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--txt-dim)] font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--bg-primary)]">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app._id}
                      className="
                      hover:bg-[var(--bg-ter)]/70
                      transition-colors duration-200
                    "
                    >
                      <td className="py-4 px-4">
                        <span className="text-[var(--txt)] font-mono text-sm">
                          {app.applicationId}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-[var(--txt)] font-medium">
                          {app.user?.name}
                        </div>
                        <div className="text-[var(--txt-dim)] text-xs">
                          {app.user?.email}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-[var(--txt)] font-medium">
                          {app.scheme?.title}
                        </div>
                        <div className="text-[var(--txt-dim)] text-xs">
                          {app.scheme?.code}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[var(--txt-dim)] text-sm">
                        {formatDate(app.createdAt)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            app.status,
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateApplicationStatus(
                              app._id,
                              e.target.value,
                            )
                          }
                          className="
                          px-3 py-2 text-sm
                          bg-[var(--bg-ter)]
                          text-[var(--txt)]
                          rounded-[var(--radius)]
                          border border-[var(--bg-primary)]
                          focus:border-[var(--btn)]
                          focus:outline-none
                        "
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Documents Required">
                            Documents Required
                          </option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Grievances Tab */}
        {activeTab === "grievances" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
            bg-[var(--bg-primary)]
            border border-[var(--bg-ter)]
            rounded-[var(--radius)]
            shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.12)]
            p-6
          "
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-[var(--txt)]">
                All Grievances
              </h3>

              <select
                value={grievanceFilter}
                onChange={(e) => setGrievanceFilter(e.target.value)}
                className="
                px-4 py-2
                bg-[var(--bg-ter)]
                text-[var(--txt)]
                rounded-[var(--radius)]
                border border-[var(--bg-primary)]
                focus:border-[var(--btn)]
                focus:outline-none
              "
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="space-y-5">
              {filteredGrievances.map((grv) => (
                <div
                  key={grv._id}
                  className="
                  bg-[var(--bg-sec)]
                  border border-[var(--bg-primary)]
                  p-6 rounded-[var(--radius)]
                  hover:shadow-[0_12px_28px_rgba(var(--shadow-rgb),0.12)]
                  transition-all duration-200
                "
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[var(--txt)] font-mono text-sm font-semibold">
                          {grv.trackingId}
                        </span>

                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            grv.status,
                          )}`}
                        >
                          {grv.status}
                        </span>

                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--btn)]/15 text-[var(--btn)]">
                          {grv.category}
                        </span>
                      </div>

                      <h4 className="text-[var(--txt)] text-lg font-bold text-lg mb-2">
                        {grv.subject}
                      </h4>

                      <p className="text-[var(--txt-dim)] text-sm leading-relaxed">
                        {grv.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--txt-dim)] mt-3">
                        <span>Submitted: {formatDate(grv.createdAt)}</span>
                        {grv.personalInfo?.fullName && (
                          <>
                            <span>•</span>
                            <span>By: {grv.personalInfo.fullName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 pt-4 border-t border-[var(--bg-primary)]">
                    <select
                      value={grv.status}
                      onChange={(e) =>
                        handleUpdateGrievanceStatus(grv._id, e.target.value)
                      }
                      className="
                      px-4 py-2
                      bg-[var(--bg-sec)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-primary)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                    "
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      onClick={() =>
                        navigate("/track-grievance", {
                          state: { trackingId: grv.trackingId },
                        })
                      }
                      className="
                      text-[var(--btn)]
                      hover:text-[var(--btn-hover)]
                      font-semibold text-sm
                      transition-colors duration-200
                    "
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
