import express from "express";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all products (supports search, category & sorting)
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Add product
router.post("/", addProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;