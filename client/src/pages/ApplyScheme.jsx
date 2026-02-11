import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitApplication } from "../utils/api";
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

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for schemes");
      navigate("/login");
      return;
    }

    if (!scheme) {
      toast.error("No scheme selected");
      navigate("/schemes");
    }
  }, [isAuthenticated, scheme, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const applicationData = {
        schemeId: scheme._id,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          aadhar: formData.aadhar,
          pan: formData.pan || undefined,
          income: parseInt(formData.income),
        },
        address: {
          fullAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        bankDetails: {
          accountNumber: formData.bankAccount,
          ifsc: formData.ifsc,
        },
      };

      const response = await submitApplication(applicationData);

      if (response.success) {
        toast.success(
          `Application submitted! ID: ${response.data.applicationId}`,
        );
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error(error.message || "Submission failed");
      console.error("Application submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!scheme) return null;

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)] text-[var(--txt)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            mb-8
          "
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Apply for Scheme
          </h1>
          <div className="text-gray-100 space-y-1">
            <p className="text-xl font-semibold">{scheme.title}</p>
            <p className="text-sm">Scheme Code: {scheme.code}</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[var(--bg-sec)] rounded-[var(--radius)] shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <Section title="Personal Information">
              <Input
                name="fullName"
                label="Full Name"
                required
                {...{ formData, handleChange }}
              />
              <Input
                name="email"
                label="Email Address"
                type="email"
                required
                {...{ formData, handleChange }}
              />
              <Input
                name="phone"
                label="Phone Number"
                required
                pattern="[0-9]{10}"
                {...{ formData, handleChange }}
              />
              <Input
                name="aadhar"
                label="Aadhar Number"
                required
                pattern="[0-9]{12}"
                {...{ formData, handleChange }}
              />
              <Input
                name="pan"
                label="PAN Number"
                {...{ formData, handleChange }}
              />
              <Input
                name="income"
                label="Annual Income"
                type="number"
                required
                {...{ formData, handleChange }}
              />
            </Section>

            {/* Address */}
            <Section title="Address Details">
              <Textarea
                name="address"
                label="Full Address"
                required
                {...{ formData, handleChange }}
              />
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  name="city"
                  label="City"
                  required
                  {...{ formData, handleChange }}
                />
                <Input
                  name="state"
                  label="State"
                  required
                  {...{ formData, handleChange }}
                />
                <Input
                  name="pincode"
                  label="PIN Code"
                  required
                  pattern="[0-9]{6}"
                  {...{ formData, handleChange }}
                />
              </div>
            </Section>

            {/* Bank */}
            <Section title="Bank Account Details">
              <Input
                name="bankAccount"
                label="Account Number"
                required
                {...{ formData, handleChange }}
              />
              <Input
                name="ifsc"
                label="IFSC Code"
                required
                {...{ formData, handleChange }}
              />
            </Section>

            {/* Declaration */}
            <div className="bg-btn/10 border border-btn rounded-[var(--radius)] p-4">
              <label className="flex gap-2 text-sm text-[var(--txt-dim)]">
                <input type="checkbox" required />I confirm that the above
                information is correct.
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <motion.button
                type="button"
                onClick={() => navigate("/schemes")}
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-[var(--txt-disabled)]/40 text-[var(--txt)] py-3 rounded-[var(--radius)]"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                className="
                  flex-1
                  bg-gradient-to-r
                  from-[var(--btn-hover)]
                  to-[var(--btn)]
                  text-white
                  py-3
                  rounded-[var(--radius)]
                  disabled:opacity-50
                "
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* 🔹 Small reusable helpers (optional but clean) */
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-[var(--bg-ter)]">
      {title}
    </h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, name, formData, handleChange, ...props }) => (
  <div>
    <label className="block font-medium mb-2">{label}</label>
    <input
      name={name}
      value={formData[name]}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-[var(--bg-ter)] rounded-[var(--radius)] border border-[var(--bg-ter)] focus:border-[var(--btn)] outline-none"
      {...props}
    />
  </div>
);

const Textarea = ({ label, name, formData, handleChange, ...props }) => (
  <div className="md:col-span-2">
    <label className="block font-medium mb-2">{label}</label>
    <textarea
      name={name}
      value={formData[name]}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-[var(--bg-ter)] rounded-[var(--radius)] border border-[var(--bg-ter)] focus:border-[var(--btn)] outline-none"
      {...props}
    />
  </div>
);

export default ApplyScheme;
