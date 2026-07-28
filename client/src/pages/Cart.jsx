import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  getCart,
  removeCart,
  increaseQty,
  decreaseQty,
} from "../api/cartApi";

const emptyCart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

const Cart = () => {
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      setCart({
        items: Array.isArray(data?.items)
          ? data.items
          : [],
        subtotal: Number(data?.subtotal || 0),
        shipping: Number(data?.shipping || 0),
        tax: Number(data?.tax || 0),
        total: Number(data?.total || 0),
      });
    } catch (err) {
      console.error(
        "Failed to load cart:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load your cart"
      );

      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const updateCart = () => {
      loadCart();
    };

    window.addEventListener(
      "cartUpdated",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCart
      );
    };
  }, []);

  const refreshCartCount = () => {
    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const handleIncrease = async (item) => {
    const stock = Number(
      item.productId?.stock || 0
    );

    if (item.quantity >= stock) {
      return;
    }

    try {
      setUpdatingId(item._id);

      await increaseQty(item._id);
      await loadCart();
      refreshCartCount();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to increase quantity"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDecrease = async (item) => {
    if (Number(item.quantity) <= 1) {
      return;
    }

    try {
      setUpdatingId(item._id);

      await decreaseQty(item._id);
      await loadCart();
      refreshCartCount();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to decrease quantity"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const deleteItem = async (id) => {
    try {
      setUpdatingId(id);

      await removeCart(id);

      setCart((currentCart) => ({
        ...currentCart,
        items: currentCart.items.filter(
          (item) => item._id !== id
        ),
      }));

      await loadCart();
      refreshCartCount();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to remove item"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

          <h2 className="mt-5 text-xl font-semibold">
            Loading your cart...
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Preparing your selected products.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShoppingCart size={27} />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Unable to load cart
          </h2>

          <p className="mt-3 text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCart}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Your Selection
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <ShoppingCart size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Shopping Cart
              </h1>
            </div>

            <p className="mt-3 text-zinc-400">
              Review your products before
              proceeding to checkout.
            </p>
          </div>

          <div className="w-fit rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
            {cart.items.length}{" "}
            {cart.items.length === 1
              ? "item"
              : "items"}{" "}
            in cart
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-20 text-center shadow-xl shadow-black/20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-400">
              <ShoppingBag size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Your Cart Is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              Add products to your cart and they
              will appear here.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* Cart items */}
            <div className="space-y-5">
              {cart.items.map((item) => {
                const product =
                  item.productId || {};

                const quantity = Number(
                  item.quantity || 0
                );

                const price = Number(
                  product.price || 0
                );

                const stock = Number(
                  product.stock || 0
                );

                const itemTotal =
                  price * quantity;

                const isUpdating =
                  updatingId === item._id;

                return (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20 transition hover:border-zinc-700"
                  >
                    <div className="flex flex-col gap-6 p-5 sm:flex-row">
                      {/* Product image */}
                      <Link
                        to={
                          product._id
                            ? `/product/${product._id}`
                            : "#"
                        }
                        className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-white sm:h-40 sm:w-40"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={
                              product.name ||
                              "Product"
                            }
                            className="h-full w-full object-contain p-4 transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <Package
                            size={38}
                            className="text-zinc-400"
                          />
                        )}
                      </Link>

                      {/* Product details */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                          <div className="min-w-0">
                            <Link
                              to={
                                product._id
                                  ? `/product/${product._id}`
                                  : "#"
                              }
                            >
                              <h2 className="text-xl font-bold text-white transition hover:text-blue-400">
                                {product.name ||
                                  "Product unavailable"}
                              </h2>
                            </Link>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                              {product.description ||
                                "No product description available."}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <span className="text-xl font-extrabold text-blue-400">
                                ₹
                                {formatPrice(
                                  price
                                )}
                              </span>

                              {stock > 0 ? (
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                  {stock} in stock
                                </span>
                              ) : (
                                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                                  Out of stock
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteItem(item._id)
                            }
                            disabled={isUpdating}
                            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                            Remove
                          </button>
                        </div>

                        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
                          {/* Quantity controls */}
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                              Quantity
                            </p>

                            <div className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecrease(
                                    item
                                  )
                                }
                                disabled={
                                  quantity <= 1 ||
                                  isUpdating
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700"
                              >
                                <Minus size={18} />
                              </button>

                              <span className="min-w-12 text-center text-lg font-bold">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrease(
                                    item
                                  )
                                }
                                disabled={
                                  quantity >= stock ||
                                  stock <= 0 ||
                                  isUpdating
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                              Item Total
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-white">
                              ₹
                              {formatPrice(
                                itemTotal
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-blue-400"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <aside className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20 lg:sticky lg:top-28">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Final shipping charges are shown
                below.
              </p>

              <div className="mt-7 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">
                    Subtotal
                  </span>

                  <span className="font-semibold text-zinc-200">
                    ₹
                    {formatPrice(
                      cart.subtotal
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">
                    Shipping
                  </span>

                  <span className="font-semibold text-zinc-200">
                    ₹
                    {formatPrice(
                      cart.shipping
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">
                    Tax
                  </span>

                  <span className="font-semibold text-zinc-200">
                    ₹{formatPrice(cart.tax)}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-zinc-800" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Inclusive of applicable taxes
                  </p>
                </div>

                <p className="text-3xl font-extrabold text-blue-400">
                  ₹{formatPrice(cart.total)}
                </p>
              </div>

              <Link
                to="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="text-center text-xs leading-5 text-zinc-500">
                  Secure checkout. Your cart and
                  payment information are protected.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;