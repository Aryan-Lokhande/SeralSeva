import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  MapPin,
  CreditCard,
  FileText,
  Clock,
  MessageSquare,
} from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-5">
    <div className="flex items-center space-x-2 mb-3">
      <Icon className="w-4 h-4 text-btn" />
      <h4 className="text-sm font-semibold  text-[var(--txt)]">{title}</h4>
    </div>
    <div className="bg-bg-ter rounded-lg p-4 grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs  text-[var(--txt-dim)] mb-0.5">{label}</p>
    <p className="text-sm font-medium  text-[var(--txt)] break-words">{value || "-"}</p>
  </div>
);

const StatusBadge = ({ status, type }) => {
  const appStyles = {
    Submitted: "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    "Documents Required": "bg-orange-100 text-orange-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const grvStyles = {
    Submitted: "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Resolved: "bg-green-100 text-green-700",
    Closed: "bg-gray-100 text-gray-600",
  };
  const styles = type === "application" ? appStyles : grvStyles;
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const ViewDetailsModal = ({ isOpen, onClose, data, type }) => {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="
          relative
          bg-[var(--bg-sec)]
          rounded-[var(--radius)]
          shadow-[0_20px_60px_rgba(var(--shadow-rgb),0.45)]
          max-w-2xl w-full mx-4
          max-h-[90vh]
          flex flex-col
          overflow-hidden
          border border-[var(--bg-ter)]
        "
        >
          {/* Header */}
          <div
            className="
            px-6 py-4 bg-[var(--txt)]
            flex items-center justify-between
            flex-shrink-0"
          >
            <div>
              <h3 className="text-2xl font-bold text-white tracking-wide">
                {type === "application"
                  ? "Application Details"
                  : "Grievance Details"}
              </h3>

              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-sm text-[var(--btn)] font-semibold">
                  {type === "application"
                    ? data.applicationId
                    : data.trackingId}
                </span>
                <StatusBadge status={data.status} type={type} />
              </div>
            </div>

            <button
              onClick={onClose}
              className="
              hover:bg-[rgba(var(--shadow-rgb),0.15)]
              p-2 rounded-[var(--radius)] transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4 bg-[var(--bg-sec)]">
            {type === "application" ? (
              <>
                <Section icon={FileText} title="Application Info">
                  <Field label="Application ID" value={data.applicationId} />
                  <Field label="Scheme" value={data.scheme?.title} />
                  <Field label="Category" value={data.scheme?.category} />
                  <Field
                    label="Submitted"
                    value={formatDate(data.submittedAt || data.createdAt)}
                  />
                  {data.remarks && (
                    <div className="col-span-2">
                      <Field label="Remarks" value={data.remarks} />
                    </div>
                  )}
                </Section>

                <Section icon={User} title="Personal Information">
                  <Field
                    label="Full Name"
                    value={data.personalInfo?.fullName || data.user?.name}
                  />
                  <Field
                    label="Email"
                    value={data.personalInfo?.email || data.user?.email}
                  />
                  <Field
                    label="Phone"
                    value={data.personalInfo?.phone || data.user?.phone}
                  />
                  <Field
                    label="Aadhar"
                    value={
                      data.personalInfo?.aadhar
                        ? `XXXX XXXX ${data.personalInfo.aadhar.slice(-4)}`
                        : "-"
                    }
                  />
                  <Field label="PAN" value={data.personalInfo?.pan} />
                  <Field
                    label="Annual Income"
                    value={
                      data.personalInfo?.income
                        ? `₹${Number(data.personalInfo.income).toLocaleString("en-IN")}`
                        : "-"
                    }
                  />
                </Section>

                <Section icon={MapPin} title="Address">
                  <div className="col-span-2">
                    <Field
                      label="Full Address"
                      value={data.address?.fullAddress}
                    />
                  </div>
                  <Field label="City" value={data.address?.city} />
                  <Field label="State" value={data.address?.state} />
                  <Field label="Pincode" value={data.address?.pincode} />
                </Section>

                <Section icon={CreditCard} title="Bank Details">
                  <Field
                    label="Account Number"
                    value={
                      data.bankDetails?.accountNumber
                        ? `XXXX ${data.bankDetails.accountNumber.slice(-4)}`
                        : "-"
                    }
                  />
                  <Field label="IFSC Code" value={data.bankDetails?.ifsc} />
                </Section>
              </>
            ) : (
              <>
                <Section icon={MessageSquare} title="Grievance Info">
                  <Field label="Tracking ID" value={data.trackingId} />
                  <Field label="Category" value={data.category} />
                  <Field label="Type" value={data.grievanceType} />
                  <Field label="Priority" value={data.priority} />
                  <Field label="Related Scheme" value={data.schemeName} />
                  <Field label="Submitted" value={formatDate(data.createdAt)} />

                  <div className="col-span-2">
                    <Field label="Subject" value={data.subject} />
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-[var(--txt-dim)] mb-1">
                      Description
                    </p>
                    <p className="text-sm text-[var(--txt)] bg-[var(--bg-primary)] rounded-[var(--radius)] p-3 leading-relaxed border border-[var(--bg-ter)]">
                      {data.description}
                    </p>
                  </div>
                </Section>

                <Section icon={User} title="Contact Information">
                  <Field
                    label="Full Name"
                    value={data.personalInfo?.fullName}
                  />
                  <Field label="Email" value={data.personalInfo?.email} />
                  <Field label="Phone" value={data.personalInfo?.phone} />
                  <Field label="State" value={data.personalInfo?.state} />
                  <Field label="District" value={data.personalInfo?.district} />
                  <Field label="Pincode" value={data.personalInfo?.pincode} />
                </Section>

                {/* Timeline */}
                {data.timeline?.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="w-4 h-4 text-[var(--btn)]" />
                      <h4 className="text-sm font-semibold text-[var(--txt)]">
                        Timeline
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {data.timeline.map((item, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[var(--btn)] rounded-full mt-2 flex-shrink-0" />

                          <div className="flex-1 bg-[var(--btn)]/8 rounded-[var(--radius)] p-3 border border-[var(--btn)]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-[var(--btn)]">
                                {item.status}
                              </span>
                              <span className="text-xs text-[var(--btn)]/80">
                                {formatDate(item.timestamp)}
                              </span>
                            </div>

                            <p className="text-xs text-[var(--btn)]/80">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Response */}
                {data.response && (
                  <div
                    className="
                    bg-[rgba(var(--shadow-rgb),0.12)]
                    border border-[var(--btn)]
                    rounded-[var(--radius)]
                    p-4
                  "
                  >
                    <p className="text-sm font-semibold text-[var(--btn)] mb-1">
                      Admin Response
                    </p>
                    <p className="text-sm text-[var(--txt)]">{data.response}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="
            bg-[var(--bg-ter)] border-t border-[var(--bg-ter)]
            flex justify-end flex-shrink-0 px-6 py-3" 
          >
            <button
              onClick={onClose}
              className="
              px-5 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)]
              text-white rounded-[var(--radius)] text-sm font-medium
              transition-all duration-200 shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ViewDetailsModal;
