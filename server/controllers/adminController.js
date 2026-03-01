import Application from "../models/Application.js";
import Grievance from "../models/Grievance.js";
import ContactQuery from "../models/ContactQuery.js";
import User from "../models/User.js";

// @desc    Get badge counts for admin sidebar
// @route   GET /api/admin/badge-stats
// @access  Private/Admin
export const getBadgeStats = async (req, res) => {
  try {
    // Count unresolved applications (not approved/rejected)
    const pendingApplications = await Application.countDocuments({
      status: { $nin: ["Approved", "Rejected"] },
    });

    // Count unresolved grievances (not resolved/closed)
    const openGrievances = await Grievance.countDocuments({
      status: { $nin: ["Resolved", "Closed"] },
    });

    // Count open contact queries
    const openQueries = await ContactQuery.countDocuments({
      status: "Open",
    });

    res.status(200).json({
      success: true,
      data: {
        applications: pendingApplications,
        grievances: openGrievances,
        queries: openQueries,
      },
    });
  } catch (err) {
    console.error("Get badge stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badge statistics",
    });
  }
};

// @desc    Update admin settings (badge toggle)
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateAdminSettings = async (req, res) => {
  try {
    const { showSidebarBadges } = req.body;

    const user = await User.findById(req.user._id);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update admin settings
    user.adminSettings = {
      ...user.adminSettings,
      showSidebarBadges:
        showSidebarBadges !== undefined
          ? showSidebarBadges
          : (user.adminSettings?.showSidebarBadges ?? true),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: {
        showSidebarBadges: user.adminSettings.showSidebarBadges,
      },
    });
  } catch (err) {
    console.error("Update admin settings error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
