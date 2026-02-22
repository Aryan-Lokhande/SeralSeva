import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "../../utils/api";
import ApproveRejectModal from "../../components/admin/ApproveRejectModal";
import ViewDetailsModal from "../../components/admin/ViewDetailsModal";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const StatusBadge = ({ status }) => {
  const styles = {
    Submitted: "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    "Documents Required": "bg-orange-100 text-orange-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalType, setModalType] = useState("approve");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getAllApplications();
      if (res.success) setApplications(res.data);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (app, type) => {
    setSelectedApp(app);
    setModalType(type);
    setShowApproveModal(true);
  };

  const handleModalSubmit = async ({ status, remarks }) => {
    try {
      const res = await updateApplicationStatus(
        selectedApp._id,
        status,
        remarks,
      );
      if (res.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        fetchApplications();
        setShowApproveModal(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Filter & search
  const filtered = applications.filter((app) => {
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      app.applicationId?.toLowerCase().includes(q) ||
      app.user?.name?.toLowerCase().includes(q) ||
      app.user?.email?.toLowerCase().includes(q) ||
      app.scheme?.title?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "Submitted").length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    approved: applications.filter((a) => a.status === "Approved").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 bg-bg-primary min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt">
              Applications Management
            </h1>
            <p className="text-txt-dim text-sm mt-1">
              Review, approve or reject scheme applications
            </p>
          </div>
          <button
            onClick={fetchApplications}
            className="
              flex items-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border-2 border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)] transition
              transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: "New",
            value: stats.submitted,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Under Review",
            value: stats.underReview,
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            label: "Approved",
            value: stats.approved,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            color: "bg-red-100 text-red-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-sec border border-[var(--border)] rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-txt">{stat.value}</div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.color}`}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-bg-sec border border-[var(--border)] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-dim" />
          <input
            type="text"
            placeholder="Search by ID, name, email, scheme..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-bg-ter border border-[var(--border)] rounded-lg text-sm text-txt placeholder-txt-disabled focus:outline-none focus:border-btn"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-txt-dim" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-bg-ter border border-[var(--border)] rounded-lg text-sm text-txt focus:outline-none focus:border-btn"
          >
            <option value="all">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Documents Required">Documents Required</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-sm text-txt-dim ml-auto">
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
      <div className="bg-bg-sec border border-[var(--border)] rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-btn animate-spin" />
            <span className="ml-3 text-txt-dim">Loading applications...</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-txt-disabled mx-auto mb-3" />
            <p className="text-txt font-medium">No applications found</p>
            <p className="text-txt-dim text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-bg-ter">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    App ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    Scheme
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-txt-dim uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginated.map((app, i) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-bg-ter transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-txt">
                        {app.applicationId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-txt text-sm">
                        {app.user?.name}
                      </div>
                      <div className="text-xs text-txt-dim">
                        {app.user?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-txt">
                        {app.scheme?.title}
                      </div>
                      <div className="text-xs text-txt-dim">
                        {app.scheme?.category}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-txt-dim whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status !== "Approved" &&
                          app.status !== "Rejected" && (
                            <>
                              <button
                                onClick={() => handleAction(app, "approve")}
                                className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAction(app, "reject")}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
        />
      </div>

      {/* Modals */}
      {showApproveModal && (
        <ApproveRejectModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          application={selectedApp}
          onSubmit={handleModalSubmit}
          type={modalType}
        />
      )}
      {showDetailsModal && (
        <ViewDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          data={selectedApp}
          type="application"
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;
