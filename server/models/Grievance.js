import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Scheme Application Issue",
        "Payment Delay",
        "Document Verification",
        "Eligibility Concern",
        "Benefit Not Received",
        "Portal Technical Issue",
        "Other",
      ],
    },
    grievanceType: {
      type: String,
      required: [true, "Please select grievance type"],
      enum: ["Complaint", "Query", "Feedback", "Suggestion", "Appeal"],
    },
    schemeName: {
      type: String,
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    personalInfo: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      district: {
        type: String,
        required: [true, "District is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
      address: String,
    },
    attachments: [
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
      enum: ["Submitted", "Under Review", "In Progress", "Resolved", "Closed"],
      default: "Submitted",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timeline: [
      {
        status: String,
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    response: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  {
    timestamps: true,
  },
);

// Generate unique tracking ID
grievanceSchema.pre("save", async function () {
  if (this.isNew) {
    const timestamp = Date.now().toString().slice(-8);
    this.trackingId = `GRV${timestamp}`;

    this.timeline.push({
      status: "Submitted",
      description:
        "Your grievance has been successfully submitted and registered in our system.",
      timestamp: new Date(),
    });
  }
});


// Update timeline when status changes
grievanceSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    const statusDescriptions = {
      "Under Review":
        "Your grievance is being reviewed by the concerned department.",
      "In Progress": "Action is being taken to resolve your grievance.",
      Resolved: "Your grievance has been resolved.",
      Closed: "This grievance has been closed.",
    };

    this.timeline.push({
      status: this.status,
      description: statusDescriptions[this.status] || "Status updated",
      timestamp: new Date(),
    });

    if (this.status === "Resolved") {
      this.resolvedAt = new Date();
    }
  }
  // next();
});

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;
