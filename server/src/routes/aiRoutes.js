import { Router } from "express";
import {
  getTravelRecommendation,
  getActivitySuggestions,
} from "../controllers/aiController.js";

const router = Router();

router.post("/recommend", getTravelRecommendation);
router.post("/activities", getActivitySuggestions);

export default router;
