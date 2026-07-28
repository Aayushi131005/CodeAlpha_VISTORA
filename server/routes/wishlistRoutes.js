import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Add product
router.post("/", addToWishlist);

// Get wishlist
router.get("/:userId", getWishlist);

// Clear wishlist
router.delete("/clear/:userId", clearWishlist);

// Remove one item
router.delete("/:id", removeWishlistItem);

export default router;