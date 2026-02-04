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
    documents: [
      {
        type: String,
      },
    ],
    brochureUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationDeadline: {
      type: Date,
    },
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

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
