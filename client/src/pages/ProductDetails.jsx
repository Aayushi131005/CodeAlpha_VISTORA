import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { getProduct } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { addWishlist } from "../api/wishlistApi";
import {
  getReviews,
  addReview,
} from "../api/reviewApi";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await getReviews(id);

      setReviews(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      await addToCart(product._id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Product added to Cart 🛒");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addWishlist({
        userId: user._id,
        productId: product._id,
      });

      alert("Added to Wishlist ❤️");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Already in Wishlist"
      );
    }
  };

  const handleReview = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!user._id) {
      alert(
        "User information is missing. Please logout and login again."
      );
      return;
    }

    if (!user.name) {
      alert(
        "User name is missing. Please logout and login again."
      );
      return;
    }

    if (!comment.trim()) {
      alert("Write a review");
      return;
    }

    try {
      setReviewLoading(true);

      await addReview({
        productId: id,
        userId: user._id,
        name: user.name,
        rating: Number(rating),
        comment: comment.trim(),
      });

      alert("Review added successfully ⭐");

      setComment("");
      setRating(5);

      await Promise.all([
        loadProduct(),
        loadReviews(),
      ]);
    } catch (err) {
      console.error(
        "Review submission error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

            <h1 className="mt-5 text-xl font-semibold">
              Loading product...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-900 py-20 text-center">
          <h1 className="text-3xl font-bold">
            Product not found
          </h1>

          <p className="mt-2 text-zinc-400">
            This product may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const displayedRating = Number(
    product.rating || 0
  ).toFixed(1);

  const stock = Number(product.stock || 0);
  const price = Number(product.price || 0);
  const reviewCount = Number(
    product.numReviews || 0
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Product Section */}
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full object-contain p-8 sm:h-[520px]"
            />

            <button
              type="button"
              onClick={handleWishlist}
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-zinc-300 backdrop-blur transition hover:border-red-500 hover:bg-red-500 hover:text-white"
              aria-label="Add to wishlist"
            >
              <Heart size={22} />
            </button>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              {product.category || "Product"}
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="font-bold">
                  {displayedRating}
                </span>
              </div>

              <span className="text-sm text-zinc-400">
                {reviewCount}{" "}
                {reviewCount === 1
                  ? "review"
                  : "reviews"}
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              {product.description}
            </p>

            <div className="mt-8 border-y border-zinc-800 py-6">
              <p className="text-sm text-zinc-500">
                Price
              </p>

              <h2 className="mt-1 text-4xl font-extrabold">
                ₹{price.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-sm text-zinc-400">
                Availability
              </span>

              {stock > 0 ? (
                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                  {stock} in stock
                </span>
              ) : (
                <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                  Out of stock
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                <ShoppingCart size={20} />

                {stock > 0
                  ? "Add To Cart"
                  : "Out of Stock"}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-4 font-semibold text-white transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <Heart size={20} />
                Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* Review Form */}
        <section className="mt-16">
          {user ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                  Share your experience
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Write a Review
                </h2>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Rating
                  </label>

                  <select
                    value={rating}
                    onChange={(e) =>
                      setRating(
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value={5}>
                      ⭐⭐⭐⭐⭐ 5 Stars
                    </option>

                    <option value={4}>
                      ⭐⭐⭐⭐ 4 Stars
                    </option>

                    <option value={3}>
                      ⭐⭐⭐ 3 Stars
                    </option>

                    <option value={2}>
                      ⭐⭐ 2 Stars
                    </option>

                    <option value={1}>
                      ⭐ 1 Star
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Review
                  </label>

                  <textarea
                    rows="5"
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    placeholder="Write your review..."
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleReview}
                  disabled={reviewLoading}
                  className="w-fit rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {reviewLoading
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <h2 className="text-xl font-bold">
                Want to write a review?
              </h2>

              <p className="mt-2 text-zinc-400">
                Please login to submit a review.
              </p>
            </div>
          )}
        </section>

        {/* Customer Reviews */}
        <section className="mt-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                Feedback
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Customer Reviews
              </h2>
            </div>

            <p className="text-sm text-zinc-400">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"}
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              No reviews yet.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-2">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-bold">
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 leading-7 text-zinc-300">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;