import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "red",
  icon: Icon = AlertTriangle,
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  };

  const headerBgClasses = {
    red: "bg-red-50",
    green: "bg-green-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
  };

  const iconColorClasses = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  const iconBgClasses = {
    red: "bg-red-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    purple: "bg-purple-100",
  };

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
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b border-[var(--bg-ter)] ${headerBgClasses[confirmColor]} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${iconBgClasses[confirmColor]} rounded-full flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColorClasses[confirmColor]}`} />
              </div>
              <h3 className="font-bold text-[var(--txt)]">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 hover:${iconBgClasses[confirmColor]} rounded transition-colors`}
            >
              <X className="w-5 h-5 text-[var(--txt-dim)]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-[var(--txt)]">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-[var(--bg-sec)] border-t border-[var(--bg-ter)] flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[var(--bg-ter)] rounded-[var(--radius)] text-[var(--txt-dim)] hover:bg-[var(--bg-ter)] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 ${colorClasses[confirmColor]} text-white rounded-[var(--radius)] text-sm font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
