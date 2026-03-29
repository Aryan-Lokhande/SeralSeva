import express from "express";
import { getRecommendations } from "../controllers/recommendController.js";
// import { protect } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/", getRecommendations);

export default router;