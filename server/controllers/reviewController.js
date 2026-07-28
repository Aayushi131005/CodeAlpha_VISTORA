import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const {
      productId,
      userId,
      name,
      rating,
      comment,
    } = req.body;

    if (
      !productId ||
      !userId ||
      !name ||
      !rating ||
      !comment?.trim()
    ) {
      return res.status(400).json({
        message: "All review fields are required",
      });
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check whether product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Prevent duplicate reviews
    const alreadyReviewed = await Review.findOne({
      productId,
      userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      productId,
      userId,
      name: name.trim(),
      rating: numericRating,
      comment: comment.trim(),
    });

    // Recalculate product rating
    const reviews = await Review.find({
      productId,
    });

    const numReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, currentReview) =>
        sum + currentReview.rating,
      0
    );

    const averageRating =
      numReviews > 0 ? totalRating / numReviews : 0;

    product.rating = Number(
      averageRating.toFixed(1)
    );

    product.numReviews = numReviews;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    console.error("Add review error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to submit review",
    });
  }
};

// Get Reviews of a Product
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to load reviews",
    });
  }
};