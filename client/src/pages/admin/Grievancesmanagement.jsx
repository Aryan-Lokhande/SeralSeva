import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  RefreshCw,
  Clock,
  MessageSquare,
} from "lucide-react";
import { getAllGrievances, updateGrievanceStatus } from "../../utils/api";
import ResolveGrievanceModal from "../../components/admin/ResolveGrievanceModal";
import ViewDetailsModal from "../../components/admin/ViewDetailsModal";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 8;

const StatusBadge = ({ status }) => {
  const styles = {
    Submitted: "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Resolved: "bg-green-100 text-green-700",
    Closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    Low: "bg-green-50 text-green-600",
    Medium: "bg-yellow-50 text-yellow-600",
    High: "bg-orange-50 text-orange-600",
    Urgent: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded ${styles[priority] || ""}`}
    >
      {priority}
    </span>
  );
};

const GrievancesManagement = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await getAllGrievances();
      if (res.success) setGrievances(res.data);
    } catch (err) {
      toast.error("Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSubmit = async ({ status, response }) => {
    try {
      const res = await updateGrievanceStatus(
        selectedGrievance._id,
        status,
        response,
      );
      if (res.success) {
        toast.success(`Grievance marked as ${status}`);
        fetchGrievances();
        setShowResolveModal(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update grievance");
    }
  };

  const categories = ["all", ...new Set(grievances.map((g) => g.category))];

  const filtered = grievances.filter((g) => {
    const matchStatus = statusFilter === "all" || g.status === statusFilter;
    const matchCategory =
      categoryFilter === "all" || g.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      g.trackingId?.toLowerCase().includes(q) ||
      g.subject?.toLowerCase().includes(q) ||
      g.personalInfo?.fullName?.toLowerCase().includes(q);
    return matchStatus && matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = {
    total: grievances.length,
    submitted: grievances.filter((g) => g.status === "Submitted").length,
    inProgress: grievances.filter((g) => g.status === "In Progress").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
    closed: grievances.filter((g) => g.status === "Closed").length,
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--txt)] tracking-wide">
              Grievances Management
            </h1>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Review and resolve user grievances
            </p>
          </div>

          <button
            onClick={fetchGrievances}
            className="
              w-full sm:w-auto
              flex items-center justify-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)]
              transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "New", value: stats.submitted },
          { label: "In Progress", value: stats.inProgress },
          { label: "Resolved", value: stats.resolved },
          { label: "Closed", value: stats.closed },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
              bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)]
              border border-[var(--bg-ter)] rounded-[var(--radius)]
              p-3 sm:p-4 text-center
              shadow-[0_6px_20px_rgba(var(--shadow-rgb),0.35)]"
          >
            <div className="text-2xl sm:text-3xl font-bold text-white pb-1 sm:pb-2">
              {stat.value}
            </div>

            <span
              className="
                text-[10px] sm:text-xs font-semibold px-2 py-0.5
                rounded-full bg-white/20 text-white/80"
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="
          bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-[var(--radius)] p-4 mb-4
          flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
      >
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--txt-dim)]" />
          <input
            type="text"
            placeholder="Search by ID, subject, name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="
            w-full pl-9 pr-4 py-2 bg-[var(--bg-ter)]
            border border-[var(--txt-dim)] rounded-[var(--radius)]
            text-sm text-[var(--txt)] placeholder:text-[var(--txt-dim)]/80
            focus:outline-none focus:border-[var(--btn)]"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
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
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="
            px-3 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)]
            rounded-[var(--radius)] text-sm text-[var(--txt)]
            focus:outline-none focus:border-[var(--btn)]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <span className="text-sm text-[var(--txt-dim)] sm:ml-auto w-full sm:w-auto text-right">
          {filtered.length} results
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[var(--btn)] animate-spin" />
          <span className="ml-3 text-[var(--txt-dim)]">
            Loading grievances...
          </span>
        </div>
      ) : paginated.length === 0 ? (
        <div
          className="
          bg-[var(--bg-sec)] border border-[var(--bg-ter)]
          rounded-[var(--radius)] text-center py-20"
        >
          <MessageSquare className="w-12 h-12 text-[var(--txt-dim)]/80 mx-auto mb-3" />
          <p className="text-[var(--txt)] font-medium">No grievances found</p>
          <p className="text-[var(--txt-dim)] text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((grv, i) => (
            <motion.div
              key={grv._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] p-5 
              rounded-[var(--radius)] hover:border-[var(--btn)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-[var(--btn)]">
                      {grv.trackingId}
                    </span>

                    <StatusBadge status={grv.status} />
                    <PriorityBadge priority={grv.priority} />

                    <span
                      className="
                    px-2 py-0.5 text-xs text-[var(--txt)]
                    bg-[rgba(var(--shadow-rgb),0.15)]
                    rounded-[var(--radius)]"
                    >
                      {grv.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[var(--txt)] mb-1">
                    {grv.subject}
                  </h3>

                  <p className="text-[var(--txt-dim)] text-sm line-clamp-2 mb-3">
                    {grv.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--txt-dim)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(grv.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedGrievance(grv);
                      setShowDetailsModal(true);
                    }}
                    className="
                    flex items-center space-x-1 px-3 py-1.5
                    bg-[var(--bg-ter)] text-[var(--txt)]
                    hover:bg-[rgba(var(--shadow-rgb),0.15)]
                    rounded-[var(--radius)] text-sm transition-colors
                    border border-[var(--bg-ter)]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {grv.status !== "Resolved" && grv.status !== "Closed" && (
                    <button
                      onClick={() => {
                        setSelectedGrievance(grv);
                        setShowResolveModal(true);
                      }}
                      className="
                      flex items-center space-x-1 px-3 py-1.5
                      bg-[var(--btn)]
                      hover:bg-[var(--btn-hover)]
                      text-white
                      rounded-[var(--radius)]
                      text-sm
                      transition-colors
                    "
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>

              {grv.response && (
                <div className="mt-3 pt-3 border-t border-[var(--bg-ter)]">
                  <p className="text-xs font-medium text-[var(--txt-dim)] mb-1">
                    Admin Response:
                  </p>
                  <p className="text-sm text-[var(--btn)] bg-[var(--btn)]/8 border border-[var(--btn)] rounded-[var(--radius)] p-2">
                    {grv.response}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && paginated.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filtered.length}
          />
        </div>
      )}

      {showResolveModal && (
        <ResolveGrievanceModal
          isOpen={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          grievance={selectedGrievance}
          onSubmit={handleResolveSubmit}
        />
      )}

      {showDetailsModal && (
        <ViewDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          data={selectedGrievance}
          type="grievance"
        />
      )}
    </div>
  );
};

export default GrievancesManagement;
