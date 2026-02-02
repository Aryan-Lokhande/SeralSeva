import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

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

  useEffect(() => {
    if (!!isAuthenticated) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate mock tracking ID
    const trackingId = "GRV" + Date.now().toString().slice(-8);

    // Mock submission
    console.log("Grievance submitted:", { trackingId, formData });

    toast.success(`Grievance lodged successfully! Tracking ID: ${trackingId}`, {
      duration: 5000,
    });

    // Store in localStorage for tracking
    const grievances = JSON.parse(localStorage.getItem("grievances") || "[]");
    grievances.push({
      id: trackingId,
      ...formData,
      status: "Submitted",
      submittedDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    });
    localStorage.setItem("grievances", JSON.stringify(grievances));

    navigate("/track-grievance", { state: { trackingId } });
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

  if (!!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-6 bg-[var(--bg-primary)]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="          
          flex items-center gap-2 px-4 py-2 mb-1
          text-white/90 hover:text-[var(--btn-hover)] text-xl cursor-pointer
          transition-colors duration-200 "
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
        relative mb-8 bg-gradient-to-r
        from-[var(--btn)] to-[var(--btn-hover)] p-8 
        rounded-[var(--radius)]
        shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.45)]"
        >
          {/* Title */}
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
          className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grievance Details */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Grievance Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-txt font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
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
                  <label className="block text-txt font-medium mb-2">
                    Grievance Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="grievanceType"
                    value={formData.grievanceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
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
                  <label className="block text-txt font-medium mb-2">
                    Related Scheme (if applicable)
                  </label>
                  <input
                    type="text"
                    name="schemeName"
                    value={formData.schemeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Enter scheme name if grievance is scheme-related"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-txt font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Brief subject of your grievance"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-txt font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Please provide detailed description of your grievance. Include dates, reference numbers, and any other relevant information."
                    required
                  />
                  <p className="text-txt-dim text-sm mt-1">
                    Minimum 50 characters required
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-txt font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Your state"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Your district"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="6-digit PIN"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-txt font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Your complete address"
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Supporting Documents
              </h3>

              <div className="mt-4">
                <label className="block text-txt font-medium mb-2">
                  Upload Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-bg-ter rounded-custom p-6 text-center">
                  <input
                    type="file"
                    name="attachments"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-txt-dim">
                      <svg
                        className="mx-auto h-12 w-12 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-btn font-medium">
                        Click to upload
                      </span>
                      <span> or drag and drop</span>
                    </div>
                    <p className="text-xs text-txt-dim mt-2">
                      PDF, JPG, PNG, DOC up to 5MB
                    </p>
                  </label>
                  {formData.attachments && (
                    <p className="text-txt mt-2">
                      Selected: {formData.attachments.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-custom p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-txt font-semibold mb-1">
                    Important Information
                  </h4>
                  <ul className="text-txt-dim text-sm space-y-1">
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
                className="flex-1 bg-[var(--txt-disabled)]/40 rounded-[var(--radius)] text-[var(--txt)]/90 py-3 rounded-custom font-semibold transition-colors duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-[var(--btn-hover)] to-[var(--btn)] rounded-[var(--radius)] text-white py-3 rounded-custom font-semibold transition-colors duration-200"
              >
                Submit Grievance
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LodgeGrievance;
