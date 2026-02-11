import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitGrievance } from "../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, UploadCloud, AlertTriangle, FileText } from "lucide-react";

const LodgeGrievance = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    category: "",
    schemeName: "",
    grievanceType: "",
    subject: "",
    description: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    attachments: null,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to lodge a grievance");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const grievanceData = {
        category: formData.category,
        grievanceType: formData.grievanceType,
        schemeName: formData.schemeName || undefined,
        subject: formData.subject,
        description: formData.description,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          state: formData.state,
          district: formData.district,
          pincode: formData.pincode,
          address: formData.address || undefined,
        },
      };

      const response = await submitGrievance(grievanceData);

      if (response.success) {
        toast.success(
          `Grievance lodged successfully! Tracking ID: ${response.data.trackingId}`,
          { duration: 5000 },
        );

        navigate("/track-grievance", {
          state: { trackingId: response.data.trackingId },
        });
      } else {
        toast.error(response.message || "Failed to submit grievance");
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit grievance");
      console.error("Grievance submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Scheme Application Issue",
    "Payment Delay",
    "Document Verification",
    "Eligibility Concern",
    "Benefit Not Received",
    "Portal Technical Issue",
    "Other",
  ];

  const grievanceTypes = [
    "Complaint",
    "Query",
    "Feedback",
    "Suggestion",
    "Appeal",
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen py-6 bg-[var(--bg-primary)]">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="
          mb-6 ml-4 inline-flex items-center gap-2
          text-[var(--btn)]
          hover:text-[var(--btn-hover)]
          font-medium transition-colors
        "
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            relative mb-8 bg-gradient-to-r
            from-[var(--btn)] to-[var(--btn-hover)]
            p-8 rounded-[var(--radius)]
            shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.45)]
          "
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Lodge a Grievance
          </h1>
          <p className="text-white/90">
            Submit your complaint or query. We'll review and respond within 15
            working days.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="
            bg-[var(--bg-sec)]
            rounded-[var(--radius)]
            shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.15)]
            p-8
          "
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grievance Details */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--txt)] mb-4 pb-2 border-b border-[var(--bg-ter)]">
                Grievance Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Grievance Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="grievanceType"
                    value={formData.grievanceType}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    required
                  >
                    <option value="">Select Type</option>
                    {grievanceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Related Scheme (if applicable)
                  </label>
                  <input
                    type="text"
                    name="schemeName"
                    value={formData.schemeName}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Enter scheme name if grievance is scheme-related"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Brief subject of your grievance"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Please provide detailed description of your grievance. Include dates, reference numbers, and any other relevant information."
                    required
                  />
                  <p className="text-[var(--txt-dim)] text-sm mt-1">
                    Minimum 50 characters required
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--txt)] mb-4 pb-2 border-b border-[var(--bg-ter)]">
                Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Your state"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Your district"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="6-digit PIN"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                      transition-colors duration-200
                    "
                    placeholder="Your complete address"
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--txt)] mb-4 pb-2 border-b border-[var(--bg-ter)]">
                Supporting Documents
              </h3>

              <div className="mt-4">
                <label className="block text-[var(--txt)] font-medium mb-2">
                  Upload Documents (Optional)
                </label>

                <div className="border-2 border-dashed border-[var(--bg-ter)] rounded-[var(--radius)] p-6 text-center bg-[var(--bg-ter)]/40">
                  <input
                    type="file"
                    name="attachments"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />

                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2 text-[var(--txt-dim)]">
                      <UploadCloud size={46} className="text-[var(--btn)]" />
                      <p>
                        <span className="text-[var(--btn)] font-semibold">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                    </div>

                    <p className="text-xs text-[var(--txt-dim)] mt-2">
                      PDF, JPG, PNG, DOC up to 5MB
                    </p>
                  </label>

                  {formData.attachments && (
                    <p className="text-[var(--txt)] mt-3 flex items-center justify-center gap-2 text-sm font-medium">
                      <FileText size={18} className="text-[var(--btn)]" />
                      {formData.attachments.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-[var(--radius)] p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={22}
                  className="text-yellow-500 mt-1 flex-shrink-0"
                />

                <div>
                  <h4 className="text-[var(--txt)] font-semibold mb-1">
                    Important Information
                  </h4>
                  <ul className="text-[var(--txt-dim)] text-sm space-y-1">
                    <li>• You will receive a tracking ID upon submission</li>
                    <li>• Response will be provided within 15 working days</li>
                    <li>• Updates will be sent via email and SMS</li>
                    <li>• Anonymous grievances will not be processed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/grievances")}
                className="
                  flex-1
                  bg-[var(--txt-disabled)]/25
                  hover:bg-[var(--txt-disabled)]/35
                  text-[var(--txt)]
                  py-3
                  rounded-[var(--radius)]
                  font-semibold
                  transition-colors duration-200
                "
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="
                  flex-1
                  bg-gradient-to-r from-[var(--btn)] to-[var(--btn-hover)]
                  hover:from-[var(--btn-hover)] hover:to-[var(--btn)]
                  text-white py-3
                  rounded-[var(--radius)]
                  font-semibold
                  transition-all duration-200
                  disabled:opacity-60
                "
              >
                {submitting ? "Submitting..." : "Submit Grievance"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LodgeGrievance;
