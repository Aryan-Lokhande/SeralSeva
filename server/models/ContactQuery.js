import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema(
  {
    // User Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Query Details
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
    },

    // Status Management
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },

    // Admin Response
    adminResponse: {
      type: String,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Create indexes for better query performance
contactQuerySchema.index({ status: 1 });
contactQuerySchema.index({ createdAt: -1 });
contactQuerySchema.index({ email: 1 });

export default mongoose.model("ContactQuery", contactQuerySchema);
