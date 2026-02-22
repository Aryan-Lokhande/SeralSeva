import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";

const ApproveRejectModal = ({
  isOpen,
  onClose,
  application,
  onSubmit,
  type = "approve",
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rejectionReasons = [
    "Income exceeds eligibility limit",
    "Incomplete or invalid documents",
    "Age criteria not met",
    "Already beneficiary of similar scheme",
    "Address/residence proof invalid",
    "Bank account verification failed",
    "Custom reason",
  ];

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Custom reason" ? customReason : selectedReason;

    if (type === "reject" && !reason) {
      alert("Please select or enter a rejection reason");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        status: type === "approve" ? "Approved" : "Rejected",
        remarks: reason,
        sendEmail,
      });
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b border-[var(--border)] ${
              type === "approve" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {type === "approve" ? (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-txt">
                    {type === "approve"
                      ? "Approve Application"
                      : "Reject Application"}
                  </h3>
                  <p className="text-sm text-txt-dim">
                    {application?.applicationId}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-ter rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-txt-dim" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Application Info */}
            <div className="bg-bg-sec p-4 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-txt-dim">Applicant:</span>
                  <span className="font-medium text-txt">
                    {application?.user?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-txt-dim">Scheme:</span>
                  <span className="font-medium text-txt">
                    {application?.scheme?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-txt-dim">Email:</span>
                  <span className="font-medium text-txt">
                    {application?.user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Rejection Reasons (only for reject) */}
            {type === "reject" && (
              <div>
                <label className="block text-sm font-medium text-txt mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-ter border border-[var(--border)] rounded-lg focus:border-btn focus:outline-none text-txt"
                >
                  <option value="">Select a reason</option>
                  {rejectionReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Reason Textarea */}
            {type === "reject" && selectedReason === "Custom reason" && (
              <div>
                <label className="block text-sm font-medium text-txt mb-2">
                  Custom Reason
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 bg-bg-ter border border-[var(--border)] rounded-lg focus:border-btn focus:outline-none text-txt resize-none"
                  placeholder="Enter detailed reason for rejection..."
                />
              </div>
            )}

            {/* Approval Message (only for approve) */}
            {type === "approve" && (
              <div className="flex items-start space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Confirm Approval</p>
                  <p className="mt-1">
                    The applicant will be notified via email and the application
                    status will be updated to "Approved".
                  </p>
                </div>
              </div>
            )}

            {/* Email Notification Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-btn border-gray-300 rounded focus:ring-btn"
              />
              <label htmlFor="sendEmail" className="text-sm text-txt">
                Send email notification to applicant
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-bg-sec border-t border-[var(--border)] flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-bg-ter transition-colors text-txt font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (type === "reject" && !selectedReason)}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : type === "approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApproveRejectModal;
