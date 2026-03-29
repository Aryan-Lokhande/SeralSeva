import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Filter,
  Eye,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../../utils/api";
import UserDetailsModal from "../../components/admin/UserDetailsModal.jsx";
import ConfirmModal from "../../components/admin/ConfirmModal";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // {type, user}

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers({
        role: roleFilter,
        status: statusFilter,
        search: searchQuery,
      });
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      const res = await updateUserRole(user._id, newRole);
      if (res.success) {
        toast.success(`User role changed to ${newRole}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    try {
      const res = await updateUserStatus(user._id, newStatus);
      if (res.success) {
        toast.success(
          `User ${newStatus === "Blocked" ? "blocked" : "unblocked"} successfully`,
        );
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (user) => {
    setConfirmAction({ type: "delete", user });
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteUser(confirmAction.user._id);
      if (res.success) {
        toast.success("User deleted successfully");
        fetchUsers();
        setConfirmAction(null);
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q);
    return matchRole && matchStatus && matchSearch;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    active: users.filter((u) => u.status === "Active").length,
    blocked: users.filter((u) => u.status === "Blocked").length,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-[var(--radius)] flex items-center justify-center shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]">
              <UsersIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--txt)] tracking-wide">
                Users Management
              </h1>
              <p className="text-[var(--txt-dim)] text-sm">
                Manage user accounts and permissions
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] hover:bg-[var(--bg-ter)] hover:border-[var(--txt-dim)] transition transition-colors text-[var(--txt-dim)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          {
            label: "Total Users",
            value: stats.total,
            color: "from-[var(--btn)]/80 to-[var(--btn-hover)]",
          },
          {
            label: "Admins",
            value: stats.admins,
            color: "from-purple-400 to-purple-600",
          },
          {
            label: "Regular Users",
            value: stats.users,
            color: "from-blue-400 to-blue-600",
          },
          {
            label: "Active",
            value: stats.active,
            color: "from-green-400 to-green-600",
          },
          {
            label: "Blocked",
            value: stats.blocked,
            color: "from-red-400 to-red-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} border border-[var(--bg-ter)] rounded-[var(--radius)] p-4 text-center`}
          >
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <span className="text-xs font-medium text-white/90">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-[var(--radius)] p-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--txt-dim)]" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)] rounded-[var(--radius)] text-sm text-[var(--txt)] placeholder:text-[var(--txt-dim)] focus:outline-none focus:border-[var(--btn)] transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--txt-dim)]" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              fetchUsers();
            }}
            className="px-3 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)] rounded-[var(--radius)] text-sm text-[var(--txt)] focus:outline-none focus:border-[var(--btn)]"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchUsers();
            }}
            className="px-3 py-2 bg-[var(--bg-ter)] border border-[var(--txt-dim)] rounded-[var(--radius)] text-sm text-[var(--txt)] focus:outline-none focus:border-[var(--btn)]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-[var(--radius)] text-sm font-medium transition-colors"
        >
          Search
        </button>

        <span className="text-sm text-[var(--txt-dim)] ml-auto">
          {filtered.length} users
        </span>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-[var(--radius)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[var(--btn)] animate-spin" />
            <span className="ml-3 text-[var(--txt-dim)]">Loading users...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <UsersIcon className="w-12 h-12 text-[var(--txt-dim)] mx-auto mb-3" />
            <p className="text-[var(--txt)] font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--bg-ter)] bg-[var(--nav)]">
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Role",
                    "Status",
                    "Joined",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="text-left py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--txt-dim)]">
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-[var(--bg-ter)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--txt)] text-sm">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm text-[var(--txt-dim)]">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--txt-dim)]">
                      {user.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-blue-100 text-blue-700 border border-blue-300"}`}
                      >
                        {user.role === "admin" ? "👑 Admin" : "User"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-600 border border-red-300"}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sm text-[var(--txt-dim)]">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-[var(--radius)] hover:bg-[rgba(var(--shadow-rgb),0.15)] text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleRole(user)}
                          className="p-1.5 rounded-[var(--radius)] hover:bg-[rgba(var(--shadow-rgb),0.15)] text-purple-500 transition-colors"
                          title={
                            user.role === "admin"
                              ? "Demote to User"
                              : "Promote to Admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-[var(--radius)] hover:bg-[rgba(var(--shadow-rgb),0.15)] transition-colors ${user.status === "Active" ? "text-red-500" : "text-green-500"}`}
                          title={
                            user.status === "Active"
                              ? "Block User"
                              : "Unblock User"
                          }
                        >
                          {user.status === "Active" ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-[var(--radius)] hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modals */}
      {showDetailsModal && (
        <UserDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          user={selectedUser}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${confirmAction.user.name}? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default UsersManagement;
