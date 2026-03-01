import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  Search,
  RefreshCw,
  Package,
} from "lucide-react";
import { getSchemes, updateScheme } from "../../utils/api";
import toast from "react-hot-toast";

const SchemesManagement = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "Housing",
    "Healthcare",
    "Agriculture",
    "Social Security",
    "Women Empowerment",
    "Entrepreneurship",
    "Employment",
    "Education",
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await getSchemes();
      console.log("Fetched schemes:", res);
      if (res.success) setSchemes(res.data);
    } catch (err) {
      toast.error("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (scheme) => {
    try {
      const res = await updateScheme(scheme._id, {
        isActive: !scheme.isActive,
      });
      if (res.success) {
        toast.success(
          `Scheme ${!scheme.isActive ? "activated" : "deactivated"}`,
        );
        fetchSchemes();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update scheme");
    }
  };

  const filtered = schemes.filter((s) => {
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.title?.toLowerCase().includes(q) ||
      s.code?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const stats = {
    total: schemes.length,
    active: schemes.filter((s) => s.isActive).length,
    inactive: schemes.filter((s) => !s.isActive).length,
  };

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--txt)]">
              Schemes Management
            </h1>
            <p className="text-[var(--txt-dim)] text-sm mt-1">
              Add, edit and manage government schemes
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSchemes}
              className="
              flex items-center space-x-2 px-4 py-2
              bg-[var(--bg-sec)] border border-[var(--bg-ter)] 
              rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)] transition
              transition-colors text-[var(--txt-dim)] text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => navigate("/admin/schemes/add")}
              className="
              flex items-center space-x-2 px-4 py-2
              bg-[var(--btn)]
              hover:bg-[var(--btn-hover)]
              text-white
              rounded-[var(--radius)]
              transition-all duration-200
              shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.35)]
            "
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Scheme</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Schemes", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Inactive", value: stats.inactive },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
            bg-gradient-to-br from-[var(--btn)]/80 to-[var(--btn-hover)]
            border border-[var(--bg-ter)] rounded-[var(--radius)]
            p-4 flex items-center justify-between "
          >
            <span className="text-sm text-white/90">{stat.label}</span>

            <span className={"text-2xl font-bold text-white"}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="
        bg-[var(--bg-sec)] border border-[var(--txt-dim)]
        rounded-[var(--radius)] p-4 mb-4
        flex flex-wrap items-center gap-4
      "
      >
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--txt-dim)]" />
          <input
            type="text"
            placeholder="Search by title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
            w-full pl-9 pr-4 py-2
            bg-[var(--bg-ter)]
            border border-[var(--txt-dim)]
            rounded-[var(--radius)]
            text-sm text-[var(--txt)]
            placeholder:text-[var(--txt-dim)]
            focus:outline-none
            focus:border-[var(--btn)]
            transition-colors
          "
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="
          px-3 py-2
          bg-[var(--bg-ter)]
          border border-[var(--txt-dim)]
          rounded-[var(--radius)]
          text-sm text-[var(--txt)]
          focus:outline-none
          focus:border-[var(--btn)]
        "
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <span className="text-sm text-[var(--txt-dim)] ml-auto">
          {filtered.length} schemes
        </span>
      </div>

      {/* Table */}
      <div
        className="
        bg-[var(--bg-sec)]
        border border-[var(--txt-dim)]
        rounded-[var(--radius)]
        overflow-hidden
      "
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[var(--btn)] animate-spin" />
            <span className="ml-3 text-[var(--txt-dim)]">
              Loading schemes...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-[var(--txt-dim)] mx-auto mb-3" />
            <p className="text-[var(--txt)] font-medium">No schemes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--bg-ter)] bg-[var(--nav)]">
                  {["Scheme", "Code", "Category", "Status", "Actions"].map(
                    (head) => (
                      <th
                        key={head}
                        className="
                        text-left py-3 px-4 text-xs font-semibold
                        text-white/80 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--txt-dim)]">
                {filtered.map((scheme, i) => (
                  <motion.tr
                    key={scheme._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-[var(--bg-ter)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--txt)] text-sm">
                        {scheme.title}
                      </div>
                      <div className="text-xs text-[var(--txt-dim)] line-clamp-1">
                        {scheme.description}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-[var(--btn)] font-semibold">
                        {scheme.code}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className="
                        px-2.5 py-1
                        text-xs font-medium
                        bg-[rgba(var(--shadow-rgb),0.15)]
                        text-[var(--txt)]
                        rounded-full
                      "
                      >
                        {scheme.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`
                        px-2.5 py-1 text-xs font-semibold rounded-full
                        ${
                          scheme.isActive
                            ? "bg-[var(--btn)]/8 text-[var(--btn)] border"
                            : "bg-[var(--bg-ter)] text-[var(--txt-dim)] border"
                        }
                      `}
                      >
                        {scheme.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/schemes/edit/${scheme._id}`)
                          }
                          className="
                          p-1.5
                          rounded-[var(--radius)]
                          hover:bg-[rgba(var(--shadow-rgb),0.15)]
                          text-[var(--btn)]
                          transition-colors
                        "
                          title="Edit Scheme"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(scheme)}
                          className="
                          p-1.5
                          rounded-[var(--radius)]
                          hover:bg-[rgba(var(--shadow-rgb),0.15)]
                          text-[var(--txt-dim)]
                          transition-colors
                        "
                          title={scheme.isActive ? "Deactivate" : "Activate"}
                        >
                          {scheme.isActive ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesManagement;
