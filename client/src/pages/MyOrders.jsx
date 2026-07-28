import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getMyOrders } from "../api/orderApi";

const MyOrders = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?._id) {
        setError("Please log in again");
        setOrders([]);
        return;
      }

      const data = await getMyOrders(user._id);

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load orders:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      case "Shipped":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";

      case "Processing":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";

      case "Cancelled":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const formatDate = (value) => {
    if (!value) {
      return "Date unavailable";
    }

    return new Date(value).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

          <h2 className="mt-5 text-xl font-semibold">
            Loading your orders...
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Please wait while we fetch your
            purchases.
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
            <Package size={27} />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Unable to load orders
          </h2>

          <p className="mt-3 text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={loadOrders}
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
    <section className="min-h-[calc(100vh-76px)] w-full bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Order History
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <Package size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                My Orders
              </h1>
            </div>

            <p className="mt-3 text-zinc-400">
              View your purchases, payment
              details and delivery information.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}{" "}
            found
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-20 text-center shadow-xl shadow-black/20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-400">
              <ShoppingBag size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              You have not placed any orders yet.
              Start exploring Vistora and discover
              something you love.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const status =
                order.orderStatus || "Pending";

              const products = Array.isArray(
                order.products
              )
                ? order.products
                : [];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20"
                >
                  {/* Order header */}
                  <div className="flex flex-col gap-4 border-b border-zinc-800 bg-zinc-900/80 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Order ID
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        #
                        {order._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                        <CalendarDays size={16} />
                        {formatDate(
                          order.createdAt
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="p-6">
                    {products.length === 0 ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8 text-center text-zinc-500">
                        No products found in this
                        order
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map(
                          (item, index) => {
                            const product =
                              item.productId;

                            const itemTotal =
                              Number(
                                item.price || 0
                              ) *
                              Number(
                                item.quantity || 0
                              );

                            return (
                              <div
                                key={
                                  item._id ||
                                  product?._id ||
                                  index
                                }
                                className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center"
                              >
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-white">
                                  {product?.image ? (
                                    <img
                                      src={
                                        product.image
                                      }
                                      alt={
                                        product.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-contain p-2"
                                    />
                                  ) : (
                                    <Package
                                      size={30}
                                      className="text-zinc-500"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="truncate text-lg font-bold text-white">
                                    {product?.name ||
                                      "Product unavailable"}
                                  </h3>

                                  <p className="mt-2 text-sm text-zinc-400">
                                    Quantity:{" "}
                                    <span className="font-semibold text-zinc-200">
                                      {item.quantity ||
                                        0}
                                    </span>
                                  </p>

                                  <p className="mt-1 text-sm text-zinc-400">
                                    Price:{" "}
                                    <span className="font-semibold text-zinc-200">
                                      ₹
                                      {formatMoney(
                                        item.price
                                      )}
                                    </span>
                                  </p>
                                </div>

                                <div className="sm:text-right">
                                  <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                                    Item Total
                                  </p>

                                  <p className="mt-2 text-xl font-extrabold text-blue-400">
                                    ₹
                                    {formatMoney(
                                      itemTotal
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom details */}
                  <div className="grid gap-6 border-t border-zinc-800 bg-zinc-950/30 p-6 lg:grid-cols-2">
                    {/* Shipping address */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                          <MapPin size={20} />
                        </div>

                        <h3 className="text-lg font-bold">
                          Shipping Address
                        </h3>
                      </div>

                      {order.shippingAddress ? (
                        <div className="mt-5 space-y-2 text-sm leading-6 text-zinc-400">
                          <p className="font-semibold text-white">
                            {
                              order.shippingAddress
                                .fullName
                            }
                          </p>

                          <p>
                            {
                              order.shippingAddress
                                .address
                            }
                          </p>

                          <p>
                            {
                              order.shippingAddress
                                .city
                            }
                            {order.shippingAddress
                              .state
                              ? `, ${order.shippingAddress.state}`
                              : ""}
                          </p>

                          <p>
                            {
                              order.shippingAddress
                                .pincode
                            }
                          </p>

                          <p className="flex items-center gap-2">
                            <Phone size={15} />
                            {
                              order.shippingAddress
                                .phone
                            }
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-zinc-500">
                          Address unavailable
                        </p>
                      )}
                    </div>

                    {/* Payment summary */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                          <CreditCard size={20} />
                        </div>

                        <h3 className="text-lg font-bold">
                          Payment Summary
                        </h3>
                      </div>

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-400">
                            Payment Method
                          </span>

                          <span className="font-semibold text-zinc-200">
                            {order.paymentMethod ||
                              "Not specified"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">
                            Subtotal
                          </span>

                          <span>
                            ₹
                            {formatMoney(
                              order.subtotal
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">
                            Shipping
                          </span>

                          <span>
                            ₹
                            {formatMoney(
                              order.shipping
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">
                            Tax
                          </span>

                          <span>
                            ₹
                            {formatMoney(order.tax)}
                          </span>
                        </div>

                        <div className="my-4 border-t border-zinc-800" />

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            Total
                          </span>

                          <span className="text-2xl font-extrabold text-blue-400">
                            ₹
                            {formatMoney(
                              order.total
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {status === "Shipped" && (
                    <div className="flex items-center gap-3 border-t border-zinc-800 bg-blue-500/5 px-6 py-4 text-sm text-blue-300">
                      <Truck size={18} />
                      Your order is on the way.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;