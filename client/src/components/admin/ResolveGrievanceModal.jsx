import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const ResolveGrievanceModal = ({ isOpen, onClose, grievance, onSubmit }) => {
  const [status, setStatus] = useState("Resolved");
  const [selectedResponse, setSelectedResponse] = useState("");
  const [customResponse, setCustomResponse] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedResponses = {
    resolved: [
      "Issue resolved - payment processed successfully",
      "Documents verified successfully",
      "Application status has been updated",
      "Your query has been addressed and resolved",
      "Custom response",
    ],
    closed: [
      "Not eligible for this scheme",
      "Duplicate grievance already addressed",
      "Insufficient information provided",
      "Issue already resolved in previous communication",
      "Custom response",
    ],
  };

  const responses =
    status === "Resolved"
      ? predefinedResponses.resolved
      : predefinedResponses.closed;

  const handleSubmit = async () => {
    const response =
      selectedResponse === "Custom response"
        ? customResponse
        : selectedResponse;

    if (!response) {
      alert("Please select or enter a response");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        status,
        response,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="
          absolute inset-0 
          bg-black/40 
          backdrop-blur-sm
        "
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="
          relative w-full max-w-2xl
          bg-[var(--bg-sec)]
          border border-[var(--bg-ter)]
          rounded-[var(--radius)]
          shadow-[0_20px_60px_rgba(var(--shadow-rgb),0.25)]
          overflow-hidden
        "
        >
          {/* Header */}
          <div
            className="
            px-6 py-4
            bg-gradient-to-r
            from-[var(--btn)]
            to-[var(--btn-hover)]
            text-white
            border-b border-white/20
          "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-bold">Resolve Grievance</h3>
                  <p className="text-sm text-white/80 font-medium">
                    {grievance?.trackingId}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="
                p-2 rounded-full 
                hover:bg-white/20 
                transition-colors
              "
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="
            px-6 py-5 space-y-5
            max-h-[65vh]
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-[var(--btn)]
            scrollbar-track-[var(--bg-ter)]
          "
          >
            {/* Grievance Info */}
            <div
              className="
              bg-[var(--bg-ter)]
              border border-[var(--bg-primary)]
              rounded-[var(--radius)]
              p-4
            "
            >
              <div className="text-sm space-y-3">
                <div>
                  <span className="text-[var(--txt-dim)] font-medium">
                    Subject:
                  </span>
                  <p className="font-semibold text-[var(--txt)] mt-1">
                    {grievance?.subject}
                  </p>
                </div>

                <div>
                  <span className="text-[var(--txt-dim)] font-medium">
                    Category:
                  </span>
                  <p className="font-semibold text-[var(--txt)] mt-1">
                    {grievance?.category}
                  </p>
                </div>

                <div>
                  <span className="text-[var(--txt-dim)] font-medium">
                    Description:
                  </span>
                  <p className="text-[var(--txt)] mt-1 text-sm leading-relaxed">
                    {grievance?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-semibold text-[var(--txt)] mb-2">
                Status <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Resolved"
                    checked={status === "Resolved"}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setSelectedResponse("");
                      setCustomResponse("");
                    }}
                    className="w-4 h-4 accent-[var(--btn)]"
                  />
                  <span className="text-sm text-[var(--txt)] font-medium">
                    Resolved
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Closed"
                    checked={status === "Closed"}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setSelectedResponse("");
                      setCustomResponse("");
                    }}
                    className="w-4 h-4 accent-[var(--btn)]"
                  />
                  <span className="text-sm text-[var(--txt)] font-medium">
                    Closed
                  </span>
                </label>
              </div>
            </div>

            {/* Response Selection */}
            <div>
              <label className="block text-sm font-semibold text-[var(--txt)] mb-2">
                Response to User <span className="text-red-500">*</span>
              </label>

              <select
                value={selectedResponse}
                onChange={(e) => setSelectedResponse(e.target.value)}
                className="
                w-full px-4 py-3
                bg-[var(--bg-ter)]
                border border-[var(--bg-primary)]
                rounded-[var(--radius)]
                text-[var(--txt)]
                focus:border-[var(--btn)]
                focus:outline-none
              "
              >
                <option value="">Select a response</option>
                {responses.map((response) => (
                  <option key={response} value={response}>
                    {response}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Response Textarea */}
            {selectedResponse === "Custom response" && (
              <div>
                <label className="block text-sm font-semibold text-[var(--txt)] mb-2">
                  Custom Response
                </label>

                <textarea
                  value={customResponse}
                  onChange={(e) => setCustomResponse(e.target.value)}
                  rows="4"
                  className="
                  w-full px-4 py-3
                  bg-[var(--bg-ter)]
                  border border-[var(--bg-primary)]
                  rounded-[var(--radius)]
                  text-[var(--txt)]
                  focus:border-[var(--btn)]
                  focus:outline-none
                  resize-none
                "
                  placeholder="Enter detailed response to the user..."
                />
              </div>
            )}

            {/* Info Message */}
            <div
              className="
              flex items-start gap-3
              p-4
              bg-[var(--btn)]/10
              border border-[var(--btn)]/40
              rounded-[var(--radius)]
            "
            >
              <AlertCircle className="w-5 h-5 text-[var(--btn)] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--txt)]">
                <p className="font-semibold">Resolution Notice</p>
                <p className="mt-1 text-[var(--txt-dim)]">
                  The user will be notified via email with your response. The
                  grievance timeline will be updated automatically.
                </p>
              </div>
            </div>

            {/* Email Notification Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendEmailGrievance"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 accent-[var(--btn)]"
              />
              <label
                htmlFor="sendEmailGrievance"
                className="text-sm text-[var(--txt)] font-medium"
              >
                Send email notification to user
              </label>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
            px-6 py-4
            bg-[var(--bg-ter)]
            border-t border-[var(--bg-primary)]
            flex items-center justify-end gap-3
          "
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="
              px-5 py-2
              border border-[var(--bg-primary)]
              rounded-[var(--radius)]
              bg-[var(--bg-sec)]
              text-[var(--txt)]
              font-semibold
              hover:bg-[var(--bg-primary)]
              transition-colors
              disabled:opacity-50
            "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedResponse}
              className="
              px-6 py-2
              rounded-[var(--radius)]
              font-semibold text-white
              bg-gradient-to-r
              from-[var(--btn)]
              to-[var(--btn-hover)]
              shadow-[0_10px_25px_rgba(var(--shadow-rgb),0.25)]
              hover:opacity-95
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            >
              {isSubmitting ? "Processing..." : `Mark as ${status}`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResolveGrievanceModal;
