import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    const cartItems = await Cart.find({ userId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const products = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const shipping =
      subtotal === 0 ? 0 : subtotal >= 1000 ? 0 : 99;

    const tax =
      subtotal === 0 ? 0 : Math.round(subtotal * 0.05);

    const total = subtotal + shipping + tax;

    const order = await Order.create({
      userId,
      products,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
    });

    // Clear user's cart
    await Cart.deleteMany({ userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};