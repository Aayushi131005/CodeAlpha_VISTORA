import express from "express";
import {
  addReview,
  getReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// Add Review
router.post("/", addReview);

// Get Reviews for a Product
router.get("/:productId", getReviews);

export default router;