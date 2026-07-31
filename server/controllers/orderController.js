import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const validOrderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const calculateOrderTotals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.productId?.price || 0);
    const quantity = Number(item.quantity || 0);

    return sum + price * quantity;
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

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    } = shippingAddress;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim() ||
      !country?.trim()
    ) {
      return res.status(400).json({
        message:
          "All shipping address fields are required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return res.status(400).json({
        message:
          "Please enter a valid 10-digit phone number",
      });
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        message:
          "Please enter a valid 6-digit pincode",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const invalidItems = cartItems.filter(
      (item) => !item.productId
    );

    if (invalidItems.length > 0) {
      await Cart.deleteMany({
        _id: {
          $in: invalidItems.map(
            (item) => item._id
          ),
        },
      });

      return res.status(400).json({
        message:
          "Some products in your cart are no longer available. Please review your cart.",
      });
    }

    for (const item of cartItems) {
      const product = item.productId;
      const quantity = Number(
        item.quantity || 0
      );
      const stock = Number(
        product.stock || 0
      );

      if (quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (stock <= 0) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      if (quantity > stock) {
        return res.status(400).json({
          message: `Only ${stock} units of ${product.name} are available`,
        });
      }
    }

    const products = cartItems.map(
      (item) => ({
        productId: item.productId._id,
        quantity: Number(item.quantity),
        price: Number(item.productId.price),
      })
    );

    const {
      subtotal,
      shipping,
      tax,
      total,
    } = calculateOrderTotals(cartItems);

    const order = await Order.create({
      userId,
      products,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: country.trim(),
      },
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    const stockUpdates = cartItems.map(
      (item) => ({
        updateOne: {
          filter: {
            _id: item.productId._id,
            stock: {
              $gte: Number(item.quantity),
            },
          },
          update: {
            $inc: {
              stock: -Number(item.quantity),
            },
          },
        },
      })
    );

    const stockResult =
      await Product.bulkWrite(stockUpdates);

    if (
      stockResult.modifiedCount !==
      cartItems.length
    ) {
      await Order.findByIdAndDelete(order._id);

      return res.status(400).json({
        message:
          "Stock changed while placing the order. Please try again.",
      });
    }

    await Cart.deleteMany({
      userId,
    });

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "products.productId"
        );

    return res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Place order error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to place order",
    });
  }
};

// Get My Orders
export const getMyOrders = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const orders = await Order.find({
      userId,
    })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get user orders error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to load orders",
    });
  }
};

// Get All Orders
export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate(
        "userId",
        "name email"
      )
      .populate(
        "products.productId"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to load orders",
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    if (!orderStatus) {
      return res.status(400).json({
        message: "Order status is required",
      });
    }

    if (
      !validOrderStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const existingOrder =
      await Order.findById(id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      existingOrder.orderStatus ===
      "Cancelled"
    ) {
      return res.status(400).json({
        message:
          "Cancelled orders cannot be updated",
      });
    }

    if (
      existingOrder.orderStatus ===
        "Delivered" &&
      orderStatus !== "Delivered"
    ) {
      return res.status(400).json({
        message:
          "Delivered orders cannot be changed",
      });
    }

    existingOrder.orderStatus =
      orderStatus;

    if (
      orderStatus === "Delivered" &&
      existingOrder.paymentMethod ===
        "COD"
    ) {
      existingOrder.paymentStatus =
        "Paid";
    }

    await existingOrder.save();

    const updatedOrder =
      await Order.findById(id)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "products.productId"
        );

    return res.status(200).json({
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update order status",
    });
  }
};