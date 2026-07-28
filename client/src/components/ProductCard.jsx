import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { addToCart } from "../api/cartApi";
import { addWishlist } from "../api/wishlistApi";

const ProductCard = ({ product }) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      await addToCart(product._id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Added to Cart 🛒");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const rating = Number(product.rating || 0);
  const reviewCount = Number(
    product.numReviews || 0
  );
  const stock = Number(product.stock || 0);
  const price = Number(product.price || 0);

  return (
    <Link
      to={`/product/${product._id}`}
      className="block h-full"
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/30">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
          />

          {/* Category */}
          <span className="absolute left-4 top-4 rounded-full border border-zinc-700 bg-zinc-950/90 px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur">
            {product.category || "Product"}
          </span>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-zinc-300 backdrop-blur transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            aria-label="Add to wishlist"
          >
            <Heart size={19} />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="min-h-[56px] text-lg font-bold leading-7 text-white line-clamp-2">
            {product.name}
          </h2>

          <p className="mt-2 min-h-[40px] text-sm leading-5 text-zinc-400 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1.5">
              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-sm font-bold text-white">
                {rating.toFixed(1)}
              </span>
            </div>

            <span className="text-xs text-zinc-500">
              {reviewCount}{" "}
              {reviewCount === 1
                ? "review"
                : "reviews"}
            </span>
          </div>

          {/* Stock */}
          <div className="mt-4">
            {stock > 0 ? (
              <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {stock} in stock
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                Out of stock
              </span>
            )}
          </div>

          {/* Price and Cart */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <div>
              <p className="text-xs text-zinc-500">
                Price
              </p>

              <p className="mt-1 text-2xl font-extrabold text-white">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCart}
              disabled={stock <= 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              <ShoppingCart size={17} />

              {stock > 0
                ? "Add"
                : "Unavailable"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;