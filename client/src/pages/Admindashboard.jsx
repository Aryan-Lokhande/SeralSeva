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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚙️</div>
          <div className="text-txt text-xl">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-txt mb-2">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-txt-dim text-lg">
                Manage applications, grievances, and schemes
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-2 rounded-custom">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white font-semibold">Admin</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-custom shadow-custom-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Total Applications</h3>
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalApplications}
            </div>
            <div className="text-blue-100 text-sm">
              {stats.submittedApplications} new • {stats.approvedApplications}{" "}
              approved
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-custom shadow-custom-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Approved</h3>
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.approvedApplications}
            </div>
            <div className="text-green-100 text-sm">
              {Math.round(
                (stats.approvedApplications / stats.totalApplications) * 100,
              ) || 0}
              % approval rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-custom shadow-custom-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Total Grievances</h3>
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalGrievances}
            </div>
            <div className="text-purple-100 text-sm">
              {stats.resolvedGrievances} resolved • {stats.inProgressGrievances}{" "}
              active
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-custom shadow-custom-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Active Schemes</h3>
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.activeSchemes}
            </div>
            <div className="text-orange-100 text-sm">
              {stats.totalSchemes} total schemes
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-bg-ter">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            {
              id: "applications",
              label: "Applications",
              icon: "📝",
              count: stats.submittedApplications,
            },
            {
              id: "grievances",
              label: "Grievances",
              icon: "💬",
              count: stats.inProgressGrievances,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "border-btn text-btn"
                  : "border-transparent text-txt-dim hover:text-txt"
              }`}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-btn text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
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
              <div className="bg-bg-sec rounded-custom shadow-custom-lg p-6">
                <h3 className="text-xl font-bold text-txt mb-4">
                  Recent Applications
                </h3>
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app._id} className="bg-bg-ter p-4 rounded-custom">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-txt font-medium">
                            {app.user?.name}
                          </div>
                          <div className="text-txt-dim text-sm">
                            {app.scheme?.title}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="text-txt-dim text-xs">
                        {formatDate(app.createdAt)} • {app.applicationId}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Grievances */}
              <div className="bg-bg-sec rounded-custom shadow-custom-lg p-6">
                <h3 className="text-xl font-bold text-txt mb-4">
                  Recent Grievances
                </h3>
                <div className="space-y-3">
                  {grievances.slice(0, 5).map((grv) => (
                    <div key={grv._id} className="bg-bg-ter p-4 rounded-custom">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-txt font-medium">
                            {grv.subject}
                          </div>
                          <div className="text-txt-dim text-sm">
                            {grv.category}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(grv.status)}`}
                        >
                          {grv.status}
                        </span>
                      </div>
                      <div className="text-txt-dim text-xs">
                        {formatDate(grv.createdAt)} • {grv.trackingId}
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
            className="bg-bg-sec rounded-custom shadow-custom-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-txt">All Applications</h3>
              <select
                value={applicationFilter}
                onChange={(e) => setApplicationFilter(e.target.value)}
                className="px-4 py-2 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Documents Required">Documents Required</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bg-ter">
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      Application ID
                    </th>
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      Scheme
                    </th>
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-txt-dim font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-b border-bg-ter hover:bg-bg-ter"
                    >
                      <td className="py-4 px-4">
                        <span className="text-txt font-mono text-sm">
                          {app.applicationId}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-txt">{app.user?.name}</div>
                        <div className="text-txt-dim text-xs">
                          {app.user?.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-txt">{app.scheme?.title}</div>
                        <div className="text-txt-dim text-xs">
                          {app.scheme?.code}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-txt-dim text-sm">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(app.status)}`}
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
                          className="px-3 py-1 text-sm bg-bg-primary text-txt rounded border border-bg-ter focus:border-btn focus:outline-none"
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
            className="bg-bg-sec rounded-custom shadow-custom-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-txt">All Grievances</h3>
              <select
                value={grievanceFilter}
                onChange={(e) => setGrievanceFilter(e.target.value)}
                className="px-4 py-2 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredGrievances.map((grv) => (
                <div key={grv._id} className="bg-bg-ter p-6 rounded-custom">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-txt font-mono text-sm font-semibold">
                          {grv.trackingId}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(grv.status)}`}
                        >
                          {grv.status}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">
                          {grv.category}
                        </span>
                      </div>
                      <h4 className="text-txt font-semibold text-lg mb-2">
                        {grv.subject}
                      </h4>
                      <p className="text-txt-dim text-sm mb-3">
                        {grv.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-txt-dim">
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
                  <div className="flex items-center space-x-3 pt-4 border-t border-bg-primary">
                    <select
                      value={grv.status}
                      onChange={(e) =>
                        handleUpdateGrievanceStatus(grv._id, e.target.value)
                      }
                      className="px-4 py-2 bg-bg-primary text-txt rounded border border-bg-ter focus:border-btn focus:outline-none"
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
                      className="text-btn hover:text-btn-hover font-medium text-sm"
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
