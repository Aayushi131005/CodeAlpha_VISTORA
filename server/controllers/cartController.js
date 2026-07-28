import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find().populate("productId");

    let subtotal = 0;

    cart.forEach((item) => {
      subtotal += item.productId.price * item.quantity;
    });

    // Free shipping only on orders >= ₹5000
    let shipping = 0;

    if (subtotal === 0) {
      shipping = 0;
    } else if (subtotal >= 5000) {
      shipping = 0;
    } else {
      shipping = 99;
    }

    const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05);

    const total = subtotal + shipping + tax;

    res.json({
      items: cart,
      subtotal,
      shipping,
      tax,
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({
      userId,
      productId,
    });

    if (cart) {
      cart.quantity += 1;
      await cart.save();
      return res.json(cart);
    }

    cart = await Cart.create({
      userId,
      productId,
      quantity: 1,
    });

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const increaseQty = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    cart.quantity++;

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const decreaseQty = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (cart.quantity > 1) {
      cart.quantity--;
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Removed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};