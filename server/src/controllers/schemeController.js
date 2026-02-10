import Scheme from "../models/Scheme.js";

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
export const getSchemes = async (req, res, next) => {
  try {
    const { category, search, isActive } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$text = { $search: search };
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public
export const getScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create scheme
// @route   POST /api/schemes
// @access  Private/Admin
export const createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);

    res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Private/Admin
export const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
export const deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scheme categories
// @route   GET /api/schemes/categories/all
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Scheme.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scheme statistics
// @route   GET /api/schemes/stats/overview
// @access  Public
export const getSchemeStats = async (req, res, next) => {
  try {
    const totalSchemes = await Scheme.countDocuments();
    const activeSchemes = await Scheme.countDocuments({ isActive: true });

    const categoryStats = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSchemes,
        activeSchemes,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
