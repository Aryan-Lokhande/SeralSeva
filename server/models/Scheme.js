import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide scheme title"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Please provide scheme code"],
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, "Please provide scheme description"],
    },
    category: {
      type: String,
      required: [true, "Please provide scheme category"],
      enum: [
        "Housing",
        "Healthcare",
        "Agriculture",
        "Social Security",
        "Women Empowerment",
        "Entrepreneurship",
        "Employment",
        "Education",
      ],
    },
    eligibility: {
      type: String,
      required: [true, "Please provide eligibility criteria"],
    },
    benefits: {
      type: String,
      required: [true, "Please provide benefit details"],
    },
    // Dynamic Form Fields
    formFields: [
      {
        name: { type: String, required: true },
        label: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: ["text", "number", "email", "date", "select", "textarea", "checkbox"],
        },
        required: { type: Boolean, default: false },
        options: [String], // For select type
        placeholder: { type: String },
        validation: { type: String }, // Regex pattern as string
        section: { type: String, default: "General" }, // To group fields
      },
    ],
    // Documents required for this scheme
    requiredDocuments: [
      {
        name: { type: String, required: true },
        description: { type: String },
        required: { type: Boolean, default: true },
      },
    ],
    brochureUrl: {
      type: String,
    },

    // Status Management
    isActive: {
      type: Boolean,
      default: true,
    },

    // Auto-deactivation
    applicationDeadline: {
      type: Date,
      default: null, // null = "forever active"
    },
    autoDeactivated: {
      type: Boolean,
      default: false, // Track if scheme was auto-closed
    },
    deactivatedAt: {
      type: Date,
      default: null,
    },

    // Statistics
    targetBeneficiaries: {
      type: Number,
    },
    currentBeneficiaries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
schemeSchema.index({ title: "text", description: "text", category: "text" });

// Virtual for checking if deadline passed
schemeSchema.virtual("isExpired").get(function () {
  if (!this.applicationDeadline) return false;
  return new Date() > this.applicationDeadline;
});

// Method to check and auto-deactivate if deadline passed
schemeSchema.methods.checkAndDeactivate = async function () {
  if (
    this.applicationDeadline &&
    new Date() > this.applicationDeadline &&
    this.isActive
  ) {
    this.isActive = false;
    this.autoDeactivated = true;
    this.deactivatedAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
