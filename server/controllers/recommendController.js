import axios from "axios";
import Scheme from "../models/Scheme.js";
import dotenv from "dotenv";

dotenv.config();

// @desc    Get ML-based scheme recommendations
// @route   POST /api/recommend
// @access  Public (or protect if you want)
export const getRecommendations = async (req, res) => {
  try {
    const { income, category } = req.body;

    // Basic validation
    if (!income || !category) {
      return res.status(400).json({
        success: false,
        message: "Income and category are required",
      });
    }

    // 1. Fetch active schemes
    const schemes = await Scheme.find({ isActive: true }).lean();

    // 2. Call ML service
    const response = await axios.post(`${process.env.ML_URL}/recommend`, {
      user: { income, category },
      schemes,
    });

    res.status(200).json({
      success: true,
      data: response.data.recommendations,
    });
  } catch (err) {
    console.error("Recommendation Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
    });
  }
};
