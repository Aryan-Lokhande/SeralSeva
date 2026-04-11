import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Package,
  Calendar,
  Plus,
  Trash2,
  Settings,
  FileText,
} from "lucide-react";
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

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "number", label: "Number Input" },
  { value: "email", label: "Email Input" },
  { value: "date", label: "Date Picker" },
  { value: "select", label: "Dropdown (Select)" },
  { value: "textarea", label: "Text Area" },
  { value: "checkbox", label: "Checkbox" },
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
  "Husband's Death Certificate",
  "Birth Certificate",
  "Parent's Aadhar",
  "Property Documents",
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
    formFields: [],
    requiredDocuments: [],
    isActive: true,
    applicationDeadline: "",
    foreverActive: true,
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

        // Handle migration from old 'documents' (string array) to 'requiredDocuments' (object array)
        let docs = s.requiredDocuments || [];
        if (docs.length === 0 && s.documents && s.documents.length > 0) {
          docs = s.documents.map((d) => ({
            name: typeof d === "string" ? d : d.name,
            description: "",
            required: true,
          }));
        }

        setForm({
          title: s.title || "",
          code: s.code || "",
          description: s.description || "",
          category: s.category || "",
          eligibility: s.eligibility || "",
          benefits: s.benefits || "",
          formFields: s.formFields || [],
          requiredDocuments: docs,
          isActive: s.isActive !== undefined ? s.isActive : true,
          applicationDeadline: s.applicationDeadline
            ? new Date(s.applicationDeadline).toISOString().split("T")[0]
            : "",
          foreverActive: !s.applicationDeadline,
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
    if (name === "foreverActive") {
      setForm((prev) => ({
        ...prev,
        foreverActive: checked,
        applicationDeadline: checked ? "" : prev.applicationDeadline,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // --- Dynamic Form Fields Handlers ---
  const addFormField = () => {
    setForm((prev) => ({
      ...prev,
      formFields: [
        ...prev.formFields,
        {
          name: "",
          label: "",
          type: "text",
          required: true,
          section: "General",
          options: [],
          placeholder: "",
        },
      ],
    }));
  };

  const removeFormField = (index) => {
    setForm((prev) => ({
      ...prev,
      formFields: prev.formFields.filter((_, i) => i !== index),
    }));
  };

  const updateFormField = (index, field, value) => {
    const updatedFields = [...form.formFields];
    if (field === "options" && typeof value === "string") {
      updatedFields[index][field] = value.split(",").map((s) => s.trim());
    } else {
      updatedFields[index][field] = value;
    }
    setForm((prev) => ({ ...prev, formFields: updatedFields }));
  };

  // --- Required Documents Handlers ---
  const addDocument = () => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: [
        ...prev.requiredDocuments,
        { name: "", description: "", required: true },
      ],
    }));
  };

  const removeDocument = (index) => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== index),
    }));
  };

  const updateDocument = (index, field, value) => {
    const updatedDocs = [...form.requiredDocuments];
    updatedDocs[index][field] = value;
    setForm((prev) => ({ ...prev, requiredDocuments: updatedDocs }));
  };

  const handleCommonDocToggle = (docName) => {
    setForm((prev) => {
      const exists = prev.requiredDocuments.find((d) => d.name === docName);
      if (exists) {
        return {
          ...prev,
          requiredDocuments: prev.requiredDocuments.filter(
            (d) => d.name !== docName,
          ),
        };
      } else {
        return {
          ...prev,
          requiredDocuments: [
            ...prev.requiredDocuments,
            { name: docName, description: "", required: true },
          ],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.code || !form.category || !form.description || !form.eligibility || !form.benefits) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        applicationDeadline: form.foreverActive
          ? null
          : form.applicationDeadline,
      };

      delete payload.foreverActive;

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
      <div className="flex items-center justify-center min-h-screen text-[var(--txt-dim)]">
        Loading scheme...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/admin/schemes")}
          className="flex items-center space-x-2 text-[var(--txt-dim)] hover:text-[var(--txt)] mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> <span>Back to Schemes</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-xl flex items-center justify-center shadow-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--txt)]">
              {mode === "add" ? "Add New Scheme" : "Edit Scheme"}
            </h1>
            <p className="text-[var(--txt-dim)]">
              Define scheme details, dynamic form fields, and required
              documents.
            </p>
          </div>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <Card title="Basic Information" icon={<FileText size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>Scheme Title *</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Pradhan Mantri Awas Yojana"
                />
              </div>
              <div>
                <Label>Scheme Code *</Label>
                <Input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. PMAY-2024"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Description *</Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the scheme..."
                />
              </div>
            </div>
          </Card>

          {/* Dynamic Form Fields */}
          <Card
            title="Application Form Builder"
            icon={<Settings size={20} />}
            action={
              <button
                type="button"
                onClick={addFormField}
                className="text-sm flex items-center gap-1 px-3 py-1 bg-[var(--btn)] text-white rounded-md hover:bg-[var(--btn-hover)]"
              >
                <Plus size={14} /> Add Field
              </button>
            }
          >
            <div className="space-y-4">
              <AnimatePresence>
                {form.formFields.map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 bg-[var(--bg-ter)] rounded-lg border border-[var(--bg-ter)] space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-[var(--btn)]">
                        Field #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFormField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Label *</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateFormField(index, "label", e.target.value)
                          }
                          placeholder="e.g. Annual Income"
                        />
                      </div>
                      <div>
                        <Label>Field Name (ID) *</Label>
                        <Input
                          value={field.name}
                          onChange={(e) =>
                            updateFormField(index, "name", e.target.value)
                          }
                          placeholder="e.g. annualIncome"
                        />
                      </div>
                      <div>
                        <Label>Field Type *</Label>
                        <Select
                          value={field.type}
                          onChange={(e) =>
                            updateFormField(index, "type", e.target.value)
                          }
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Label>Section Group</Label>
                        <Input
                          value={field.section}
                          onChange={(e) =>
                            updateFormField(index, "section", e.target.value)
                          }
                          placeholder="e.g. Personal Info"
                        />
                      </div>
                      {field.type === "select" && (
                        <div className="md:col-span-2">
                          <Label>Options (comma separated)</Label>
                          <Input
                            value={field.options?.join(", ")}
                            onChange={(e) =>
                              updateFormField(index, "options", e.target.value)
                            }
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              updateFormField(
                                index,
                                "required",
                                e.target.checked,
                              )
                            }
                            className="accent-[var(--btn)]"
                          />
                          <span className="text-sm">Required Field</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {form.formFields.length === 0 && (
                <div className="text-center py-8 text-[var(--txt-dim)] border-2 border-dashed border-[var(--bg-ter)] rounded-lg">
                  No dynamic fields defined. Application will use default
                  fields.
                </div>
              )}
            </div>
          </Card>

          {/* Required Documents */}
          <Card
            title="Required Documents"
            icon={<FileText size={20} />}
            action={
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, requiredDocuments: [] }))
                }
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            }
          >
            <div className="space-y-6">
              {/* Common Docs Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-[var(--bg-ter)] rounded-xl border border-[var(--bg-ter)]">
                {COMMON_DOCS.map((doc) => (
                  <label
                    key={doc}
                    className="flex items-center gap-2 cursor-pointer hover:text-[var(--btn)] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.requiredDocuments.some(
                        (d) => d.name === doc,
                      )}
                      onChange={() => handleCommonDocToggle(doc)}
                      className="accent-[var(--btn)] w-4 h-4"
                    />
                    <span className="text-sm">{doc}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-[var(--txt-dim)]">
                  Additional / Custom Documents
                </h4>
                <button
                  type="button"
                  onClick={addDocument}
                  className="text-sm flex items-center gap-1 px-3 py-1 bg-[var(--btn)] text-white rounded-md hover:bg-[var(--btn-hover)]"
                >
                  <Plus size={14} /> Add Custom
                </button>
              </div>

              <div className="space-y-4">
                {form.requiredDocuments
                  .filter((d) => !COMMON_DOCS.includes(d.name))
                  .map((doc, index) => {
                    // Find actual index in form.requiredDocuments for updateDocument
                    const realIndex = form.requiredDocuments.findIndex(
                      (rd) => rd === doc,
                    );
                    return (
                      <div
                        key={index}
                        className="flex gap-4 items-start p-4 bg-[var(--bg-ter)] rounded-lg border border-[var(--bg-ter)]"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={doc.name}
                            onChange={(e) =>
                              updateDocument(realIndex, "name", e.target.value)
                            }
                            placeholder="Document Name"
                          />
                          <Input
                            value={doc.description}
                            onChange={(e) =>
                              updateDocument(
                                realIndex,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Brief Description"
                          />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={doc.required}
                              onChange={(e) =>
                                updateDocument(
                                  realIndex,
                                  "required",
                                  e.target.checked,
                                )
                              }
                              className="accent-[var(--btn)]"
                            />
                            <span className="text-xs">Req.</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeDocument(realIndex)}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Eligibility & Benefits">
            <div className="space-y-4">
              <div>
                <Label>Eligibility Criteria *</Label>
                <Textarea
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Who can apply?"
                />
              </div>
              <div>
                <Label>Benefits *</Label>
                <Textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows={5}
                  placeholder="What are the benefits?"
                />
              </div>
            </div>
          </Card>

          <Card title="Publishing Settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Active Status</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, isActive: !p.isActive }))
                  }
                  className={`w-12 h-6 rounded-full relative transition-colors ${form.isActive ? "bg-green-500" : "bg-gray-400"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isActive ? "translate-x-7" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--bg-ter)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="foreverActive"
                    checked={form.foreverActive}
                    onChange={handleChange}
                    className="accent-[var(--btn)]"
                  />
                  <span className="text-sm">No Deadline (Forever Active)</span>
                </label>
                {!form.foreverActive && (
                  <div>
                    <Label>Application Deadline</Label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={form.applicationDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[var(--bg-ter)] border border-[var(--bg-ter)] rounded-md focus:border-[var(--btn)] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[var(--btn)] text-white rounded-xl font-bold hover:bg-[var(--btn-hover)] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={18} />{" "}
              {loading
                ? "Saving..."
                : mode === "add"
                  ? "Create Scheme"
                  : "Update Scheme"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/schemes")}
              className="w-full py-4 bg-[var(--bg-ter)] text-[var(--txt)] rounded-xl font-bold hover:bg-[var(--bg-ter)]/80 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// --- Local UI Components ---
const Card = ({ title, icon, children, action }) => (
  <div className="bg-[var(--bg-sec)] rounded-2xl shadow-xl overflow-hidden border border-[var(--bg-ter)]">
    <div className="px-6 py-4 bg-[var(--bg-ter)]/50 border-b border-[var(--bg-ter)] flex justify-between items-center">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--btn)]">{icon}</span>}
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      {action && action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-semibold mb-2 text-[var(--txt-dim)]">
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-[var(--bg-ter)] border border-[var(--bg-ter)] rounded-xl focus:border-[var(--btn)] outline-none transition-all placeholder:text-[var(--txt-disabled)]"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full px-4 py-3 bg-[var(--bg-ter)] border border-[var(--bg-ter)] rounded-xl focus:border-[var(--btn)] outline-none transition-all"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 bg-[var(--bg-ter)] border border-[var(--bg-ter)] rounded-xl focus:border-[var(--btn)] outline-none transition-all placeholder:text-[var(--txt-disabled)] resize-none"
    rows={3}
  />
);

export default SchemeForm;
