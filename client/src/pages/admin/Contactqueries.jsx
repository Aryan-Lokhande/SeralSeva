import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  Send,
} from "lucide-react";
import { getAllContactQueries, resolveContactQuery } from "../../utils/api";
import toast from "react-hot-toast";

const ReplyModal = ({ isOpen, onClose, query, onSubmit }) => {
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const quickReplies = [
    "Thank you for reaching out. Your query has been addressed.",
    "We have reviewed your concern and taken the necessary action.",
    "Please visit your nearest government office for further assistance.",
    "Your issue has been escalated to the concerned department.",
  ];

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(response);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[var(--border)] bg-bg-sec flex items-center justify-between">
            <div>
              <h3 className="font-bold text-txt">Reply to Query</h3>
              <p className="text-sm text-txt-dim">
                {query?.name} — {query?.subject}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-ter rounded-lg"
            >
              <X className="w-5 h-5 text-txt-dim" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* Original Query */}
            <div className="bg-bg-ter rounded-lg p-4">
              <p className="text-xs text-txt-dim mb-1">
                Original message from {query?.name} ({query?.email}):
              </p>
              <p className="text-sm text-txt">{query?.message}</p>
            </div>

            {/* Quick Replies */}
            <div>
              <p className="text-xs font-medium text-txt-dim mb-2">
                Quick Replies:
              </p>
              <div className="space-y-2">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => setResponse(qr)}
                    className="w-full text-left text-xs text-txt-dim bg-bg-ter hover:bg-accent rounded-lg px-3 py-2 transition-colors border border-[var(--border)]"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Area */}
            <div>
              <label className="block text-sm font-medium text-txt mb-2">
                Your Response <span className="text-red-500">*</span>
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows="4"
                className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-sm text-txt focus:outline-none focus:border-btn resize-none"
                placeholder="Type your response here..."
              />
            </div>
          </div>

          <div className="px-6 py-3 bg-bg-sec border-t border-[var(--border)] flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border)] rounded-lg text-txt-dim hover:bg-bg-ter text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !response.trim()}
              className="flex items-center space-x-2 px-5 py-2 bg-btn hover:bg-btn-hover text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Sending..." : "Send & Resolve"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await getAllContactQueries();
      if (res.success) setQueries(res.data);
    } catch (err) {
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (response) => {
    try {
      const res = await resolveContactQuery(selectedQuery._id, response);
      if (res.success) {
        toast.success("Reply sent and query resolved!");
        fetchQueries();
        setShowReplyModal(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to resolve query");
    }
  };

  const filtered = queries.filter((q) => {
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      !s ||
      q.name?.toLowerCase().includes(s) ||
      q.email?.toLowerCase().includes(s) ||
      q.subject?.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: queries.length,
    open: queries.filter((q) => q.status === "Open").length,
    resolved: queries.filter((q) => q.status === "Resolved").length,
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--txt)] tracking-wide">
              Contact Queries
            </h1>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Manage and respond to user contact submissions
            </p>
          </div>

          <button
            onClick={fetchQueries}
            className="
              flex items-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)] transition
              transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Queries", value: stats.total },
          { label: "Open", value: stats.open },
          { label: "Resolved", value: stats.resolved },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
            bg-gradient-to-br from-[var(--btn)]/80 to-[var(--btn-hover)] 
            border border-[var(--bg-ter)] rounded-[var(--radius)]
            p-4 flex items-center justify-between "
          >
            <span className="text-sm text-white/90 font-medium">
              {stat.label}
            </span>
            <span className={"text-2xl font-bold text-white"}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="bg-[var(--bg-sec)] border border-[var(--txt-dim)]
      rounded-[var(--radius)] p-4 mb-4 flex items-center gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--txt-dim)]" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
            w-full pl-9 pr-4 py-2 bg-[var(--bg-ter)]
            border border-[var(--txt-dim)] rounded-[var(--radius)]
            text-sm text-[var(--txt)] placeholder-[var(--txt-dim)]
            focus:outline-none focus:border-[var(--btn)] transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
          px-3 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)]
          rounded-[var(--radius)] text-sm text-[var(--txt)]
          focus:outline-none focus:border-[var(--btn)] transition-colors"
        >
          <option value="all">All Queries</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Query Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[var(--btn)] animate-spin" />
          <span className="ml-3 text-[var(--txt-dim)]">Loading queries...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="
        bg-[var(--bg-sec)] border border-[var(--txt-dim)]
        rounded-[var(--radius)] text-center py-20"
        >
          <Mail className="w-12 h-12 text-[var(--txt-dim)]/80 mx-auto mb-3" />
          <p className="text-[var(--txt)] font-medium">No contact queries</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((query, i) => (
            <motion.div
              key={query._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`
              bg-[var(--bg-sec)]
              border
              rounded-[var(--radius)]
              p-5
              transition-colors
              ${
                query.status === "Open"
                  ? "border-[var(--btn)] bg-[rgba(var(--shadow-rgb),0.12)]"
                  : "border-[var(--txt-dim)]"
              }
            `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`
                      px-2.5 py-1 text-xs font-semibold rounded-full
                      ${
                        query.status === "Open"
                          ? "bg-[rgba(var(--shadow-rgb),0.2)] text-[var(--btn)]"
                          : "bg-[rgba(var(--shadow-rgb),0.12)] text-[var(--accent)]"
                      }
                    `}
                    >
                      {query.status}
                    </span>

                    <span className="text-xs text-[var(--txt-dim)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(query.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[var(--txt)] mb-1">
                    {query.subject}
                  </h3>

                  <p className="text-sm text-[var(--txt-dim)] line-clamp-2 mb-2">
                    {query.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[var(--txt-dim)]">
                    <span>
                      From:
                      <span className="font-medium text-[var(--txt)] ml-1">
                        {query.name}
                      </span>
                    </span>
                    <span>{query.email}</span>
                    {query.phone && <span>{query.phone}</span>}
                  </div>

                  {query.adminResponse && (
                    <div
                      className="
                    mt-3 pt-3
                    border-t border-[var(--txt-dim)]
                  "
                    >
                      <p className="text-xs font-medium text-[var(--btn)] mb-1">
                        Your Response:
                      </p>
                      <p className="text-sm text-[var(--txt-dim)]">
                        {query.adminResponse}
                      </p>
                    </div>
                  )}
                </div>

                {query.status === "Open" && (
                  <button
                    onClick={() => {
                      setSelectedQuery(query);
                      setShowReplyModal(true);
                    }}
                    className="
                    flex items-center space-x-2
                    px-4 py-2
                    bg-[var(--btn)]
                    hover:bg-[var(--btn-hover)]
                    text-white
                    rounded-[var(--radius)]
                    text-sm font-medium
                    transition-all duration-200
                    shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]
                    flex-shrink-0
                  "
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showReplyModal && (
        <ReplyModal
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          query={selectedQuery}
          onSubmit={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default ContactQueries;
