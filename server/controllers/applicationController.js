import Application from "../models/Application.js";
import Scheme from "../models/Scheme.js";

// @desc    Submit application
// @route   POST /api/applications
// @access  Private
export const submitApplication = async (req, res, next) => {
  try {
    const { schemeId, personalInfo, address, bankDetails } = req.body;

    // Check if scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      user: req.user.id,
      scheme: schemeId,
      status: { $in: ["Submitted", "Under Review", "Approved"] },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this scheme",
      });
    }

    // Create application
    const application = await Application.create({
      user: req.user.id,
      scheme: schemeId,
      personalInfo,
      address,
      bankDetails,
    });

    // Populate scheme details
    await application.populate("scheme", "title code category");

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user applications
// @route   GET /api/applications/my-applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate("scheme", "title code category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("scheme", "title code category benefits eligibility")
      .populate("user", "name email phone");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure user owns the application or is admin
    if (
      application.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this application",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application by application ID
// @route   GET /api/applications/track/:applicationId
// @access  Private
export const trackApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId,
    }).populate("scheme", "title code category");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure user owns the application or is admin
    if (
      application.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this application",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, scheme } = req.query;

    let query = {};
    if (status) query.status = status;
    if (scheme) query.scheme = scheme;

    const applications = await Application.find(query)
      .populate("scheme", "title code category")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    application.remarks = remarks;
    application.reviewedAt = Date.now();
    application.reviewedBy = req.user.id;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload application documents
// @route   POST /api/applications/:id/documents
// @access  Private
export const uploadDocuments = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure user owns the application
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload documents for this application",
      });
    }

    // Add uploaded files to documents array
    if (req.files && req.files.length > 0) {
      const documents = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      }));

      application.documents.push(...documents);
      await application.save();
    }

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application statistics (Admin)
// @route   GET /api/applications/stats/overview
// @access  Private/Admin
export const getApplicationStats = async (req, res, next) => {
  try {
    const totalApplications = await Application.countDocuments();

    const statusStats = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const schemeStats = await Application.aggregate([
      {
        $lookup: {
          from: "schemes",
          localField: "scheme",
          foreignField: "_id",
          as: "schemeDetails",
        },
      },
      { $unwind: "$schemeDetails" },
      {
        $group: {
          _id: "$schemeDetails.title",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        statusStats,
        popularSchemes: schemeStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
