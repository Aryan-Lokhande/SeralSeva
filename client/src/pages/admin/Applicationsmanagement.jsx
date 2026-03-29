import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Check, X, RefreshCw } from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "../../utils/api";
import ApproveRejectModal from "../../components/admin/ApproveRejectModal";
import ViewDetailsModal from "../../components/admin/ViewDetailsModal";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const StatusBadge = ({ status }) => {
  const styles = {
    Submitted: "bg-blue-100 text-blue-700",
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
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--txt)] tracking-wide">
              Applications Management
            </h1>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Review, approve or reject scheme applications
            </p>
          </div>

          <button
            onClick={fetchApplications}
            className="
              w-full sm:w-auto
              flex items-center justify-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)]
              transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "New", value: stats.submitted },
          { label: "Approved", value: stats.approved },
          { label: "Rejected", value: stats.rejected },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
              bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)]
              border border-[var(--bg-ter)] rounded-[var(--radius)]
              p-3 sm:p-4
              text-center
              shadow-[0_6px_20px_rgba(var(--shadow-rgb),0.35)]
      "
          >
            <div className="text-2xl sm:text-3xl font-bold text-white pb-1 sm:pb-2">
              {stat.value}
            </div>

            <span
              className="
          text-[10px] sm:text-xs
          font-semibold
          px-2 py-0.5
          rounded-full
          bg-white/20
          text-white/80
        "
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div
        className="
    bg-[var(--bg-sec)] border border-[var(--txt-dim)]
    rounded-[var(--radius)] p-4 mb-4
    flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4
  "
      >
        {" "}
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--txt-dim)]" />
          <input
            type="text"
            placeholder="Search by ID, name, email, scheme..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="
            w-full pl-9 pr-4 py-2 bg-[var(--bg-ter)]
            border border-[var(--txt-dim)] rounded-[var(--radius)]
            text-sm text-[var(--txt)] placeholder-[var(--txt-dim)]
            focus:outline-none focus:border-[var(--btn)]"
          />
        </div>
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--txt-dim)]" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="
            px-3 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)]
            rounded-[var(--radius)] text-sm text-[var(--txt)]
            focus:outline-none focus:border-[var(--btn)]"
          >
            <option value="all">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Documents Required">Documents Required</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <span className="text-sm text-[var(--txt-dim)] ml-auto">
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-[var(--radius)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[var(--btn)] animate-spin" />
            <span className="ml-3 text-[var(--txt-dim)]">
              Loading applications...
            </span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-[var(--txt-dim)]/80 mx-auto mb-3" />
            <p className="text-[var(--txt)] font-medium">
              No applications found
            </p>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--bg-ter)] bg-[var(--nav)]">
                  {[
                    "App ID",
                    "Applicant",
                    "Scheme",
                    "Date",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="
                        text-left py-3 px-4 text-xs font-semibold
                        text-white/80 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--bg-ter)]">
                {paginated.map((app, i) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-[var(--bg-ter)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-[var(--txt)]">
                        {app.applicationId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--txt)] text-sm">
                        {app.user?.name}
                      </div>
                      <div className="text-xs text-[var(--txt-dim)]">
                        {app.user?.email}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-sm text-[var(--txt)]">
                        {app.scheme?.title}
                      </div>
                      <div className="text-xs text-[var(--txt-dim)]">
                        {app.scheme?.category}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm text-[var(--txt-dim)] whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {/* View */}
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailsModal(true);
                          }}
                          className="
                          p-1.5 rounded-[var(--radius)]
                          hover:bg-[rgba(var(--shadow-rgb),0.15)]
                          text-[var(--btn)] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve / Reject */}
                        {app.status !== "Approved" &&
                          app.status !== "Rejected" && (
                            <>
                              <button
                                onClick={() => handleAction(app, "approve")}
                                className="
                                p-1.5 rounded-[var(--radius)] hover:bg-green-200/80
                                text-green-500 bg-green-100 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleAction(app, "reject")}
                                className="
                                p-1.5 rounded-[var(--radius)] hover:bg-red-200/80
                                text-red-500 bg-red-100 transition-colors"
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
