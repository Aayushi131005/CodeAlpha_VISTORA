import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  IndianRupee,
  LayoutDashboard,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";

import { getDashboardStats } from "../api/dashboardApi";

const initialStats = {
  totalProducts: 0,
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  recentOrders: [],
};

const Dashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      setStats({
        totalProducts: Number(
          data?.totalProducts || 0
        ),
        totalUsers: Number(
          data?.totalUsers || 0
        ),
        totalOrders: Number(
          data?.totalOrders || 0
        ),
        totalRevenue: Number(
          data?.totalRevenue || 0
        ),
        recentOrders: Array.isArray(
          data?.recentOrders
        )
          ? data.recentOrders
          : [],
      });
    } catch (err) {
      console.error(
        "Failed to load dashboard:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
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

  const dashboardCards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      iconClass:
        "bg-blue-500/10 text-blue-400",
      link: "/admin",
      linkText: "Manage Products",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      iconClass:
        "bg-purple-500/10 text-purple-400",
      link: "/admin/orders",
      linkText: "Manage Orders",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      iconClass:
        "bg-emerald-500/10 text-emerald-400",
      link: "/admin/users",
      linkText: "Manage Users",
    },
    {
      title: "Revenue",
      value: `₹${formatPrice(
        stats.totalRevenue
      )}`,
      icon: IndianRupee,
      iconClass:
        "bg-amber-500/10 text-amber-400",
      link: "/admin/orders",
      linkText: "View Revenue",
    },
  ];

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

          <h2 className="mt-5 text-xl font-semibold">
            Loading dashboard...
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Fetching the latest store data.
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
            <LayoutDashboard size={27} />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Unable to load dashboard
          </h2>

          <p className="mt-3 text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
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
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Administration
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <LayoutDashboard size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Admin Dashboard
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Monitor store performance and manage
              products, orders and users.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            <RefreshCw size={17} />
            Refresh Data
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
                  >
                    <Icon size={24} />
                  </div>

                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-500">
                    Live
                  </span>
                </div>

                <p className="mt-6 text-sm font-semibold text-zinc-400">
                  {card.title}
                </p>

                <h2 className="mt-2 break-words text-3xl font-extrabold text-white">
                  {card.value}
                </h2>

                <Link
                  to={card.link}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition group-hover:text-blue-400"
                >
                  {card.linkText}
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <QuickAction
            to="/admin"
            icon={<Package size={20} />}
            title="Products"
            description="Add, update or remove store products."
          />

          <QuickAction
            to="/admin/orders"
            icon={<ShoppingCart size={20} />}
            title="Orders"
            description="Review orders and update delivery status."
          />

          <QuickAction
            to="/admin/users"
            icon={<Users size={20} />}
            title="Users"
            description="View and manage customer accounts."
          />
        </div>

        {/* Recent orders */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                The latest orders placed on
                Vistora.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
            >
              View All Orders
              <ArrowRight size={16} />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                <ShoppingCart size={29} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Recent Orders
              </h3>

              <p className="mt-2 text-zinc-500">
                New customer orders will appear
                here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-zinc-950/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <th className="px-6 py-4">
                      Order
                    </th>

                    <th className="px-6 py-4">
                      Customer
                    </th>

                    <th className="px-6 py-4">
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Total
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {stats.recentOrders.map(
                    (order) => {
                      const status =
                        order.orderStatus ||
                        "Pending";

                      return (
                        <tr
                          key={order._id}
                          className="transition hover:bg-zinc-800/40"
                        >
                          <td className="px-6 py-5">
                            <span className="font-mono text-sm font-semibold text-zinc-300">
                              #
                              {order._id
                                ?.slice(-6)
                                .toUpperCase()}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                                {order.userId?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <span className="font-semibold text-zinc-200">
                                {order.userId?.name ||
                                  "Unknown User"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-zinc-400">
                            {order.userId?.email ||
                              "Email unavailable"}
                          </td>

                          <td className="px-6 py-5 font-bold text-blue-400">
                            ₹
                            {formatPrice(
                              order.total
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>
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

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800/70"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          {description}
        </p>
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
      />
    </Link>
  );
};

export default Dashboard;