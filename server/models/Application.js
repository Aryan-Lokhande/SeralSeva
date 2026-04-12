import mongoose from "mongoose";
import crypto from "crypto";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
    applicationId: {
      type: String,
      unique: true,
      required: true,
      default: () => "APP-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
    personalInfo: {
      fullName: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      aadhar: {
        type: String,
        match: [/^[0-9]{12}$/, "Please provide valid 12-digit Aadhar number"],
      },
      pan: {
        type: String,
        match: [
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          "Please provide valid PAN number",
        ],
      },
      income: {
        type: Number,
      },
    },
    address: {
      fullAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, "Please provide valid 6-digit pincode"],
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
      },
      ifsc: {
        type: String,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please provide valid IFSC code"],
      },
    },
    // Dynamic Form Data
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Documents Required",
        "Approved",
        "Rejected",
      ],
      default: "Submitted",
    },
    remarks: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Generate unique application ID
applicationSchema.pre("save", function () {
  if (this.isNew && !this.applicationId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    this.applicationId = `APP${timestamp}${random}`;
  }
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
