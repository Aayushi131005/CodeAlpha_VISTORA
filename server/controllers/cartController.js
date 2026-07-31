import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((total, item) => {
    if (!item.productId) {
      return total;
    }

    return (
      total +
      Number(item.productId.price || 0) *
        Number(item.quantity || 0)
    );
  }, 0);

  const shipping =
    subtotal === 0 || subtotal >= 5000 ? 0 : 99;

  const tax =
    subtotal === 0
      ? 0
      : Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};

// Get a user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    // Remove cart entries whose products were deleted
    const invalidItems = cartItems.filter(
      (item) => !item.productId
    );

    if (invalidItems.length > 0) {
      await Cart.deleteMany({
        _id: {
          $in: invalidItems.map((item) => item._id),
        },
      });
    }

    const validItems = cartItems.filter(
      (item) => item.productId
    );

    const totals = calculateCartTotals(validItems);

    return res.status(200).json({
      items: validItems,
      ...totals,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message:
        error.message || "Failed to load cart",
    });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message:
          "User ID and product ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        message: "Invalid user or product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    let cartItem = await Cart.findOne({
      userId,
      productId,
    });

    if (cartItem) {
      if (cartItem.quantity >= stock) {
        return res.status(400).json({
          message:
            "Maximum available stock reached",
        });
      }

      cartItem.quantity += 1;
      await cartItem.save();

      await cartItem.populate("productId");

      return res.status(200).json(cartItem);
    }

    cartItem = await Cart.create({
      userId,
      productId,
      quantity: 1,
    });

    await cartItem.populate("productId");

    return res.status(201).json(cartItem);
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to add product to cart",
    });
  }
};

// Increase product quantity
export const increaseQty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    const cartItem = await Cart.findById(id).populate(
      "productId"
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (!cartItem.productId) {
      await Cart.findByIdAndDelete(id);

      return res.status(404).json({
        message: "Product is no longer available",
      });
    }

    const stock = Number(
      cartItem.productId.stock || 0
    );

    if (cartItem.quantity >= stock) {
      return res.status(400).json({
        message: "Maximum available stock reached",
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    return res.status(200).json(cartItem);
  } catch (error) {
    console.error(
      "Increase cart quantity error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to increase quantity",
    });
  }
};

// Decrease product quantity
export const decreaseQty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    const cartItem = await Cart.findById(id).populate(
      "productId"
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (cartItem.quantity <= 1) {
      return res.status(400).json({
        message:
          "Quantity cannot be less than one",
      });
    }

    cartItem.quantity -= 1;
    await cartItem.save();

    return res.status(200).json(cartItem);
  } catch (error) {
    console.error(
      "Decrease cart quantity error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to decrease quantity",
    });
  }
};

// Remove product from cart
export const removeCartItem = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    const cartItem =
      await Cart.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to remove cart item",
    });
  }
};