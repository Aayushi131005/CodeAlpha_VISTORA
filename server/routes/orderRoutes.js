import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Place Order
router.post("/", placeOrder);

// Get My Orders
router.get("/my/:userId", getMyOrders);

// Get All Orders (Admin)
router.get("/", getAllOrders);

// Update Order Status
router.put("/:id", updateOrderStatus);

export default router;