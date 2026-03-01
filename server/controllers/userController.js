import User from '../models/User.js';
import Application from '../models/Application.js';
import Grievance from '../models/Grievance.js';

// @desc    Get user by ID with stats (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's application and grievance counts
    const [applicationsCount, grievancesCount, applications, grievances] = await Promise.all([
      Application.countDocuments({ user: user._id }),
      Grievance.countDocuments({ user: user._id }),
      // Optional: Get recent applications (last 5)
      Application.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('scheme', 'title code')
        .select('applicationId status createdAt scheme'),
      // Optional: Get recent grievances (last 5)
      Grievance.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('trackingId subject status category createdAt'),
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
    console.error('Get user by ID error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};