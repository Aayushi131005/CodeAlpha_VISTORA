import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Package,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";

import {
  getWishlist,
  removeWishlist,
} from "../api/wishlistApi";

import { addToCart } from "../api/cartApi";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const loadWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getWishlist(user._id);

      setItems(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const moveToCart = async (item) => {
    const product = item.productId;

    if (!product?._id) {
      alert("Product is unavailable");
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      await addToCart(product._id);
      await removeWishlist(item._id);

      setItems((currentItems) =>
        currentItems.filter(
          (wishlistItem) =>
            wishlistItem._id !== item._id
        )
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Moved to Cart 🛒");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to move item"
      );
    }
  };

  const removeItem = async (id) => {
    try {
      await removeWishlist(id);

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item._id !== id
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN"
    );

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <Heart size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Login Required
          </h1>

          <p className="mt-3 text-zinc-400">
            Please login to view your saved
            products.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

          <h2 className="mt-5 text-xl font-semibold">
            Loading wishlist...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-76px)] w-full bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-400">
              Saved Products
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-rose-400">
                <Heart size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                My Wishlist
              </h1>
            </div>

            <p className="mt-3 text-zinc-400">
              Keep your favourite products in one
              place.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}{" "}
            saved
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-20 text-center shadow-xl shadow-black/20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400">
              <Heart size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Your Wishlist Is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              Save products you love and return to
              them anytime.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const product =
                item.productId || {};

              const stock = Number(
                product.stock || 0
              );

              const rating = Number(
                product.rating || 0
              );

              return (
                <article
                  key={item._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-zinc-700"
                >
                  {/* Product image */}
                  <Link
                    to={
                      product._id
                        ? `/product/${product._id}`
                        : "#"
                    }
                    className="relative block h-64 overflow-hidden bg-white"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={
                          product.name ||
                          "Product"
                        }
                        className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">
                        <Package size={42} />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full border border-zinc-700 bg-zinc-950/90 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                      {product.category ||
                        "Product"}
                    </span>
                  </Link>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col p-5">
                    <Link
                      to={
                        product._id
                          ? `/product/${product._id}`
                          : "#"
                      }
                    >
                      <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-white transition hover:text-blue-400">
                        {product.name ||
                          "Product unavailable"}
                      </h2>
                    </Link>

                    <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-zinc-400">
                      {product.description ||
                        "No description available."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1.5">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="text-sm font-bold">
                            {rating.toFixed(1)}
                          </span>
                        </div>

                        <span className="text-xs text-zinc-500">
                          {Number(
                            product.numReviews || 0
                          )}{" "}
                          reviews
                        </span>
                      </div>

                      {stock > 0 ? (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Price
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-blue-400">
                        ₹
                        {formatPrice(
                          product.price
                        )}
                      </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item._id)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={17} />
                        Remove
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveToCart(item)
                        }
                        disabled={stock <= 0}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                      >
                        <ShoppingCart size={17} />
                        {stock > 0
                          ? "Move to Cart"
                          : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;