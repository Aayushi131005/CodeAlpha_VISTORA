import Wishlist from "../models/Wishlist.js";

// =========================
// Add Product to Wishlist
// =========================
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const exists = await Wishlist.findOne({
      userId,
      productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      userId,
      productId,
    });

    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// Get Wishlist
// =========================
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({
      userId,
    }).populate("productId");

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// Remove Product
// =========================
export const removeWishlistItem = async (
  req,
  res
) => {
  try {
    const item = await Wishlist.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.json({
      message: "Removed Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// Clear Wishlist
// =========================
export const clearWishlist = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    await Wishlist.deleteMany({
      userId,
    });

    res.json({
      message: "Wishlist Cleared",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};