import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitApplication } from "../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";

const ApplyScheme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const scheme = location.state?.scheme;

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
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
      return;
    }

    // Initialize form data with default values from scheme.formFields
    const initialData = {};
    if (scheme.formFields && scheme.formFields.length > 0) {
      scheme.formFields.forEach((field) => {
        initialData[field.name] = "";
      });
    } else {
      // Fallback for legacy schemes without formFields
      initialData.fullName = authUser?.name || "";
      initialData.email = authUser?.email || "";
      initialData.phone = authUser?.phone || "";
      initialData.address = "";
      initialData.city = "";
      initialData.state = "";
      initialData.pincode = "";
      initialData.aadhar = "";
      initialData.pan = "";
      initialData.income = "";
      initialData.bankAccount = "";
      initialData.ifsc = "";
    }
    setFormData(initialData);
  }, [isAuthenticated, scheme, navigate, authUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFiles((prev) => ({ ...prev, [docName]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validate required documents
    if (scheme.requiredDocuments) {
      const missingDocs = scheme.requiredDocuments
        .filter((doc) => doc.required && !files[doc.name])
        .map((doc) => doc.name);

      if (missingDocs.length > 0) {
        toast.error(
          `Please upload required documents: ${missingDocs.join(", ")}`,
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      // Prepare payload
      let applicationData;

      if (scheme.formFields && scheme.formFields.length > 0) {
        // Dynamic structure
        applicationData = {
          schemeId: scheme._id,
          formData: formData,
          // Extract some basic info for display/email if they exist in dynamic fields
          personalInfo: {
            fullName: formData.fullName || formData.name || authUser?.name,
            email: formData.email || authUser?.email,
            phone: formData.phone || authUser?.phone,
            aadhar: formData.aadhar,
            pan: formData.pan,
            income: formData.income ? parseInt(formData.income) : undefined,
          },
        };
      } else {
        // Legacy structure
        applicationData = {
          schemeId: scheme._id,
          personalInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            aadhar: formData.aadhar,
            pan: formData.pan || undefined,
            income: formData.income ? parseInt(formData.income) : undefined,
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
      }

      const response = await submitApplication(applicationData);

      if (response.success) {
        const applicationId = response.data._id;
        const fileList = Object.values(files);

        if (fileList.length > 0) {
          toast.loading("Uploading documents...", { id: "upload-toast" });
          try {
            await uploadApplicationDocuments(applicationId, fileList);
            toast.success("Documents uploaded successfully!", { id: "upload-toast" });
          } catch (uploadError) {
            toast.error("Application submitted, but document upload failed. You can upload them later from the dashboard.", { id: "upload-toast", duration: 5000 });
            console.error("Document upload error:", uploadError);
          }
        }

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

  // Group fields by section
  const sections = {};
  if (scheme.formFields && scheme.formFields.length > 0) {
    scheme.formFields.forEach((field) => {
      const sectionName = field.section || "General Information";
      if (!sections[sectionName]) sections[sectionName] = [];
      sections[sectionName].push(field);
    });
  } else {
    // Default sections for legacy
    sections["Personal Information"] = [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
        placeholder: "10-digit number",
      },
      {
        name: "aadhar",
        label: "Aadhar Number",
        type: "text",
        required: true,
        placeholder: "12-digit number",
      },
      { name: "pan", label: "PAN Number", type: "text", required: false },
      {
        name: "income",
        label: "Annual Income",
        type: "number",
        required: true,
      },
    ];
    sections["Address Details"] = [
      {
        name: "address",
        label: "Full Address",
        type: "textarea",
        required: true,
      },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
      {
        name: "pincode",
        label: "PIN Code",
        type: "text",
        required: true,
        placeholder: "6-digit code",
      },
    ];
    sections["Bank Account Details"] = [
      {
        name: "bankAccount",
        label: "Account Number",
        type: "text",
        required: true,
      },
      { name: "ifsc", label: "IFSC Code", type: "text", required: true },
    ];
  }

  return (
    <div className="min-h-screen py-8 bg-[var(--bg-primary)] text-[var(--txt)]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 ml-4 inline-flex items-center gap-2 text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r mb-8 from-[var(--btn)]/70 to-[var(--btn-hover)] p-8 rounded-[var(--radius)] shadow-lg"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Apply for Scheme
          </h1>
          <div className="text-gray-100 space-y-1">
            <p className="text-xl font-semibold">{scheme.title}</p>
            <p className="text-sm">Scheme Code: {scheme.code}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-sec)] rounded-[var(--radius)] shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(sections).map(([sectionTitle, fields]) => (
              <FormSection key={sectionTitle} title={sectionTitle}>
                {fields.map((field) => (
                  <DynamicField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </FormSection>
            ))}

            {/* Document Upload Section */}
            {scheme.requiredDocuments &&
              scheme.requiredDocuments.length > 0 && (
                <FormSection title="Required Documents">
                  <div className="md:col-span-2 space-y-4">
                    {scheme.requiredDocuments.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--bg-ter)] rounded-[var(--radius)] border border-[var(--bg-ter)]"
                      >
                        <div>
                          <p className="font-semibold">
                            {doc.name}{" "}
                            {doc.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </p>
                          {doc.description && (
                            <p className="text-sm text-[var(--txt-dim)]">
                              {doc.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--btn)] text-white rounded-md hover:bg-[var(--btn-hover)] transition-colors">
                            <Upload size={16} />
                            {files[doc.name] ? "Change File" : "Upload File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, doc.name)}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </label>
                          {files[doc.name] && (
                            <div className="mt-2 flex items-center gap-1 text-green-500 text-xs">
                              <CheckCircle size={12} /> {files[doc.name].name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSection>
              )}

            <div className="bg-[var(--btn)]/10 border border-[var(--btn)] rounded-[var(--radius)] p-4">
              <label className="flex gap-2 text-sm text-[var(--txt-dim)] cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span>
                  I confirm that all the information provided is true to the
                  best of my knowledge. I understand that any false information
                  may lead to rejection of my application.
                </span>
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/schemes")}
                className="flex-1 bg-[var(--txt-disabled)]/20 text-[var(--txt)] py-3 rounded-[var(--radius)] hover:bg-[var(--txt-disabled)]/30 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-[var(--btn-hover)] to-[var(--btn)] text-white py-3 rounded-[var(--radius)] disabled:opacity-50 font-semibold shadow-md"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold pb-2 border-b border-[var(--bg-ter)] text-[var(--btn)]">
      {title}
    </h3>
    <div className="grid md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const DynamicField = ({ field, value, onChange }) => {
  const { name, label, type, required, options, placeholder, validation } =
    field;

  const commonProps = {
    name,
    required,
    placeholder,
    onChange,
    className:
      "w-full px-4 py-3 bg-[var(--bg-ter)] rounded-[var(--radius)] border border-[var(--bg-ter)] focus:border-[var(--btn)] outline-none transition-all",
  };

  return (
    <div className={type === "textarea" ? "md:col-span-2" : ""}>
      <label className="block font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select {...commonProps} value={value || ""}>
          <option value="" disabled>
            Select {label}
          </option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea {...commonProps} value={value || ""} rows={4} />
      ) : type === "checkbox" ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={onChange}
            className="w-5 h-5 accent-[var(--btn)]"
          />
          <span className="text-sm text-[var(--txt-dim)]">
            {placeholder || label}
          </span>
        </div>
      ) : (
        <input
          type={type}
          {...commonProps}
          value={value || ""}
          pattern={validation}
        />
      )}
    </div>
  );
};

export default ApplyScheme;
