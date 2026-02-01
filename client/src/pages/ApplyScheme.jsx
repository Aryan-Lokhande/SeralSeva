import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ApplyScheme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const scheme = location.state?.scheme;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhar: "",
    pan: "",
    income: "",
    bankAccount: "",
    ifsc: "",
  });

  useEffect(() => {
    if (!!isAuthenticated) {
      toast.error("Please login to apply for schemes");
      navigate("/login");
    }
    if (!scheme) {
      toast.error("No scheme selected");
      navigate("/schemes");
    }
  }, [isAuthenticated, scheme, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock submission - replace with actual API call
    console.log("Form submitted:", { scheme, formData });
    toast.success("Application submitted successfully!");
    navigate("/dashboard");
  };

  if (!scheme) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)] text-[var(--txt)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Scheme Details Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
          bg-gradient-to-r
          from-[var(--btn)]/70
          to-[var(--btn-hover)]
          p-8
          rounded-[var(--radius)]
          shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.45)]
          mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Apply for Scheme
          </h1>
          <div className="text-gray-100 space-y-1">
            <p className="text-xl font-semibold">{scheme.title}</p>
            <p className="text-sm">Scheme Code: {scheme.code}</p>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
        >
          <h2 className="text-2xl font-bold text-txt mb-6">Application Form</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Personal Information
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
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="12-digit Aadhar number"
                    pattern="[0-9]{12}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="10-character PAN"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    Annual Income <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Enter annual income in ₹"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Address Details
              </h3>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-txt font-medium mb-2">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="House No., Street, Locality"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-txt font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                      placeholder="City"
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
                      placeholder="State"
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
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div>
              <h3 className="text-xl font-semibold text-txt mb-4 pb-2 border-b border-bg-ter">
                Bank Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-txt font-medium mb-2">
                    Bank Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-txt font-medium mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                    placeholder="11-character IFSC code"
                    pattern="[A-Z]{4}0[A-Z0-9]{6}"
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-btn/10 border border-btn rounded-custom p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="declaration"
                  className="mt-1 w-4 h-4 rounded border-bg-ter focus:ring-btn"
                  required
                />
                <label
                  htmlFor="declaration"
                  className="ml-2 text-txt-dim text-sm"
                >
                  I hereby declare that all the information provided above is
                  true and correct to the best of my knowledge. I understand
                  that any false information may lead to rejection of my
                  application.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/schemes")}
                className="flex-1 bg-[var(--txt-disabled)]/40 rounded-[var(--radius)] text-[var(--txt)]/90 py-3 rounded-custom font-semibold transition-colors duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[var(--btn)] rounded-[var(--radius)] text-white py-3 rounded-custom font-semibold transition-colors duration-200"
              >
                Submit Application
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyScheme;
