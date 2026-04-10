import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { getUserById } from "../../utils/api";
import toast from "react-hot-toast";

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserDetails();
    }
  }, [isOpen, user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await getUserById(user._id); // ← Called here
      if (res.success) {
        setUserData(res.data);
      }
    } catch (err) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--bg-ter)] bg-gradient-to-br from-[var(--btn)]/10 to-[var(--btn-hover)]/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-full flex items-center justify-center text-white text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[var(--txt)]">User Details</h3>
                <p className="text-sm text-[var(--txt-dim)]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-ter)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--txt-dim)]" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {loading ? (
              <div className="text-center py-10 text-[var(--txt-dim)]">
                Loading...
              </div>
            ) : (
              <div className="space-y-5">
                {/* Basic Info */}
                <div className="bg-[var(--bg-ter)] rounded-[var(--radius)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-[var(--btn)]" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-0.5">
                        Full Name
                      </p>
                      <p className="text-sm font-medium text-[var(--txt)]">
                        {userData?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-0.5">
                        Email
                      </p>
                      <p className="text-sm font-medium text-[var(--txt)]">
                        {userData?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-0.5">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-[var(--txt)]">
                        {userData?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-0.5">
                        Joined
                      </p>
                      <p className="text-sm font-medium text-[var(--txt)]">
                        {formatDate(userData?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="bg-[var(--bg-ter)] rounded-[var(--radius)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--btn)]" />
                    Account Status
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-1">Role</p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${userData?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {userData?.role === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--txt-dim)] mb-1">
                        Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${userData?.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                      >
                        {userData?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-[var(--bg-ter)] rounded-[var(--radius)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--btn)]" />
                    Activity Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-[var(--bg-ter)]">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-[var(--txt-dim)]">
                          Applications
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[var(--txt)]">
                        {userData?.stats?.applications || 0}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[var(--bg-ter)]">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-[var(--txt-dim)]">
                          Grievances
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[var(--txt)]">
                        {userData?.stats?.grievances || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-[var(--bg-sec)] border-t border-[var(--bg-ter)] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-[var(--radius)] text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserDetailsModal;
