import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [updatingId, setUpdatingId] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();

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

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);

      await updateOrderStatus(id, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                orderStatus: status,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Failed to update order:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order._id
          ?.toLowerCase()
          .includes(query) ||
        order.userId?.name
          ?.toLowerCase()
          .includes(query) ||
        order.userId?.email
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(
        (order) =>
          order.orderStatus === "Pending"
      ).length,
      shipped: orders.filter(
        (order) =>
          order.orderStatus === "Shipped"
      ).length,
      delivered: orders.filter(
        (order) =>
          order.orderStatus === "Delivered"
      ).length,
    };
  }, [orders]);

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

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400";

      case "Failed":
        return "bg-red-500/10 text-red-400";

      default:
        return "bg-amber-500/10 text-amber-400";
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

  return (
    <section className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Order Management
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <ShoppingCart size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Manage Orders
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Review customer orders and update
              fulfilment status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Package size={22} />}
            label="Total Orders"
            value={summary.total}
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <SummaryCard
            icon={<Clock3 size={22} />}
            label="Pending"
            value={summary.pending}
            iconClass="bg-amber-500/10 text-amber-400"
          />

          <SummaryCard
            icon={<Truck size={22} />}
            label="Shipped"
            value={summary.shipped}
            iconClass="bg-purple-500/10 text-purple-400"
          />

          <SummaryCard
            icon={<CheckCircle2 size={22} />}
            label="Delivered"
            value={summary.delivered}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />
        </div>

        {/* Orders table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                All Orders
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {filteredOrders.length} of{" "}
                {orders.length} orders shown
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search customer or order ID"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                <option value="All">
                  All Statuses
                </option>

                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto animate-spin text-blue-400" />

                <p className="mt-4 text-zinc-400">
                  Loading orders...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <AlertTriangle size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Unable to load orders
              </h3>

              <p className="mt-2 text-zinc-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadOrders}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                <ShoppingCart size={29} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Orders Found
              </h3>

              <p className="mt-2 text-zinc-500">
                Try changing your search or
                status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px]">
                <thead className="bg-zinc-950/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <th className="px-6 py-4">
                      Order
                    </th>

                    <th className="px-6 py-4">
                      Customer
                    </th>

                    <th className="px-6 py-4">
                      Products
                    </th>

                    <th className="px-6 py-4">
                      Total
                    </th>

                    <th className="px-6 py-4">
                      Payment
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {filteredOrders.map(
                    (order) => {
                      const products =
                        Array.isArray(
                          order.products
                        )
                          ? order.products
                          : [];

                      const isUpdating =
                        updatingId === order._id;

                      const status =
                        order.orderStatus ||
                        "Pending";

                      return (
                        <tr
                          key={order._id}
                          className="align-top transition hover:bg-zinc-800/40"
                        >
                          <td className="px-6 py-5">
                            <p className="font-mono text-sm font-semibold text-zinc-300">
                              #
                              {order._id
                                ?.slice(-7)
                                .toUpperCase()}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                                {order.userId?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {order.userId?.name ||
                                    "Unknown User"}
                                </p>

                                <p className="mt-1 text-sm text-zinc-500">
                                  {order.userId
                                    ?.email ||
                                    "Email unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            {products.length ===
                            0 ? (
                              <span className="text-sm text-zinc-500">
                                No products
                              </span>
                            ) : (
                              <div className="max-w-xs space-y-2">
                                {products
                                  .slice(0, 3)
                                  .map(
                                    (
                                      item,
                                      index
                                    ) => (
                                      <div
                                        key={
                                          item._id ||
                                          index
                                        }
                                        className="flex items-center justify-between gap-4 rounded-lg bg-zinc-950/60 px-3 py-2 text-sm"
                                      >
                                        <span className="max-w-[190px] truncate text-zinc-300">
                                          {item
                                            .productId
                                            ?.name ||
                                            "Unavailable product"}
                                        </span>

                                        <span className="shrink-0 font-semibold text-zinc-500">
                                          ×
                                          {item.quantity ||
                                            0}
                                        </span>
                                      </div>
                                    )
                                  )}

                                {products.length >
                                  3 && (
                                  <p className="text-xs text-zinc-500">
                                    +
                                    {products.length -
                                      3}{" "}
                                    more products
                                  </p>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-5 font-bold text-blue-400">
                            ₹
                            {formatPrice(
                              order.total
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentClass(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus ||
                                "Pending"}
                            </span>

                            <p className="mt-2 text-xs text-zinc-500">
                              {order.paymentMethod ||
                                "Not specified"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>

                              <div className="relative">
                                <select
                                  value={status}
                                  onChange={(
                                    event
                                  ) =>
                                    handleStatusChange(
                                      order._id,
                                      event.target
                                        .value
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="w-40 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {statusOptions.map(
                                    (
                                      option
                                    ) => (
                                      <option
                                        key={
                                          option
                                        }
                                        value={
                                          option
                                        }
                                      >
                                        {
                                          option
                                        }
                                      </option>
                                    )
                                  )}
                                </select>

                                {isUpdating && (
                                  <Loader2
                                    size={16}
                                    className="absolute right-9 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
                                  />
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-start gap-2 text-sm text-zinc-400">
                              <CalendarDays
                                size={16}
                                className="mt-0.5 shrink-0"
                              />

                              <span>
                                {formatDate(
                                  order.createdAt
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-extrabold text-white">
        {value}
      </p>
    </div>
  );
};

export default AdminOrders;