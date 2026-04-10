import User from "../models/User.js";
import Application from "../models/Application.js";
import Grievance from "../models/Grievance.js";
import { escapeRegex } from "../utils/regexUtils.js";

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    const query = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      // Validate search length to prevent abuse
      if (search.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search query too long",
        });
      }
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { phone: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // 1. Explicit validation for defense-in-depth
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'.",
      });
    }

    // 2. Prevent self-demotion/self-role-change
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role. Please contact another administrator.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// @desc    Update user status (admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Update user status error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optionally: check if trying to delete yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// @desc    Get user by ID with stats (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's application and grievance counts
    const [applicationsCount, grievancesCount, applications, grievances] =
      await Promise.all([
        Application.countDocuments({ user: user._id }),
        Grievance.countDocuments({ user: user._id }),
        // Optional: Get recent applications (last 5)
        Application.find({ user: user._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("scheme", "title code")
          .select("applicationId status createdAt scheme"),
        // Optional: Get recent grievances (last 5)
        Grievance.find({ user: user._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("trackingId subject status category createdAt"),
      ]);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          applications: applicationsCount,
          grievances: grievancesCount,
        },
        recentApplications: applications, // Optional: recent activity
        recentGrievances: grievances, // Optional: recent activity
      },
    });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
