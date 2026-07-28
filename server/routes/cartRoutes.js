import express from "express";

import {
  getCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);

router.post("/", addToCart);

router.put("/increase/:id", increaseQty);

router.put("/decrease/:id", decreaseQty);

router.delete("/:id", removeCartItem);

export default router;