import Grievance from "../models/Grievance.js";
import crypto from "crypto";

// @desc    Submit grievance
// @route   POST /api/grievances
// @access  Private
export const submitGrievance = async (req, res, next) => {
  try {
    const {
      category,
      grievanceType,
      schemeName,
      subject,
      description,
      personalInfo,
    } = req.body;

    const trackingId =
      "GRV-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const grievance = await Grievance.create({
      user: req.user.id,
      trackingId,
      category,
      grievanceType,
      schemeName,
      subject,
      description,
      personalInfo,
    });

    res.status(201).json({
      success: true,
      message: "Grievance submitted successfully",
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user grievances
// @route   GET /api/grievances/my-grievances
// @access  Private
export const getMyGrievances = async (req, res, next) => {
  try {
    const grievances = await Grievance.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track grievance by tracking ID
// @route   GET /api/grievances/track/:trackingId
// @access  Private
export const trackGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findOne({
      trackingId: req.params.trackingId,
    }).populate("assignedTo", "name email");

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found with this tracking ID",
      });
    }

    // Make sure user owns the grievance or is admin
    if (
      grievance.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this grievance",
      });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single grievance
// @route   GET /api/grievances/:id
// @access  Private
export const getGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedTo", "name email");

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    // Make sure user owns the grievance or is admin
    if (
      grievance.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this grievance",
      });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all grievances (Admin)
// @route   GET /api/grievances
// @access  Private/Admin
export const getAllGrievances = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const grievances = await Grievance.find(query)
      .populate("user", "name email phone")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grievance status (Admin)
// @route   PUT /api/grievances/:id/status
// @access  Private/Admin
export const updateGrievanceStatus = async (req, res, next) => {
  try {
    const { status, response } = req.body;

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    grievance.status = status;
    if (response) {
      grievance.response = response;
    }

    await grievance.save();

    res.status(200).json({
      success: true,
      message: "Grievance status updated successfully",
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign grievance to admin (Admin)
// @route   PUT /api/grievances/:id/assign
// @access  Private/Admin
export const assignGrievance = async (req, res, next) => {
  try {
    const { adminId, priority } = req.body;

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    grievance.assignedTo = adminId;
    if (priority) {
      grievance.priority = priority;
    }

    await grievance.save();

    res.status(200).json({
      success: true,
      message: "Grievance assigned successfully",
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload grievance attachments
// @route   POST /api/grievances/:id/attachments
// @access  Private
export const uploadAttachments = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    // Make sure user owns the grievance
    if (grievance.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload attachments for this grievance",
      });
    }

    // Add uploaded files to attachments array
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      }));

      grievance.attachments.push(...attachments);
      await grievance.save();
    }

    res.status(200).json({
      success: true,
      message: "Attachments uploaded successfully",
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback for grievance
// @route   POST /api/grievances/:id/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    // Make sure user owns the grievance
    if (grievance.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit feedback for this grievance",
      });
    }

    // Can only submit feedback if grievance is resolved
    if (grievance.status !== "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Can only submit feedback for resolved grievances",
      });
    }

    grievance.feedback = { rating, comment };
    await grievance.save();

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: grievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get grievance statistics (Admin)
// @route   GET /api/grievances/stats/overview
// @access  Private/Admin
export const getGrievanceStats = async (req, res, next) => {
  try {
    const totalGrievances = await Grievance.countDocuments();
    const resolvedGrievances = await Grievance.countDocuments({
      status: "Resolved",
    });
    const pendingGrievances = await Grievance.countDocuments({
      status: { $in: ["Submitted", "Under Review", "In Progress"] },
    });

    const statusStats = await Grievance.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const categoryStats = await Grievance.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const avgResolutionTime = await Grievance.aggregate([
      { $match: { resolvedAt: { $exists: true } } },
      {
        $project: {
          resolutionTime: {
            $subtract: ["$resolvedAt", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$resolutionTime" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalGrievances,
        resolvedGrievances,
        pendingGrievances,
        statusStats,
        categoryStats,
        avgResolutionTime: avgResolutionTime[0]?.avgTime || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
