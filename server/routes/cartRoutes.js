import express from "express";

import {
  getCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

// Get user's cart
router.get("/", getCart);

// Add product to cart
router.post("/", addToCart);

// Increase quantity
router.put("/increase/:id", increaseQty);

// Decrease quantity
router.put("/decrease/:id", decreaseQty);

// Remove item
router.delete("/:id", removeCartItem);

export default router;