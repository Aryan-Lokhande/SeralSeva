import ContactQuery from "../models/ContactQuery.js";
import { validationResult } from "express-validator";

// @desc    Submit a contact query (PUBLIC - anyone can submit)
// @route   POST /api/contact
// @access  Public
export const submitContactQuery = async (req, res) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Create new contact query
    const query = await ContactQuery.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message:
        "Your query has been submitted. We will get back to you shortly.",
      data: {
        id: query._id,
        subject: query.subject,
        status: query.status,
      },
    });
  } catch (err) {
    console.error("Submit contact query error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit query. Please try again.",
    });
  }
};

// @desc    Get all contact queries (ADMIN ONLY)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContactQueries = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    // Fetch queries with admin details populated
    const queries = await ContactQuery.find(filter)
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
    });
  } catch (err) {
    console.error("Get all queries error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact queries",
    });
  }
};

// @desc    Get single contact query by ID (ADMIN ONLY)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactQueryById = async (req, res) => {
  try {
    const query = await ContactQuery.findById(req.params.id).populate(
      "resolvedBy",
      "name email",
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      data: query,
    });
  } catch (err) {
    console.error("Get query by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch query",
    });
  }
};

// @desc    Resolve a contact query (ADMIN ONLY)
// @route   PUT /api/contact/:id/resolve
// @access  Private/Admin
export const resolveContactQuery = async (req, res) => {
  try {
    const { response } = req.body;

    // Validate response text
    if (!response || !response.trim()) {
      return res.status(400).json({
        success: false,
        message: "Response is required",
      });
    }

    // Find the query
    const query = await ContactQuery.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    // Check if already resolved
    if (query.status === "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Query is already resolved",
      });
    }

    // Update query with admin response
    query.status = "Resolved";
    query.adminResponse = response.trim();
    query.resolvedBy = req.user._id; // From auth middleware
    query.resolvedAt = new Date();

    await query.save();

    // Populate resolvedBy before sending response
    await query.populate("resolvedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Query resolved successfully",
      data: query,
    });
  } catch (err) {
    console.error("Resolve query error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to resolve query",
    });
  }
};

// @desc    Delete a contact query (ADMIN ONLY - optional)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactQuery = async (req, res) => {
  try {
    const query = await ContactQuery.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    await query.deleteOne();

    res.status(200).json({
      success: true,
      message: "Query deleted successfully",
    });
  } catch (err) {
    console.error("Delete query error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete query",
    });
  }
};
