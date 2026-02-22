import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Package } from "lucide-react";
import { createScheme, getSchemeById, updateScheme } from "../../utils/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Housing",
  "Healthcare",
  "Agriculture",
  "Social Security",
  "Women Empowerment",
  "Entrepreneurship",
  "Employment",
  "Education",
];
const COMMON_DOCS = [
  "Aadhar Card",
  "PAN Card",
  "Income Certificate",
  "Ration Card",
  "Bank Account Details",
  "Address Proof",
  "Passport Photo",
  "Caste Certificate",
  "Disability Certificate",
  "Land Documents",
];

const SchemeForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingScheme, setFetchingScheme] = useState(mode === "edit");

  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
    category: "",
    eligibility: "",
    benefits: "",
    documents: [],
    isActive: true,
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      loadScheme();
    }
  }, [id, mode]);

  const loadScheme = async () => {
    try {
      setFetchingScheme(true);
      const res = await getSchemeById(id);
      if (res.success) {
        const s = res.data;
        setForm({
          title: s.title || "",
          code: s.code || "",
          description: s.description || "",
          category: s.category || "",
          eligibility: s.eligibility || "",
          benefits: s.benefits || "",
          documents: s.documents || [],
          isActive: s.isActive !== undefined ? s.isActive : true,
        });
      }
    } catch (err) {
      toast.error("Failed to load scheme");
    } finally {
      setFetchingScheme(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDocToggle = (doc) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.includes(doc)
        ? prev.documents.filter((d) => d !== doc)
        : [...prev.documents, doc],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.code ||
      !form.description ||
      !form.category ||
      !form.eligibility ||
      !form.benefits
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form, code: form.code.toUpperCase() };
      const res =
        mode === "add"
          ? await createScheme(payload)
          : await updateScheme(id, payload);
      if (res.success) {
        toast.success(
          `Scheme ${mode === "add" ? "created" : "updated"} successfully!`,
        );
        navigate("/admin/schemes");
      } else {
        toast.error(res.message || "Failed to save scheme");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save scheme");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingScheme) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-txt-dim">Loading scheme...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-bg-primary min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate("/admin/schemes")}
          className="flex items-center space-x-2 text-txt-dim hover:text-txt mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Schemes</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-btn to-btn-hover rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-txt">
              {mode === "add" ? "Add New Scheme" : "Edit Scheme"}
            </h1>
            <p className="text-txt-dim text-sm">
              {mode === "add"
                ? "Create a new government scheme"
                : `Editing: ${form.title}`}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-bg-sec border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-txt mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-txt mb-1">
                    Scheme Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Pradhan Mantri Awas Yojana"
                    className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt placeholder-txt-disabled focus:outline-none focus:border-btn"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt mb-1">
                      Scheme Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="e.g. PMAY-2024"
                      className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt placeholder-txt-disabled focus:outline-none focus:border-btn uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt focus:outline-none focus:border-btn"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of the scheme..."
                    className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt placeholder-txt-disabled focus:outline-none focus:border-btn resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Eligibility & Benefits */}
            <div className="bg-bg-sec border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-txt mb-4">
                Eligibility & Benefits
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-txt mb-1">
                    Eligibility Criteria <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Who is eligible for this scheme? Include income limits, age criteria, etc."
                    className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt placeholder-txt-disabled focus:outline-none focus:border-btn resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt mb-1">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="benefits"
                    value={form.benefits}
                    onChange={handleChange}
                    rows="4"
                    placeholder="What benefits will the applicant receive? Include amounts, subsidies, etc."
                    className="w-full px-4 py-2.5 bg-bg-ter border border-[var(--border)] rounded-lg text-txt placeholder-txt-disabled focus:outline-none focus:border-btn resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-bg-sec border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-txt mb-4">
                Required Documents
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_DOCS.map((doc) => (
                  <label
                    key={doc}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-bg-ter transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.documents.includes(doc)}
                      onChange={() => handleDocToggle(doc)}
                      className="w-4 h-4 text-btn border-gray-300 rounded focus:ring-btn"
                    />
                    <span className="text-sm text-txt">{doc}</span>
                  </label>
                ))}
              </div>
              {form.documents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <p className="text-xs text-txt-dim mb-2">
                    Selected ({form.documents.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.documents.map((doc) => (
                      <span
                        key={doc}
                        className="px-2.5 py-1 bg-accent text-txt text-xs rounded-full"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-5">
            <div className="bg-bg-sec border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-txt mb-4">Scheme Status</h3>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-txt">Active Status</p>
                  <p className="text-xs text-txt-dim mt-0.5">
                    Inactive schemes won't appear to users
                  </p>
                </div>
                <div
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${form.isActive ? "bg-btn" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-7" : "translate-x-1"}`}
                  />
                </div>
              </label>
              <p
                className={`text-sm font-medium mt-3 ${form.isActive ? "text-green-600" : "text-red-500"}`}
              >
                {form.isActive
                  ? "● Active - Visible to users"
                  : "● Inactive - Hidden from users"}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-accent border border-btn/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-txt mb-3">
                Scheme Summary
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-txt-dim">Title:</span>
                  <span className="text-txt font-medium truncate ml-2">
                    {form.title || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-txt-dim">Code:</span>
                  <span className="text-txt font-mono font-medium">
                    {form.code ? form.code.toUpperCase() : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-txt-dim">Category:</span>
                  <span className="text-txt font-medium">
                    {form.category || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-txt-dim">Documents:</span>
                  <span className="text-txt font-medium">
                    {form.documents.length} selected
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-btn hover:bg-btn-hover text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>
                  {loading
                    ? "Saving..."
                    : mode === "add"
                      ? "Create Scheme"
                      : "Update Scheme"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/schemes")}
                className="w-full px-6 py-3 border border-[var(--border)] rounded-lg text-txt-dim hover:bg-bg-ter transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SchemeForm;
