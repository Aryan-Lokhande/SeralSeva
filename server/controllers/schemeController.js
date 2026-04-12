import Scheme from "../models/Scheme.js";

/* ================================
   GET ALL SCHEMES (WITH FILTER + EXPIRY CHECK)
================================ */
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

    const now = new Date();

    for (const scheme of schemes) {
      if (
        scheme.isActive &&
        scheme.applicationDeadline &&
        now > scheme.applicationDeadline &&
        !scheme.autoDeactivated
      ) {
        scheme.isActive = false;
        scheme.autoDeactivated = true;
        scheme.deactivatedAt = now;
        await scheme.save();
      }
    }

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   GET SINGLE SCHEME
================================ */
export const getScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const now = new Date();

    if (
      scheme.isActive &&
      scheme.applicationDeadline &&
      now > scheme.applicationDeadline &&
      !scheme.autoDeactivated
    ) {
      scheme.isActive = false;
      scheme.autoDeactivated = true;
      scheme.deactivatedAt = now;
      await scheme.save();
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   CREATE SCHEME
================================ */
export const createScheme = async (req, res, next) => {
  try {
    const {
      title,
      code,
      description,
      category,
      eligibility,
      benefits,
      formFields,
      requiredDocuments,
      isActive,
      applicationDeadline,
    } = req.body;

    if (
      !title ||
      !code ||
      !description ||
      !category ||
      !eligibility ||
      !benefits
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existing = await Scheme.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Scheme code already exists",
      });
    }

    const scheme = await Scheme.create({
      title,
      code: code.toUpperCase(),
      description,
      category,
      eligibility,
      benefits,
      formFields: formFields || [],
      requiredDocuments: requiredDocuments || [],
      isActive: isActive !== undefined ? isActive : true,
      applicationDeadline: applicationDeadline || null,
    });

    res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   UPDATE SCHEME
================================ */
export const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const now = new Date();
    const {
      title,
      code,
      description,
      category,
      eligibility,
      benefits,
      formFields,
      requiredDocuments,
      isActive,
      applicationDeadline,
    } = req.body;

    if (
      isActive === true &&
      applicationDeadline &&
      new Date(applicationDeadline) < now
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot activate scheme with past deadline. Update deadline first.",
      });
    }

    if (title) scheme.title = title;
    if (code) scheme.code = code.toUpperCase();
    if (description) scheme.description = description;
    if (category) scheme.category = category;
    if (eligibility) scheme.eligibility = eligibility;
    if (benefits) scheme.benefits = benefits;
    if (formFields) scheme.formFields = formFields;
    if (requiredDocuments) scheme.requiredDocuments = requiredDocuments;

    if (applicationDeadline !== undefined) {
      scheme.applicationDeadline = applicationDeadline || null;

      if (applicationDeadline && new Date(applicationDeadline) > now) {
        scheme.autoDeactivated = false;
        scheme.deactivatedAt = null;
      }
    }

    if (isActive !== undefined) {
      scheme.isActive = isActive;
      if (isActive === true) scheme.autoDeactivated = false;
    }

    await scheme.save();

    res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   DELETE SCHEME
================================ */
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

/* ================================
   GET CATEGORIES
================================ */
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

/* ================================
   GET SCHEME STATS
================================ */
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
